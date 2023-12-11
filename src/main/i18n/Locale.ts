import { getObjectKey } from '@/util/Objects';
import { applyStringTemplate } from '@/util/Strings';
import zh_CN from '../../../resources/i18n/zh-CN.toml';

interface LocaleProc {
    activeLocale: string;
    locales: Record<string, TomlObject>;
}

const localeProc: LocaleProc = {
    activeLocale: '',
    locales: {
        'zh-CN': zh_CN
    }
};

/**
 * Sets active locale.
 * @param locale Standard locale name with country code.
 */
export function setLocale(locale: string) {
    localeProc.activeLocale = locale;
}

/**
 * Gets the translated text. Optionally providing a variable for templates.
 * @param key Text key.
 * @param values Values to apply.
 */
export function getTranslation(key: string, values?: Record<string, any>): string {
    const value = getObjectKey<string>(localeProc.locales[localeProc.activeLocale], key);
    if (value == undefined) {
        return key;
    }
    return applyStringTemplate(value, values ?? {});
}

/**
 * Same as {@link getTranslation} but replaces line breaks with HTML `br` element.
 * @param key Text key.
 * @param values Values to apply.
 */
export function getTranslationHTML(key: string, values?: Record<string, any>): string {
    return getTranslation(key, values).replaceAll('\n', '<br/>');
}

/**
 * Generator of {@link getTranslation} with a prefix.
 * @param prefix
 */
export function getTranslationSection(prefix: string): (key: string, values?: Record<string, any>) => string {
    return (k, v) => getTranslation(prefix + '.' + k, v);
}

/**
 * Alias of {@link getTranslation}.
 */
export const TR = getTranslation;

/**
 * Alias of {@link getTranslationSection}.
 */
export const TRC = getTranslationSection;

/**
 * Alias of {@link getTranslationHTML}.
 */
export const TRH = getTranslationHTML;
