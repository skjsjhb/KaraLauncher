import { hashFile } from '@/fs/Files';
import { TR, TRC } from '@/i18n/Locale';
import { SpeedMonitor } from '@/net/SpeedMeter';
import { DetailedError } from '@/util/Errors';
import { debug, error, info, warn } from '@/util/Logs';
import { ensureDir } from 'fs-extra';
import fetch from 'node-fetch';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { clearTimeout } from 'node:timers';
import { ProxyAgent } from 'proxy-agent';

/**
 * Profile including essential information for downloading a specific file.
 */
export interface DownloadProfile {
    url: {
        origin: string; // Original URL without being modified
        active: string; // Mirrored URL, disabled when failed
    };
    dest: string; // File store path
    size?: number; // Estimated size in bytes
    checksum?: string; // Hash
    validation?: string; // Validation method. A string representing hash algorithm, or 'size' to check file size only.
    tries?: number; // Retry times. Status code 4xx are not retried.
    headerTimeout?: number; // How long to wait before header is received
    minSpeed?: number; // Parameter for speed monitoring
}

/**
 * Represents error happened related with download.
 */
export class DownloadError extends DetailedError {}

/**
 * Downloads content using given profile and returns the status.<br/>
 * Does not check for existence nor validate.
 * @param p Download profile object.
 */
export async function downloadContent(p: DownloadProfile): Promise<boolean> {
    const t = TRC('main.downloader.download-content');
    let url = p.url.active;
    info(t('start', { url, dest: p.dest }));

    let lastError;
    let i = 0;

    for (; i < (p.tries ?? 1); i++) {
        if (lastError) {
            error(DetailedError.print(t('fail', { url: p.url.active }), lastError));

            // Switch to fallback URL
            if (p.url.origin != p.url.active) {
                warn(t('disable-mirror', { mirror: p.url.active, origin: p.url.origin }));
                url = p.url.active = p.url.origin;
            }

            warn(t('retry', { url: p.url.active, i }));
        }

        let res;
        const timectl = new AbortController();
        const timeout =
            p.headerTimeout &&
            setTimeout(() => {
                warn(t('timeout', { url, t: p.headerTimeout }));
                timectl.abort();
            }, p.headerTimeout);
        try {
            debug(t('connect', { url, timeout: p.headerTimeout }));
            res = await fetch(p.url.active, { signal: timectl.signal, agent: new ProxyAgent() });
        } catch (e) {
            lastError = new DownloadError(t('fetch-error'), e);
            continue;
        }
        if (timeout) {
            clearTimeout(timeout);
        }

        debug(t('res', { url, status: res.status }));

        if (res.status >= 400 && res.status < 500) {
            lastError = new DownloadError(t('invalid-status', { status: res.status }));
            continue;
        }

        if (!res.body) {
            lastError = new DownloadError(t('empty-body'));
            continue;
        }

        try {
            await ensureDir(path.dirname(p.dest));

            debug(t('pipe', { url, dest: p.dest, minSpeed: p.minSpeed }));

            if (p.minSpeed) {
                await pipeline(res.body, new SpeedMonitor(p.minSpeed, 500), createWriteStream(p.dest));
            } else {
                await pipeline(res.body, createWriteStream(p.dest));
            }
            lastError = null;
            break;
        } catch (e) {
            lastError = new DownloadError(t('pipe-error', { dest: p.dest }), e);
        }
    }
    if (lastError) {
        error(DetailedError.print(t('failed', { url, i }), lastError));
        return false;
    } else {
        info(t('done', { url, dest: p.dest }));
        return true;
    }
}

/**
 * Validates given file using hash and algorithm specified.
 * @param f File path.
 * @param hash Hash content.
 * @param algo Hash algorithm.
 */
export async function validateFile(f: string, hash: string, algo: string = 'sha1'): Promise<boolean> {
    const h = (await hashFile(f, algo)).toLowerCase().trim();
    const match = h == hash;
    if (!match) {
        warn(TR('main.downloader.validate-file.mismatch', { f, expected: hash, actual: h }));
    }
    return match;
}
