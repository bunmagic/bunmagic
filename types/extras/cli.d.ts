declare function stdout(content: string): Promise<number>;
declare function moveUp(count?: number): Promise<void>;
declare function clearLines(count?: number): Promise<void>;
declare function hideCursor(): Promise<void>;
declare function showCursor(): Promise<void>;
declare function raw(on: boolean): Promise<void>;
declare function clearFrame(frame: string, wipe?: boolean): Promise<void>;
declare function stream(): {
    start: () => AsyncGenerator<Uint8Array, void, unknown>;
    stop: () => void;
};
export declare const CLI: {
    readonly stdout: typeof stdout;
    readonly moveUp: typeof moveUp;
    readonly clearLines: typeof clearLines;
    readonly hideCursor: typeof hideCursor;
    readonly showCursor: typeof showCursor;
    readonly clearFrame: typeof clearFrame;
    readonly raw: typeof raw;
    readonly stream: typeof stream;
};
export {};
