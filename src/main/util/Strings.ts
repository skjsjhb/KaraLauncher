/**
 * Applies given variables to a string template with `${key}` as placeholders. Empty values are replaced with `(NULL)`.
 * @param s String template.
 * @param t Variables to apply.
 */
export function applyStringTemplate(s: string, t: Record<string, string>): string {
    let result = s;
    for (const [key, value] of Object.entries(t)) {
        result = result.replaceAll('${' + key + '}', value || '(NULL)');
    }
    return result;
}
