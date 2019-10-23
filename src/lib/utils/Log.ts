export class Log {
    private logger: string
    constructor(logger: string) {
        this.logger = logger;
    }
    debug(txt: any) {
        console.log(`[${this.logger}] `, txt);
    }
    warn(txt: any) {
        console.warn(`[${this.logger}] `, txt);
    }
    error(txt: any) {
        console.error(`[${this.logger}] `, txt);
    }
    static init(logger: string) {
        return new Log(logger);
    }
}

export const Logger = Log.init("default");