import chalk from 'chalk';

/**
 * Raise info message.
 * @param msg info message.
 */
export function info(msg: string) {
    log(msg, 'info');
}

/**
 * Raise warning message.
 * @param msg Warning message.
 */
export function warn(msg: string) {
    log(msg, 'warn');
}

/**
 * Raise error message.
 * @param msg Error message.
 */
export function error(msg: string) {
    log(msg, 'error');
}

/**
 * Raise debug message.
 * @param msg Debug message.
 */
export function debug(msg: string) {
    log(msg, 'debug');
}

function levelText(level: string): string {
    switch (level) {
        case 'error':
            return 'ERR!';
        case 'warn':
            return 'WARN';
        case 'info':
            return 'INFO';
        case 'debug':
            return 'DBUG';
        default:
            return '????';
    }
}

function colorLevel(level: string) {
    switch (level) {
        case 'error':
            return chalk.redBright.bold;
        case 'warn':
            return chalk.yellowBright.bold;
        case 'info':
            return chalk.greenBright.bold;
        case 'debug':
            return chalk.cyanBright.bold;
        default:
            return chalk.white.bold;
    }
}

function colorMessageLevel(level: string) {
    switch (level) {
        case 'error':
            return chalk.red;
        case 'warn':
            return chalk.yellow;
        case 'info':
            return chalk.white;
        case 'debug':
            return chalk.gray;
        default:
            return chalk.white;
    }
}

function log(msg: string, level: string) {
    const time = new Date().toLocaleTimeString();

    msg.split('\n').forEach((m) => {
        const str = `${chalk.grey(time)} ${colorLevel(level)(levelText(level))} ${colorMessageLevel(level)(m)}`;
        if (level == 'error') {
            console.error(str);
        } else {
            console.log(str);
        }
    });
}
