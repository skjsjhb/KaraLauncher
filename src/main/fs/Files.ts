import { TR } from '@/i18n/Locale';
import { DetailedError } from '@/util/Errors';
import { warn } from '@/util/Logs';
import * as fs from 'fs';
import { access, readFile } from 'fs-extra';
import { createHash } from 'node:crypto';

/**
 * Generate hash of given file and algorithm. Returns hash hex in lowercase.
 * @param src Path to file.
 * @param algo Hash algorithm. `sha1` by default.
 */
export async function hashFile(src: string, algo: string = 'sha1'): Promise<string> {
    try {
        const content = await readFile(src);
        const hasher = createHash(algo);
        hasher.update(content);
        return hasher.digest('hex');
    } catch (e) {
        warn(DetailedError.print(TR('main.fs.hash-failed', { src }), e));
        return '';
    }
}

/**
 * Checks for file existence.
 * @param src File path.
 * @param flags File flags to verify. RW is set if not specified.
 */
export async function exists(
    src: string,
    flags: number = fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK
): Promise<boolean> {
    try {
        await access(src, flags);
        return true;
    } catch (e) {
        return false;
    }
}
