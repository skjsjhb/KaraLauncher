import { TR } from '@/i18n/Locale';
import { info } from '@/util/Logs';
import { getProxySettings } from 'get-proxy-settings';

export async function setupProxy() {
    const proxy = await getProxySettings();
    if (proxy) {
        const http = proxy.http?.toString();
        const https = proxy.https?.toString();
        info(TR('main.net.proxy-man.set-http', { url: http }));
        info(TR('main.net.proxy-man.set-https', { url: https }));
        process.env['HTTP_PROXY'] = http;
        process.env['HTTPS_PROXY'] = https;
    }
}
