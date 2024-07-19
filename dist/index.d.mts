declare class Trace {
    label: any;
    cfg: {};
    static levels: {
        log: {
            color: number;
            label: string;
        };
        error: {
            color: number;
            label: string;
        };
        warn: {
            color: number;
            label: string;
        };
        info: {
            color: number;
            label: string;
        };
        debug: {
            color: number;
            label: string;
        };
        trace: {
            color: number;
            label: string;
        };
    };
    constructor(label?: any, cfg?: {});
    clone(label?: any): Trace;
    configure(cfg?: {}): void;
    out(msg: any, { label, tags, level }?: {
        label?: any;
        tags?: any[];
        level?: string;
    }): void;
    log(msg: string, tags?: string[], label?: string): void;
    error(msg: string, tags?: string[], label?: string): void;
    warn(msg: string, tags?: string[], label?: string): void;
    info(msg: string, tags?: string[], label?: string): void;
    debug(msg: string, tags?: string[], label?: string): void;
    trace(msg: string, tags?: string[], label?: string): void;
    static out(msg: any, { label, tags, level }?: {
        label?: any;
        tags?: any[];
        level?: string;
    }, cfg?: {
        [key: string]: any;
    }): void;
    static checkLevel(level: any, traceLevel?: string): boolean;
    static checkTags(tags: any, label?: any, cfg?: any): boolean;
    static color(str: any, color: any): string;
    static colorString(str: any): string;
    static log(msg: any, tags?: string[], label?: string): void;
    static error(msg: any, tags: any[], label: any): void;
    static warn(msg: any, tags: any[], label: any): void;
    static info(msg: any, tags: any[], label: any): void;
    static debug(msg: any, tags: any[], label: any): void;
    static trace(msg: any, tags: any[], label: any): void;
}

export { Trace, Trace as default };
