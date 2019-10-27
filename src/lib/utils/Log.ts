let globalCount: number = 0
export class Log {
    private logger: string
    constructor(logger: string) {
        this.logger = logger;
    }
    private getLogTxt(args: any[]): any[] {
        args.unshift(`${globalCount++} [${this.logger}]`);
        return args;
    }
    debug(...args: any[]) {
        console.log.apply(window, this.getLogTxt(args));
    }
    warn(...args: any[]) {
        console.warn.apply(window, this.getLogTxt(args));
    }
    error(...args: any[]) {
        console.error.apply(window, this.getLogTxt(args));
    }
    static init(logger: string) {
        return new Log(logger);
    }
}

export const Logger = Log.init("default");