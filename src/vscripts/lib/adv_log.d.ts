/**
 * Also overrides default `print()` function to log at level `info` and support
 * printing tables
 */
declare interface log {
    debug(obj: any): void;
    info(obj: any): void;
    warn(obj: any): void;
    critical(obj: any): void;
    crit(obj: any): void;
    error(obj: any): void;
}

declare var log: log;
