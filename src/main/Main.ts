import { setLocale, TR } from '@/i18n/Locale';
import { downloadContent } from '@/net/Downloader';
import { setupProxy } from '@/net/ProxyMan';
import { DetailedError } from '@/util/Errors';
import { error, info } from '@/util/Logs';
import { app } from 'kara';
import pkg from '../../package.json';

async function main() {
    await app.whenReady();
    setLocale('zh-CN');
    info(TR('main.info.version', { version: pkg.version }));
    await setupProxy();
    try {
        await downloadContent({
            url: {
                origin: 'https://github.com/skjsjhb/kara',
                active: 'https://github.com/skjsjhb/kara'
            },
            dest: 'a.html',
            tries: 3,
            headerTimeout: 5000
        });
    } catch (e) {
        error((e as DetailedError).toLocalizedString());
    }

    app.quit();
}

void main();
