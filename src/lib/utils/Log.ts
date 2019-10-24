export class Log {
    private logger: string
    constructor(logger: string) {
        this.logger = logger;
    }
    debug(...args: any[]) {
        args.unshift(`[${this.logger}] `);
        console.log.apply(window, args);
    }
    warn(...args: any[]) {
        args.unshift(`[${this.logger}] `);
        console.warn.apply(window, args);
    }
    error(...args: any[]) {
        args.unshift(`[${this.logger}] `)
        console.error.apply(window, args);
    }
    static init(logger: string) {
        return new Log(logger);
    }
}

export const Logger = Log.init("default");