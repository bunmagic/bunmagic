/// <reference types="bun-types" />
/// <reference types="bun-types" />
declare class Spinner {
    private static spinners;
    private static linesRendered;
    private static interval;
    private static readonly consoleRef;
    private static tick;
    private static disableConsole;
    private static enableConsole;
    private static onFirstStart;
    private static onFinalStop;
    private status;
    private animationIndex;
    private label;
    private readonly animation;
    private error;
    setLabel: (text: string) => void;
    frame(): Promise<string>;
    start(): Promise<void>;
    stop(): Promise<void>;
    setError(error: unknown): void;
    setStatus(status: 'success' | 'error'): void;
}
declare const $quiet: (strings: TemplateStringsArray, ...expressions: import("bun").ShellExpression[]) => import("bun").ShellPromise;
type Callback<T> = ($: typeof $quiet, setLabel: Spinner['setLabel']) => Promise<T>;
export declare function $spinner<T>(label: string, callback: Callback<T>): Promise<T>;
export declare function $spinner<T>(callback: Callback<T>): Promise<T>;
export {};
