import { TR } from '@/i18n/Locale';

/**
 * Error class with detailed stack and localization support.
 */
export class DetailedError extends Error {
    readonly message: string;
    readonly cause: DetailedError | null;
    readonly stack: string;

    constructor(message: string, cause?: any, stackPop: number = 3) {
        super(message);
        this.message = message;
        this.cause = cause == null ? null : DetailedError.wrap(cause);
        this.stack = getCurrentStack(stackPop);
    }

    /**
     * Constructs a detailed error object with given error and convert it to string.
     * @param msg Explain message.
     * @param e Original error object.
     */
    static print(msg: string, e: any): string {
        return new DetailedError(msg, e).toLocalizedString();
    }

    /**
     * Constructs error object from raw error thrown.
     * @param e Error object.
     */
    static wrap(e: any): DetailedError {
        if (e instanceof DetailedError) {
            return e;
        }
        const message = e?.message ?? (typeof e?.toString == 'function' ? e.toString() : String(e));
        return new DetailedError(message, undefined);
    }

    /**
     * Prints the error with localized text and stack trace.
     * @param role Control what is the role of this error in the trace (`message` or `cause`).
     * @param stack Whether to include stack information in output.
     */
    toLocalizedString(role: 'message' | 'cause' = 'message', stack: boolean = true): string {
        let out = TR(`main.common.error.${role}`, { message: this.message });
        if (this.stack) {
            out += '\n' + this.stack;
        }
        if (this.cause != null) {
            out += '\n' + this.cause.toLocalizedString('cause', stack);
        }
        return out;
    }
}

/**
 * Gets the current stack trace. The stack message is retrieved using an Error object.
 * @param pop The number of stack frames to remove from the trace. Removes two by default, i.e. the caller and itself.
 */
export function getCurrentStack(pop: number = 2): string {
    const original = Error().stack ?? '\n';
    return original
        .split('\n')
        .slice(pop) // Remove stack of this method
        .join('\n');
}
