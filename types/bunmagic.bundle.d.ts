import ansis$1 from 'ansis';
import { $ as $$1, BunFile, GlobScanOptions } from 'bun';
import * as os from 'node:os';
import * as path$1 from 'node:path';

/**
 * Not minimist.
 * Produces pretty similar output though.
 * Might be all that we need.
 */
export type StructuredArguments = {
	flags: Record<string, string | number | boolean | undefined>;
	args: string[];
};
declare function notMinimist$1(input: string[]): StructuredArguments;
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
	setStatus(status: "success" | "error"): void;
}
declare const $quiet: (...properties: Parameters<typeof $$1>) => $$1.ShellPromise;
export type Callback<T> = ($: typeof $quiet, setLabel: Spinner["setLabel"]) => Promise<T>;
declare function $spinner$1<T>(label: string, callback: Callback<T>): Promise<T>;
declare function $spinner$1<T>(callback: Callback<T>): Promise<T>;
declare function slugify$1(text: string): string;
declare function openEditor$1(path: string): Promise<boolean>;
declare function stdout(content: string): Promise<number>;
declare function moveUp(count?: number): Promise<void>;
declare function moveDown(count?: number): Promise<void>;
declare function moveRight(count?: number): Promise<void>;
declare function moveLeft(count?: number): Promise<void>;
declare function clearLines(count?: number): Promise<void>;
declare function replaceLine(...messages: string[]): Promise<void>;
declare function clearLine(): Promise<void>;
declare function clearUp(count?: number): Promise<void>;
declare function hideCursor(): Promise<void>;
declare function showCursor(): Promise<void>;
declare function raw(on: boolean): Promise<void>;
declare function clearFrame(frame: string, wipe?: boolean): Promise<void>;
declare function stream(): {
	start: () => AsyncGenerator<Uint8Array<ArrayBufferLike>, void, unknown>;
	stop: () => void;
};
declare const CLI$1: {
	readonly stdout: typeof stdout;
	readonly moveUp: typeof moveUp;
	readonly moveDown: typeof moveDown;
	readonly moveRight: typeof moveRight;
	readonly moveLeft: typeof moveLeft;
	readonly clearLines: typeof clearLines;
	readonly clearLine: typeof clearLine;
	readonly replaceLine: typeof replaceLine;
	readonly clearUp: typeof clearUp;
	readonly hideCursor: typeof hideCursor;
	readonly showCursor: typeof showCursor;
	readonly clearFrame: typeof clearFrame;
	readonly raw: typeof raw;
	readonly stream: typeof stream;
};
export declare function isMacOS(): Promise<boolean>;
declare function copyToClipboard$1(text: string): Promise<void>;
/**
 * Swiss Army File manager
 * @deprecated SAF is deprecated and will be removed in v1.5.0. Use `files.*` helpers.
 */
declare class SAF$1 {
	#private;
	/**
	 * Safe mode ensures that when the file is moved or renamed,
	 * it will not overwrite an existing file at the destination.
	 */
	safeMode: boolean;
	/**
	 * How to separate the base name from the iteration number
	 */
	safeSeparator: string;
	constructor(handle: string);
	/**
	 * Get a SAF instance from a target path
	 * @deprecated SAF is deprecated and will be removed in v1.5.0. Use `files.*` helpers.
	 */
	static from(dir: string, target: string): SAF$1;
	static from(target: string): SAF$1;
	/**
	 * Prepare a target path for writing
	 * @deprecated SAF is deprecated and will be removed in v1.5.0. Use `files.*` helpers.
	 */
	static prepare(target: string): Promise<SAF$1>;
	/**
	 *
	 * - Utilities
	 *
	 */
	/**
	 * `/path/to/file.txt` -> `file`
	 */
	get base(): string | undefined;
	set base(value: string);
	/**
	 * `/path/to/file.txt` -> `file.txt`
	 */
	get name(): string | undefined;
	set name(value: string);
	/**
	 * `/path/to/file.txt` -> `/path/to`
	 */
	get directory(): string;
	set directory(value: string);
	/**
	 * `/path/to/file.txt` -> `.txt`
	 */
	get extension(): string;
	set extension(value: string);
	/**
	 * `/path/to/file.txt`
	 */
	get path(): string;
	set path(value: string);
	/**
	 * Get the Bun file instance
	 */
	get file(): BunFile;
	unsafe(): this;
	safe(): this;
	/**
	 * Quickly read/write JSON
	 */
	json<T = unknown>(data?: T): Promise<T>;
	update(): Promise<this>;
	exists(): Promise<boolean>;
	isFile(): Promise<boolean>;
	isDirectory(): Promise<boolean>;
	write(input: Blob | NodeJS.TypedArray | ArrayBufferLike | string | Bun.BlobPart[] | BunFile): Promise<number>;
	bytes(): Promise<Uint8Array>;
	delete(postDelete?: "clear_handle" | "keep_handle"): Promise<this>;
	ensureDirectory(): Promise<void>;
	edit(callback: (content: string) => string | Promise<string>): Promise<this>;
	/**
	 *
	 * - Serialization
	 *
	 */
	toString(): string;
	valueOf(): string;
	/**
	 * Generates a safe filename by appending a number if the file already exists
	 * @param newPath The desired new path
	 * @returns A safe path that doesn't exist
	 */
	private getSafePath;
}
export type PathLike = string;
export type BlobInput = Blob | NodeJS.TypedArray | ArrayBufferLike | string | Bun.BlobPart[] | BunFile;
export type SuffixOptions = {
	separator?: string;
	start?: number;
	maxAttempts?: number;
};
export type MoveCopyOptions = {
	overwrite?: boolean;
	errorOnExist?: boolean;
};
export type WriteTextOptions = {
	flag?: "w" | "wx";
	atomic?: boolean;
};
export declare function resolve(input: PathLike, ...rest: PathLike[]): string;
export declare function stem(input: PathLike): string;
export declare function pathExists(target: PathLike): Promise<boolean>;
export declare function isFile(target: PathLike): Promise<boolean>;
export declare function isDir(target: PathLike): Promise<boolean>;
export declare function ensureDir(target: PathLike): Promise<string>;
export declare function ensureFile(target: PathLike): Promise<string>;
export declare function emptyDir(target: PathLike): Promise<string>;
export declare function readFile(target: PathLike): Promise<string>;
export declare function readBytes(target: PathLike): Promise<Uint8Array<ArrayBuffer>>;
export declare function writeFile(target: PathLike, input: BlobInput, options?: WriteTextOptions): Promise<number>;
export declare function outputFile(target: PathLike, input: BlobInput, options?: WriteTextOptions): Promise<number>;
export declare function editFile(target: PathLike, updater: (content: string) => string | Promise<string>, options?: WriteTextOptions): Promise<string>;
export declare function copy(source: PathLike, destination: PathLike, options?: MoveCopyOptions): Promise<string>;
export declare function move(source: PathLike, destination: PathLike, options?: MoveCopyOptions): Promise<string>;
export declare function remove(target: PathLike): Promise<string>;
declare function glob$1(pattern?: string, options?: GlobScanOptions): Promise<string[]>;
export declare function ensureUniquePath(target: PathLike, options?: SuffixOptions): Promise<string>;
export declare function writeFileSafe(target: PathLike, input: BlobInput, options?: WriteTextOptions & {
	suffix?: SuffixOptions;
}): Promise<string>;
export declare function copySafe(source: PathLike, destination: PathLike, options?: MoveCopyOptions & {
	suffix?: SuffixOptions;
}): Promise<string>;
export declare function moveSafe(source: PathLike, destination: PathLike, options?: MoveCopyOptions & {
	suffix?: SuffixOptions;
}): Promise<string>;
declare const files$1: {
	readonly resolve: typeof resolve;
	readonly stem: typeof stem;
	readonly pathExists: typeof pathExists;
	readonly isFile: typeof isFile;
	readonly isDir: typeof isDir;
	readonly ensureDir: typeof ensureDir;
	readonly ensureFile: typeof ensureFile;
	readonly emptyDir: typeof emptyDir;
	readonly readFile: typeof readFile;
	readonly readBytes: typeof readBytes;
	readonly writeFile: typeof writeFile;
	readonly outputFile: typeof outputFile;
	readonly editFile: typeof editFile;
	readonly copy: typeof copy;
	readonly move: typeof move;
	readonly remove: typeof remove;
	readonly glob: typeof glob$1;
	readonly ensureUniquePath: typeof ensureUniquePath;
	readonly writeFileSafe: typeof writeFileSafe;
	readonly copySafe: typeof copySafe;
	readonly moveSafe: typeof moveSafe;
};
declare function isDirectory$1(target: string): Promise<boolean>;
declare function ensureDirectory$1(target: string): Promise<boolean>;
declare function cd$1(target: string | SAF$1): void;
declare function cwd$1(): Promise<string>;
declare function resolveTilde$1(input: string): string;
declare function glob$1(pattern?: string, options?: GlobScanOptions): Promise<string[]>;
/**
 * Display help information for the current script.
 * This function reads the JSDoc metadata from the calling script
 * and displays formatted help information.
 *
 * @example
 * if (flags.help) {
 *   await showHelp();
 *   throw new Exit(0);
 * }
 */
declare function showHelp$1(): Promise<void>;
declare function select$1<T extends string>(message: string, options: T[] | {
	value: T;
	label: string;
}[]): Promise<T>;
declare function autoselect$1<T extends string>(message: string, options: T[], flag: string): Promise<T>;
declare function getPassword$1(message: string): Promise<string>;
export type HandleAskResponse = "required" | "use_default" | ((answer: string | undefined) => Promise<string>);
declare function ask$1(q: string, defaultAnswer?: string, handle?: HandleAskResponse): Promise<string>;
/**
 * Read all data from stdin as a string.
 * Useful for piping data into Bunmagic scripts.
 *
 * @returns Promise that resolves to the complete stdin content as a string
 *
 * @example
 * ```ts
 * // Read piped input
 * const input = await $stdin()
 * console.log(`Received: ${input}`)
 * ```
 *
 * @example
 * ```bash
 * # Pipe data into your script
 * echo "Hello, World!" | bunmagic run my-script
 * cat data.txt | bunmagic run process-data
 * ```
 */
declare function $stdin$1(): Promise<string>;
/**
 * Run a shell command and return the result as text,
 * even if it's an error.
 */
declare function $get$1(...properties: Parameters<typeof $>): Promise<string>;
declare function ack$1(q: string, defaultAnswer?: "y" | "n"): boolean;
declare class Exit$1 extends Error {
	constructor(error?: unknown);
	private indent;
	private exit;
}
declare function die$1(output: unknown): void;
export declare const sleep: (ms: number) => Promise<void>;
declare const args$1: string[], flags$1: Record<string, string | number | boolean>;
declare const argv$1: {
	_: string[];
};
declare const $HOME$1: string;
declare global {
	const $: typeof $$1;
	const ansis: typeof ansis$1;
	const path: typeof path$1;
	const argv: typeof argv$1;
	const args: typeof args$1;
	const flags: typeof flags$1;
	const select: typeof select$1;
	const autoselect: typeof autoselect$1;
	const getPassword: typeof getPassword$1;
	const $spinner: typeof $spinner$1;
	const cd: typeof cd$1;
	const ack: typeof ack$1;
	const ask: typeof ask$1;
	const isDirectory: typeof isDirectory$1;
	const ensureDirectory: typeof ensureDirectory$1;
	const notMinimist: typeof notMinimist$1;
	const Exit: typeof Exit$1;
	const $HOME: typeof $HOME$1;
	const $get: typeof $get$1;
	const glob: typeof glob$1;
	const files: typeof files$1;
	const openEditor: typeof openEditor$1;
	const slugify: typeof slugify$1;
	const resolveTilde: typeof resolveTilde$1;
	const cwd: typeof cwd$1;
	const SAF: typeof SAF$1;
	const die: typeof die$1;
	const copyToClipboard: typeof copyToClipboard$1;
	const CLI: typeof CLI$1;
	const showHelp: typeof showHelp$1;
	const $stdin: typeof $stdin$1;
}
export type Subcommand<Arguments = unknown[], ReturnValue = void> = (...parameters: Arguments[]) => Promise<ReturnValue>;
declare class Subcommands<Callback, Config extends Record<string, Callback>, Name extends keyof Config = keyof Config> {
	private readonly _commands;
	constructor(commands: Config);
	name(commandName: string): Name;
	get<N extends Name>(commandName?: N): Config[N];
	get<F extends Name>(commandName: string | undefined, fallback: F): Config[F];
	get commands(): Name[];
	maybeHelp(): this;
}
/**
 * TypeScript doesn't support partial type inference,
 * So we need to use a factory function to create the subcommands.
 */
export declare function subcommandFactory<Arguments = unknown[], ReturnValue = void>(): <Name extends string, Config extends Record<Name, Subcommand<Arguments, ReturnValue>>>(commands: Config) => Subcommands<unknown, Config, keyof Config>;
export declare const subcommands: <Name extends string, Config extends Record<Name, Subcommand<never, void>>>(commands: Config) => Subcommands<unknown, Config, keyof Config>;
export type ColumnConfig = "auto" | "" | number | `${number}%`;
export declare class Columns<T extends number = number, Row extends string | string[] = string | string[]> {
	private readonly columnCount;
	private readonly config;
	indent: number;
	gap: number;
	private readonly rows;
	private isBuffering;
	constructor(columnCount: T, config?: ColumnConfig[]);
	log(data: Row): this;
	buffer(): this;
	flush(): string;
	flushLog(): void;
	render(): string;
	private wrapText;
	private nearestWrap;
	private calculateColumnWidths;
	private fitWidths;
	private renderRow;
	private getColumnWidths;
}

export {
	$$1 as $,
	$HOME$1 as $HOME,
	$get$1 as $get,
	$spinner$1 as $spinner,
	$stdin$1 as $stdin,
	CLI$1 as CLI,
	Exit$1 as Exit,
	SAF$1 as SAF,
	ack$1 as ack,
	ansis$1 as ansis,
	ansis$1 as chalk,
	args$1 as args,
	argv$1 as argv,
	ask$1 as ask,
	autoselect$1 as autoselect,
	cd$1 as cd,
	copyToClipboard$1 as copyToClipboard,
	cwd$1 as cwd,
	die$1 as die,
	ensureDirectory$1 as ensureDirectory,
	files$1 as files,
	flags$1 as flags,
	getPassword$1 as getPassword,
	glob$1 as glob,
	isDirectory$1 as isDirectory,
	notMinimist$1 as notMinimist,
	openEditor$1 as openEditor,
	os,
	path$1 as path,
	resolveTilde$1 as resolveTilde,
	select$1 as select,
	showHelp$1 as showHelp,
	slugify$1 as slugify,
};

export {};


// bun-types
/// <reference types="node" />

// Project: https://github.com/oven-sh/bun
// Definitions by: Bun Contributors <https://github.com/oven-sh/bun/graphs/contributors>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped




// @ts-ignore Must disable this so it doesn't conflict with the DOM onmessage type, but still
// allows us to declare our own globals that Node's types can "see" and not conflict with
declare var onmessage: never;


declare module "bun" {
  namespace __internal {
    type NodeWorkerThreadsWorker = import("node:worker_threads").Worker;
    type LibWorkerOrBunWorker = Bun.__internal.UseLibDomIfAvailable<"Worker", Bun.Worker>;

    type LibPerformanceOrNodePerfHooksPerformance = Bun.__internal.UseLibDomIfAvailable<
      "Performance",
      import("perf_hooks").Performance
    >;

    type NodeCryptoWebcryptoSubtleCrypto = import("crypto").webcrypto.SubtleCrypto;
    type NodeCryptoWebcryptoCryptoKey = import("crypto").webcrypto.CryptoKey;
    type NodeCryptoWebcryptoCryptoKeyPair = import("crypto").webcrypto.CryptoKeyPair;

    type LibEmptyOrBunWebSocket = LibDomIsLoaded extends true ? {} : Bun.WebSocket;

    type LibEmptyOrNodeUtilTextEncoder = LibDomIsLoaded extends true ? {} : import("node:util").TextEncoder;

    type LibEmptyOrNodeUtilTextDecoder = LibDomIsLoaded extends true ? {} : import("node:util").TextDecoder;

    type LibEmptyOrNodeReadableStream<T> = LibDomIsLoaded extends true
      ? {}
      : import("node:stream/web").ReadableStream<T>;

    type LibEmptyOrNodeWritableStream<T> = LibDomIsLoaded extends true
      ? {}
      : import("node:stream/web").WritableStream<T>;

    type LibEmptyOrNodeMessagePort = LibDomIsLoaded extends true ? {} : import("node:worker_threads").MessagePort;
  }
}

interface ReadableStream<R = any> extends Bun.__internal.LibEmptyOrNodeReadableStream<R> {}
declare var ReadableStream: Bun.__internal.UseLibDomIfAvailable<
  "ReadableStream",
  {
    prototype: ReadableStream;
    new <R = any>(underlyingSource?: Bun.UnderlyingSource<R>, strategy?: QueuingStrategy<R>): ReadableStream<R>;
    new <R = any>(underlyingSource?: Bun.DirectUnderlyingSource<R>, strategy?: QueuingStrategy<R>): ReadableStream<R>;
  }
>;

interface WritableStream<W = any> extends Bun.__internal.LibEmptyOrNodeWritableStream<W> {}
declare var WritableStream: Bun.__internal.UseLibDomIfAvailable<
  "WritableStream",
  {
    prototype: WritableStream;
    new <W = any>(underlyingSink?: Bun.UnderlyingSink<W>, strategy?: QueuingStrategy<W>): WritableStream<W>;
  }
>;

interface Worker extends Bun.__internal.LibWorkerOrBunWorker {}
declare var Worker: Bun.__internal.UseLibDomIfAvailable<
  "Worker",
  {
    prototype: Worker;
    new (scriptURL: string | URL, options?: Bun.WorkerOptions | undefined): Worker;
    /**
     * This is the cloned value of the `data` property passed to `new Worker()`
     *
     * This is Bun's equivalent of `workerData` in Node.js.
     */
    data: any;
  }
>;

/**
 * A WebSocket client implementation.
 */
interface WebSocket extends Bun.__internal.LibEmptyOrBunWebSocket {}
/**
 * A WebSocket client implementation
 */
declare var WebSocket: Bun.__internal.UseLibDomIfAvailable<
  "WebSocket",
  {
    prototype: WebSocket;

    /**
     * Creates a new WebSocket instance with the given URL and options.
     *
     * @param url The URL to connect to.
     * @param options The options to use for the connection.
     *
     * @example
     * ```ts
     * const ws = new WebSocket("wss://dev.local", {
     *  protocols: ["proto1", "proto2"],
     *  headers: {
     *    "Cookie": "session=123456",
     *  },
     * });
     * ```
     */
    new (url: string | URL, options?: Bun.WebSocketOptions): WebSocket;

    /**
     * Creates a new WebSocket instance with the given URL and protocols.
     *
     * @param url The URL to connect to.
     * @param protocols The protocols to use for the connection.
     *
     * @example
     * ```ts
     * const ws = new WebSocket("wss://dev.local");
     * const ws = new WebSocket("wss://dev.local", ["proto1", "proto2"]);
     * ```
     */
    new (url: string | URL, protocols?: string | string[]): WebSocket;

    /**
     * The connection is not yet open
     */
    readonly CONNECTING: 0;

    /**
     * The connection is open and ready to communicate
     */
    readonly OPEN: 1;

    /**
     * The connection is in the process of closing
     */
    readonly CLOSING: 2;

    /**
     * The connection is closed or couldn't be opened
     */
    readonly CLOSED: 3;
  }
>;

interface Crypto {
  readonly subtle: SubtleCrypto;

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Crypto/getRandomValues) */
  getRandomValues<T extends ArrayBufferView | null>(array: T): T;

  /**
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Crypto/randomUUID)
   */
  randomUUID(): `${string}-${string}-${string}-${string}-${string}`;

  timingSafeEqual: typeof import("node:crypto").timingSafeEqual;
}
declare var Crypto: {
  prototype: Crypto;
  new (): Crypto;
};
declare var crypto: Crypto;

/**
 * An implementation of the [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) `TextEncoder` API. All
 * instances of `TextEncoder` only support UTF-8 encoding.
 *
 * ```js
 * const encoder = new TextEncoder();
 * const uint8array = encoder.encode('this is some data');
 * ```
 */
interface TextEncoder extends Bun.__internal.LibEmptyOrNodeUtilTextEncoder {
  /**
   * UTF-8 encodes the `src` string to the `dest` Uint8Array and returns an object
   * containing the read Unicode code units and written UTF-8 bytes.
   *
   * ```js
   * const encoder = new TextEncoder();
   * const src = 'this is some data';
   * const dest = new Uint8Array(10);
   * const { read, written } = encoder.encodeInto(src, dest);
   * ```
   * @param src The text to encode.
   * @param dest The array to hold the encode result.
   */
  encodeInto(src?: string, dest?: Bun.BufferSource): import("util").EncodeIntoResult;
}
declare var TextEncoder: Bun.__internal.UseLibDomIfAvailable<
  "TextEncoder",
  {
    prototype: TextEncoder;
    new (encoding?: Bun.Encoding, options?: { fatal?: boolean; ignoreBOM?: boolean }): TextEncoder;
  }
>;

/**
 * An implementation of the [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) `TextDecoder` API. All
 * instances of `TextDecoder` only support UTF-8 decoding.
 *
 * ```js
 * const decoder = new TextDecoder();
 * const uint8array = decoder.decode('this is some data');
 */
interface TextDecoder extends Bun.__internal.LibEmptyOrNodeUtilTextDecoder {}
declare var TextDecoder: Bun.__internal.UseLibDomIfAvailable<
  "TextDecoder",
  {
    prototype: TextDecoder;
    new (encoding?: Bun.Encoding, options?: { fatal?: boolean; ignoreBOM?: boolean }): TextDecoder;
  }
>;

interface Event {
  /** This is not used in Node.js and is provided purely for completeness. */
  readonly bubbles: boolean;
  /** Alias for event.stopPropagation(). This is not used in Node.js and is provided purely for completeness. */
  cancelBubble: boolean;
  /** True if the event was created with the cancelable option */
  readonly cancelable: boolean;
  /** This is not used in Node.js and is provided purely for completeness. */
  readonly composed: boolean;
  /** Returns an array containing the current EventTarget as the only entry or empty if the event is not being dispatched. This is not used in Node.js and is provided purely for completeness. */
  composedPath(): [EventTarget?];
  /** Alias for event.target. */
  readonly currentTarget: EventTarget | null;
  /** Is true if cancelable is true and event.preventDefault() has been called. */
  readonly defaultPrevented: boolean;
  /** This is not used in Node.js and is provided purely for completeness. */
  readonly eventPhase: number;
  /** The `AbortSignal` "abort" event is emitted with `isTrusted` set to `true`. The value is `false` in all other cases. */
  readonly isTrusted: boolean;
  /** Sets the `defaultPrevented` property to `true` if `cancelable` is `true`. */
  preventDefault(): void;
  /** This is not used in Node.js and is provided purely for completeness. */
  returnValue: boolean;
  /** Alias for event.target. */
  readonly srcElement: EventTarget | null;
  /** Stops the invocation of event listeners after the current one completes. */
  stopImmediatePropagation(): void;
  /** This is not used in Node.js and is provided purely for completeness. */
  stopPropagation(): void;
  /** The `EventTarget` dispatching the event */
  readonly target: EventTarget | null;
  /** The millisecond timestamp when the Event object was created. */
  readonly timeStamp: number;
  /** Returns the type of event, e.g. "click", "hashchange", or "submit". */
  readonly type: string;
}
declare var Event: {
  prototype: Event;
  readonly NONE: 0;
  readonly CAPTURING_PHASE: 1;
  readonly AT_TARGET: 2;
  readonly BUBBLING_PHASE: 3;
  new (type: string, eventInitDict?: Bun.EventInit): Event;
};

interface EventTarget {
  /**
   * Adds a new handler for the `type` event. Any given `listener` is added only once per `type` and per `capture` option value.
   *
   * If the `once` option is true, the `listener` is removed after the next time a `type` event is dispatched.
   *
   * The `capture` option is not used by Node.js in any functional way other than tracking registered event listeners per the `EventTarget` specification.
   * Specifically, the `capture` option is used as part of the key when registering a `listener`.
   * Any individual `listener` may be added once with `capture = false`, and once with `capture = true`.
   */
  addEventListener(
    type: string,
    listener: EventListener | EventListenerObject,
    options?: AddEventListenerOptions | boolean,
  ): void;
  /** Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise. */
  dispatchEvent(event: Event): boolean;
  /** Removes the event listener in target's event listener list with the same type, callback, and options. */
  removeEventListener(
    type: string,
    listener: EventListener | EventListenerObject,
    options?: Bun.EventListenerOptions | boolean,
  ): void;
}
declare var EventTarget: {
  prototype: EventTarget;
  new (): EventTarget;
};

interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}
declare var File: Bun.__internal.UseLibDomIfAvailable<
  "File",
  {
    prototype: File;
    /**
     * Create a new [File](https://developer.mozilla.org/en-US/docs/Web/API/File)
     *
     * @param `parts` - An array of strings, numbers, BufferSource, or [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) objects
     * @param `name` - The name of the file
     * @param `options` - An object containing properties to be added to the [File](https://developer.mozilla.org/en-US/docs/Web/API/File)
     */
    new (
      parts: Bun.BlobPart[],
      name: string,
      options?: BlobPropertyBag & { lastModified?: Date | number | undefined },
    ): File;
  }
>;

/**
 * ShadowRealms are a distinct global environment, with its own global object
 * containing its own intrinsics and built-ins (standard objects that are not
 * bound to global variables, like the initial value of Object.prototype).
 *
 * @example
 *
 * ```js
 * const red = new ShadowRealm();
 *
 * // realms can import modules that will execute within it's own environment.
 * // When the module is resolved, it captured the binding value, or creates a new
 * // wrapped function that is connected to the callable binding.
 * const redAdd = await red.importValue('./inside-code.js', 'add');
 *
 * // redAdd is a wrapped function exotic object that chains it's call to the
 * // respective imported binding.
 * let result = redAdd(2, 3);
 *
 * console.assert(result === 5); // yields true
 *
 * // The evaluate method can provide quick code evaluation within the constructed
 * // shadowRealm without requiring any module loading, while it still requires CSP
 * // relaxing.
 * globalThis.someValue = 1;
 * red.evaluate('globalThis.someValue = 2'); // Affects only the ShadowRealm's global
 * console.assert(globalThis.someValue === 1);
 *
 * // The wrapped functions can also wrap other functions the other way around.
 * const setUniqueValue =
 * await red.importValue('./inside-code.js', 'setUniqueValue');
 *
 * // setUniqueValue = (cb) => (cb(globalThis.someValue) * 2);
 *
 * result = setUniqueValue((x) => x ** 3);
 *
 * console.assert(result === 16); // yields true
 * ```
 */
interface ShadowRealm {
  /**
   * Creates a new [ShadowRealm](https://github.com/tc39/proposal-shadowrealm/blob/main/explainer.md#introduction)
   *
   * @example
   *
   * ```js
   * const red = new ShadowRealm();
   *
   * // realms can import modules that will execute within it's own environment.
   * // When the module is resolved, it captured the binding value, or creates a new
   * // wrapped function that is connected to the callable binding.
   * const redAdd = await red.importValue('./inside-code.js', 'add');
   *
   * // redAdd is a wrapped function exotic object that chains it's call to the
   * // respective imported binding.
   * let result = redAdd(2, 3);
   *
   * console.assert(result === 5); // yields true
   *
   * // The evaluate method can provide quick code evaluation within the constructed
   * // shadowRealm without requiring any module loading, while it still requires CSP
   * // relaxing.
   * globalThis.someValue = 1;
   * red.evaluate('globalThis.someValue = 2'); // Affects only the ShadowRealm's global
   * console.assert(globalThis.someValue === 1);
   *
   * // The wrapped functions can also wrap other functions the other way around.
   * const setUniqueValue =
   * await red.importValue('./inside-code.js', 'setUniqueValue');
   *
   * // setUniqueValue = (cb) => (cb(globalThis.someValue) * 2);
   *
   * result = setUniqueValue((x) => x ** 3);
   *
   * console.assert(result === 16); // yields true
   * ```
   */
  importValue(specifier: string, bindingName: string): Promise<any>;
  evaluate(sourceText: string): any;
}

declare var ShadowRealm: {
  prototype: ShadowRealm;
  new (): ShadowRealm;
};

declare function queueMicrotask(callback: (...args: any[]) => void): void;
/**
 * Log an error using the default exception handler
 * @param error Error or string
 */
declare function reportError(error: any): void;

interface Timer {
  ref(): Timer;
  unref(): Timer;
  hasRef(): boolean;
  refresh(): Timer;

  [Symbol.toPrimitive](): number;
}

/**
 * Cancel a repeating timer by its timer ID.
 * @param id timer id
 */
declare function clearInterval(id?: number | Timer): void;
/**
 * Cancel a delayed function call by its timer ID.
 * @param id timer id
 */
declare function clearTimeout(id?: number | Timer): void;
/**
 * Cancel an immediate function call by its immediate ID.
 * @param id immediate id
 */
declare function clearImmediate(id?: number | Timer): void;
/**
 * Run a function immediately after main event loop is vacant
 * @param handler function to call
 */
declare function setImmediate(handler: Bun.TimerHandler, ...arguments: any[]): Timer;
/**
 * Run a function every `interval` milliseconds
 * @param handler function to call
 * @param interval milliseconds to wait between calls
 */
declare function setInterval(handler: Bun.TimerHandler, interval?: number, ...arguments: any[]): Timer;
/**
 * Run a function after `timeout` (milliseconds)
 * @param handler function to call
 * @param timeout milliseconds to wait between calls
 */
declare function setTimeout(handler: Bun.TimerHandler, timeout?: number, ...arguments: any[]): Timer;

declare function addEventListener<K extends keyof EventMap>(
  type: K,
  listener: (this: object, ev: EventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void;
declare function addEventListener(
  type: string,
  listener: Bun.EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): void;
declare function removeEventListener<K extends keyof EventMap>(
  type: K,
  listener: (this: object, ev: EventMap[K]) => any,
  options?: boolean | Bun.EventListenerOptions,
): void;
declare function removeEventListener(
  type: string,
  listener: Bun.EventListenerOrEventListenerObject,
  options?: boolean | Bun.EventListenerOptions,
): void;

/**
 * Events providing information related to errors in scripts or in files.
 */
interface ErrorEvent extends Event {
  readonly colno: number;
  readonly error: any;
  readonly filename: string;
  readonly lineno: number;
  readonly message: string;
}

declare var ErrorEvent: {
  prototype: ErrorEvent;
  new (type: string, eventInitDict?: Bun.ErrorEventInit): ErrorEvent;
};

/** A CloseEvent is sent to clients using WebSockets when the connection is closed. This is delivered to the listener indicated by the WebSocket object's onclose attribute. */
interface CloseEvent extends Event {
  /** Returns the WebSocket connection close code provided by the server. */
  readonly code: number;
  /** Returns the WebSocket connection close reason provided by the server. */
  readonly reason: string;
  /** Returns true if the connection closed cleanly; false otherwise. */
  readonly wasClean: boolean;
}

declare var CloseEvent: {
  prototype: CloseEvent;
  new (type: string, eventInitDict?: Bun.CloseEventInit): CloseEvent;
};

interface MessageEvent<T = any> extends Bun.MessageEvent<T> {}
declare var MessageEvent: Bun.__internal.UseLibDomIfAvailable<
  "MessageEvent",
  {
    prototype: MessageEvent;
    new <T>(type: string, eventInitDict?: Bun.MessageEventInit<T>): MessageEvent<any>;
  }
>;

interface CustomEvent<T = any> extends Event {
  /** Returns any custom data event was created with. Typically used for synthetic events. */
  readonly detail: T;
}

declare var CustomEvent: {
  prototype: CustomEvent;
  new <T>(type: string, eventInitDict?: Bun.CustomEventInit<T>): CustomEvent<T>;
};

interface EventListener {
  (evt: Event): void;
}

interface EventListenerObject {
  handleEvent(object: Event): void;
}

interface FetchEvent extends Event {
  readonly request: Request;
  readonly url: string;

  waitUntil(promise: Promise<any>): void;
  respondWith(response: Response | Promise<Response>): void;
}

interface EventMap {
  fetch: FetchEvent;
  message: MessageEvent;
  messageerror: MessageEvent;
  // exit: Event;
}

interface AddEventListenerOptions extends Bun.EventListenerOptions {
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
}

/**
 * Low-level JavaScriptCore API for accessing the native ES Module loader (not a Bun API)
 *
 * Before using this, be aware of a few things:
 *
 * **Using this incorrectly will crash your application**.
 *
 * This API may change any time JavaScriptCore is updated.
 *
 * Bun may rewrite ESM import specifiers to point to bundled code. This will
 * be confusing when using this API, as it will return a string like
 * "/node_modules.server.bun".
 *
 * Bun may inject additional imports into your code. This usually has a `bun:` prefix.
 */
declare var Loader: {
  /**
   * ESM module registry
   *
   * This lets you implement live reload in Bun. If you
   * delete a module specifier from this map, the next time it's imported, it
   * will be re-transpiled and loaded again.
   *
   * The keys are the module specifiers and the
   * values are metadata about the module.
   *
   * The keys are an implementation detail for Bun that will change between
   * versions.
   *
   * - Userland modules are an absolute file path
   * - Virtual modules have a `bun:` prefix or `node:` prefix
   * - JS polyfills start with `"/bun-vfs/"`. `"buffer"` is an example of a JS polyfill
   * - If you have a `node_modules.bun` file, many modules will point to that file
   *
   * Virtual modules and JS polyfills are embedded in bun's binary. They don't
   * point to anywhere in your local filesystem.
   */
  registry: Map<
    string,
    {
      key: string;
      /**
       * This refers to the state the ESM module is in
       *
       * TODO: make an enum for this number
       */
      state: number;
      fetch: Promise<any>;
      instantiate: Promise<any>;
      satisfy: Promise<any>;
      dependencies: Array<(typeof Loader)["registry"] extends Map<any, infer V> ? V : any>;
      /**
       * Your application will probably crash if you mess with this.
       */
      module: {
        dependenciesMap: (typeof Loader)["registry"];
      };
      linkError?: any;
      linkSucceeded: boolean;
      evaluated: boolean;
      then?: any;
      isAsync: boolean;
    }
  >;
  /**
   * For an already-evaluated module, return the dependencies as module specifiers
   *
   * This list is already sorted and uniqued.
   *
   * @example
   *
   * For this code:
   * ```js
   * // /foo.js
   * import classNames from 'classnames';
   * import React from 'react';
   * import {createElement} from 'react';
   * ```
   *
   * This would return:
   * ```js
   * Loader.dependencyKeysIfEvaluated("/foo.js")
   * ["bun:wrap", "/path/to/node_modules/classnames/index.js", "/path/to/node_modules/react/index.js"]
   * ```
   *
   * @param specifier - module specifier as it appears in transpiled source code
   */
  dependencyKeysIfEvaluated: (specifier: string) => string[];
  /**
   * The function JavaScriptCore internally calls when you use an import statement.
   *
   * This may return a path to `node_modules.server.bun`, which will be confusing.
   *
   * Consider {@link Bun.resolve} or {@link ImportMeta.resolve}
   * instead.
   *
   * @param specifier - module specifier as it appears in transpiled source code
   * @param referrer - module specifier that is resolving this specifier
   */
  resolve: (specifier: string, referrer: string) => string;
};

interface QueuingStrategy<T = any> {
  highWaterMark?: number;
  size?: QueuingStrategySize<T>;
}

interface QueuingStrategyInit {
  /**
   * Creates a new ByteLengthQueuingStrategy with the provided high water mark.
   *
   * Note that the provided high water mark will not be validated ahead of time. Instead, if it is negative, NaN, or not a number, the resulting ByteLengthQueuingStrategy will cause the corresponding stream constructor to throw.
   */
  highWaterMark: number;
}

/** This Streams API interface provides a built-in byte length queuing strategy that can be used when constructing streams. */
interface ByteLengthQueuingStrategy extends QueuingStrategy<ArrayBufferView> {
  readonly highWaterMark: number;
  // changed from QueuingStrategySize<BufferSource>
  // to avoid conflict with lib.dom.d.ts
  readonly size: QueuingStrategySize<ArrayBufferView>;
}

declare var ByteLengthQueuingStrategy: {
  prototype: ByteLengthQueuingStrategy;
  new (init: QueuingStrategyInit): ByteLengthQueuingStrategy;
};

interface ReadableStreamDefaultController<R = any> {
  readonly desiredSize: number | null;
  close(): void;
  enqueue(chunk?: R): void;
  error(e?: any): void;
}

interface ReadableStreamDirectController {
  close(error?: Error): void;
  write(data: Bun.BufferSource | ArrayBuffer | string): number | Promise<number>;
  end(): number | Promise<number>;
  flush(): number | Promise<number>;
  start(): void;
}

declare var ReadableStreamDefaultController: {
  prototype: ReadableStreamDefaultController;
  new (): ReadableStreamDefaultController;
};

interface ReadableStreamDefaultReader<R = any> extends ReadableStreamGenericReader {
  read(): Promise<Bun.ReadableStreamDefaultReadResult<R>>;
  /**
   * Only available in Bun. If there are multiple chunks in the queue, this will return all of them at the same time.
   * Will only return a promise if the data is not immediately available.
   */
  readMany(): Promise<Bun.ReadableStreamDefaultReadManyResult<R>> | Bun.ReadableStreamDefaultReadManyResult<R>;
  releaseLock(): void;
}

declare var ReadableStreamDefaultReader: {
  prototype: ReadableStreamDefaultReader;
  new <R = any>(stream: ReadableStream<R>): ReadableStreamDefaultReader<R>;
};

interface ReadableStreamGenericReader {
  readonly closed: Promise<void>;
  cancel(reason?: any): Promise<void>;
}

interface ReadableStreamDefaultReadDoneResult {
  done: true;
  value?: undefined;
}

interface ReadableStreamDefaultReadValueResult<T> {
  done: false;
  value: T;
}

interface ReadableWritablePair<R = any, W = any> {
  readable: ReadableStream<R>;
  /**
   * Provides a convenient, chainable way of piping this readable stream through a transform stream (or any other { writable, readable } pair). It simply pipes the stream into the writable side of the supplied pair, and returns the readable side for further use.
   *
   * Piping a stream will lock it for the duration of the pipe, preventing any other consumer from acquiring a reader.
   */
  writable: WritableStream<W>;
}

interface WritableStreamDefaultController {
  error(e?: any): void;
}

declare var WritableStreamDefaultController: {
  prototype: WritableStreamDefaultController;
  new (): WritableStreamDefaultController;
};

/** This Streams API interface is the object returned by WritableStream.getWriter() and once created locks the < writer to the WritableStream ensuring that no other streams can write to the underlying sink. */
interface WritableStreamDefaultWriter<W = any> {
  readonly closed: Promise<void>;
  readonly desiredSize: number | null;
  readonly ready: Promise<void>;
  abort(reason?: any): Promise<void>;
  close(): Promise<void>;
  releaseLock(): void;
  write(chunk?: W): Promise<void>;
}

declare var WritableStreamDefaultWriter: {
  prototype: WritableStreamDefaultWriter;
  new <W = any>(stream: WritableStream<W>): WritableStreamDefaultWriter<W>;
};

interface TransformStream<I = any, O = any> {
  readonly readable: ReadableStream<O>;
  readonly writable: WritableStream<I>;
}

declare var TransformStream: {
  prototype: TransformStream;
  new <I = any, O = any>(
    transformer?: Transformer<I, O>,
    writableStrategy?: QueuingStrategy<I>,
    readableStrategy?: QueuingStrategy<O>,
  ): TransformStream<I, O>;
};

interface TransformStreamDefaultController<O = any> {
  readonly desiredSize: number | null;
  enqueue(chunk?: O): void;
  error(reason?: any): void;
  terminate(): void;
}

declare var TransformStreamDefaultController: {
  prototype: TransformStreamDefaultController;
  new (): TransformStreamDefaultController;
};

interface StreamPipeOptions {
  preventAbort?: boolean;
  preventCancel?: boolean;
  /**
   * Pipes this readable stream to a given writable stream destination. The way in which the piping process behaves under various error conditions can be customized with a number of passed options. It returns a promise that fulfills when the piping process completes successfully, or rejects if any errors were encountered.
   *
   * Piping a stream will lock it for the duration of the pipe, preventing any other consumer from acquiring a reader.
   *
   * Errors and closures of the source and destination streams propagate as follows:
   *
   * An error in this source readable stream will abort destination, unless preventAbort is truthy. The returned promise will be rejected with the source's error, or with any error that occurs during aborting the destination.
   *
   * An error in destination will cancel this source readable stream, unless preventCancel is truthy. The returned promise will be rejected with the destination's error, or with any error that occurs during canceling the source.
   *
   * When this source readable stream closes, destination will be closed, unless preventClose is truthy. The returned promise will be fulfilled once this process completes, unless an error is encountered while closing the destination, in which case it will be rejected with that error.
   *
   * If destination starts out closed or closing, this source readable stream will be canceled, unless preventCancel is true. The returned promise will be rejected with an error indicating piping to a closed stream failed, or with any error that occurs during canceling the source.
   *
   * The signal option can be set to an AbortSignal to allow aborting an ongoing pipe operation via the corresponding AbortController. In this case, this source readable stream will be canceled, and destination aborted, unless the respective options preventCancel or preventAbort are set.
   */
  preventClose?: boolean;
  signal?: AbortSignal;
}

/** This Streams API interface provides a built-in byte length queuing strategy that can be used when constructing streams. */
interface CountQueuingStrategy extends QueuingStrategy {
  readonly highWaterMark: number;
  readonly size: QueuingStrategySize;
}

declare var CountQueuingStrategy: {
  prototype: CountQueuingStrategy;
  new (init: QueuingStrategyInit): CountQueuingStrategy;
};

interface QueuingStrategySize<T = any> {
  (chunk?: T): number;
}

interface Transformer<I = any, O = any> {
  flush?: Bun.TransformerFlushCallback<O>;
  readableType?: undefined;
  start?: Bun.TransformerStartCallback<O>;
  transform?: Bun.TransformerTransformCallback<I, O>;
  writableType?: undefined;
}

interface Dict<T> {
  [key: string]: T | undefined;
}

interface ReadOnlyDict<T> {
  readonly [key: string]: T | undefined;
}

interface ErrnoException extends Error {
  errno?: number | undefined;
  code?: string | undefined;
  path?: string | undefined;
  syscall?: string | undefined;
}

/** An abnormal event (called an exception) which occurs as a result of calling a method or accessing a property of a web API. */
interface DOMException extends Error {
  readonly message: string;
  readonly name: string;
  readonly INDEX_SIZE_ERR: 1;
  readonly DOMSTRING_SIZE_ERR: 2;
  readonly HIERARCHY_REQUEST_ERR: 3;
  readonly WRONG_DOCUMENT_ERR: 4;
  readonly INVALID_CHARACTER_ERR: 5;
  readonly NO_DATA_ALLOWED_ERR: 6;
  readonly NO_MODIFICATION_ALLOWED_ERR: 7;
  readonly NOT_FOUND_ERR: 8;
  readonly NOT_SUPPORTED_ERR: 9;
  readonly INUSE_ATTRIBUTE_ERR: 10;
  readonly INVALID_STATE_ERR: 11;
  readonly SYNTAX_ERR: 12;
  readonly INVALID_MODIFICATION_ERR: 13;
  readonly NAMESPACE_ERR: 14;
  readonly INVALID_ACCESS_ERR: 15;
  readonly VALIDATION_ERR: 16;
  readonly TYPE_MISMATCH_ERR: 17;
  readonly SECURITY_ERR: 18;
  readonly NETWORK_ERR: 19;
  readonly ABORT_ERR: 20;
  readonly URL_MISMATCH_ERR: 21;
  readonly QUOTA_EXCEEDED_ERR: 22;
  readonly TIMEOUT_ERR: 23;
  readonly INVALID_NODE_TYPE_ERR: 24;
  readonly DATA_CLONE_ERR: 25;
}

// declare var DOMException: {
//   prototype: DOMException;
//   new (message?: string, name?: string): DOMException;
// };

declare function alert(message?: string): void;
declare function confirm(message?: string): boolean;
declare function prompt(message?: string, _default?: string): string | null;

interface SubtleCrypto extends Bun.__internal.NodeCryptoWebcryptoSubtleCrypto {}
declare var SubtleCrypto: {
  prototype: SubtleCrypto;
  new (): SubtleCrypto;
};

interface CryptoKey extends Bun.__internal.NodeCryptoWebcryptoCryptoKey {}
declare var CryptoKey: {
  prototype: CryptoKey;
  new (): CryptoKey;
};

interface CryptoKeyPair extends Bun.__internal.NodeCryptoWebcryptoCryptoKeyPair {}

interface Position {
  lineText: string;
  file: string;
  namespace: string;
  line: number;
  column: number;
  length: number;
  offset: number;
}

declare class ResolveMessage {
  readonly name: "ResolveMessage";
  readonly position: Position | null;
  readonly code: string;
  readonly message: string;
  readonly referrer: string;
  readonly specifier: string;
  readonly importKind:
    | "entry_point"
    | "stmt"
    | "require"
    | "import"
    | "dynamic"
    | "require_resolve"
    | "at"
    | "at_conditional"
    | "url"
    | "internal";
  readonly level: "error" | "warning" | "info" | "debug" | "verbose";

  toString(): string;
}

declare class BuildMessage {
  readonly name: "BuildMessage";
  readonly position: Position | null;
  readonly message: string;
  readonly level: "error" | "warning" | "info" | "debug" | "verbose";
}

interface ErrorOptions {
  /**
   * The cause of the error.
   */
  cause?: unknown;
}

interface Error {
  /**
   * The cause of the error.
   */
  cause?: unknown;
}

interface ErrorConstructor {
  new (message?: string, options?: ErrorOptions): Error;

  /**
   * Check if a value is an instance of Error
   *
   * @param value - The value to check
   * @returns True if the value is an instance of Error, false otherwise
   */
  isError(value: unknown): value is Error;

  /**
   * Create .stack property on a target object
   */
  captureStackTrace(targetObject: object, constructorOpt?: Function): void;

  /**
   * The maximum number of stack frames to capture.
   */
  stackTraceLimit: number;
}

interface ArrayBufferConstructor {
  new (byteLength: number, options: { maxByteLength?: number }): ArrayBuffer;
}

interface ArrayBuffer {
  /**
   * Read-only. The length of the ArrayBuffer (in bytes).
   */
  readonly byteLength: number;
  /**
   * Resize an ArrayBuffer in-place.
   */
  resize(byteLength: number): ArrayBuffer;

  /**
   * Returns a section of an ArrayBuffer.
   */
  slice(begin: number, end?: number): ArrayBuffer;
  readonly [Symbol.toStringTag]: string;
}

interface SharedArrayBuffer {
  /**
   * Grow the SharedArrayBuffer in-place.
   */
  grow(size: number): SharedArrayBuffer;
}

interface ArrayConstructor {
  /**
   * Create an array from an iterable or async iterable object.
   * Values from the iterable are awaited.
   *
   * ```ts
   * await Array.fromAsync([1]); // [1]
   * await Array.fromAsync([Promise.resolve(1)]); // [1]
   * await Array.fromAsync((async function*() { yield 1 })()); // [1]
   * ```
   *
   * @param arrayLike - The iterable or async iterable to convert to an array.
   * @returns A {@link Promise} whose fulfillment is a new {@link Array} instance containing the values from the iterator.
   */
  fromAsync<T>(arrayLike: AsyncIterable<T> | Iterable<T> | ArrayLike<T>): Promise<Awaited<T>[]>;

  /**
   * Create an array from an iterable or async iterable object.
   * Values from the iterable are awaited. Results of the map function are also awaited.
   *
   * ```ts
   * await Array.fromAsync([1]); // [1]
   * await Array.fromAsync([Promise.resolve(1)]); // [1]
   * await Array.fromAsync((async function*() { yield 1 })()); // [1]
   * await Array.fromAsync([1], (n) => n + 1); // [2]
   * await Array.fromAsync([1], (n) => Promise.resolve(n + 1)); // [2]
   * ```
   *
   * @param arrayLike - The iterable or async iterable to convert to an array.
   * @param mapFn - A mapper function that transforms each element of `arrayLike` after awaiting them.
   * @param thisArg - The `this` to which `mapFn` is bound.
   * @returns A {@link Promise} whose fulfillment is a new {@link Array} instance containing the values from the iterator.
   */
  fromAsync<T, U>(
    arrayLike: AsyncIterable<T> | Iterable<T> | ArrayLike<T>,
    mapFn?: (value: T, index: number) => U,
    thisArg?: any,
  ): Promise<Awaited<U>[]>;
}

interface ConsoleOptions {
  stdout: import("stream").Writable;
  stderr?: import("stream").Writable;
  ignoreErrors?: boolean;
  colorMode?: boolean | "auto";
  inspectOptions?: import("util").InspectOptions;
  groupIndentation?: number;
}

interface Console {
  /**
   * Asynchronously read lines from standard input (fd 0)
   *
   * ```ts
   * for await (const line of console) {
   *   console.log(line);
   * }
   * ```
   */
  [Symbol.asyncIterator](): AsyncIterableIterator<string>;

  /**
   * Write text or bytes to stdout
   *
   * Unlike {@link console.log}, this does no formatting and doesn't add a
   * newline or spaces between arguments. You can pass it strings or bytes or
   * any combination of the two.
   *
   * ```ts
   * console.write("hello world!", "\n"); // "hello world\n"
   * ```
   *
   * @param data - The data to write
   * @returns The number of bytes written
   *
   * This function is not available in the browser.
   */
  write(...data: Array<string | ArrayBufferView | ArrayBuffer>): number;

  /**
   * Clear the console
   */
  clear(): void;

  assert(condition?: boolean, ...data: any[]): void;

  /**
   * Increment a [count](https://www.youtube.com/watch?v=2AoxCkySv34&t=22s)
   * @param label label counter
   */
  count(label?: string): void;
  countReset(label?: string): void;
  debug(...data: any[]): void;
  dir(item?: any, options?: any): void;
  dirxml(...data: any[]): void;
  /**
   * Log to stderr in your terminal
   *
   * Appears in red
   *
   * @param data something to display
   */
  error(...data: any[]): void;
  /** Does nothing currently */
  group(...data: any[]): void;
  /** Does nothing currently */
  groupCollapsed(...data: any[]): void;
  /** Does nothing currently */
  groupEnd(): void;
  info(...data: any[]): void;
  log(...data: any[]): void;
  /**
   * Try to construct a table with the columns of the properties of `tabularData` (or use `properties`) and rows of `tabularData` and log it. Falls back to just
   * logging the argument if it can't be parsed as tabular.
   *
   * ```js
   * // These can't be parsed as tabular data
   * console.table(Symbol());
   * // Symbol()
   *
   * console.table(undefined);
   * // undefined
   *
   * console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
   * // ┌────┬─────┬─────┐
   * // │    │  a  │  b  │
   * // ├────┼─────┼─────┤
   * // │  0 │  1  │ 'Y' │
   * // │  1 │ 'Z' │  2  │
   * // └────┴─────┴─────┘
   *
   * console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
   * // ┌────┬─────┐
   * // │    │  a  │
   * // ├────┼─────┤
   * // │ 0  │  1  │
   * // │ 1  │ 'Z' │
   * // └────┴─────┘
   * ```
   * @param properties Alternate properties for constructing the table.
   */
  table(tabularData?: any, properties?: string[]): void;
  /**
   * Begin a timer to log with {@link console.timeEnd}
   *
   * @param label - The label to use for the timer
   *
   * ```ts
   *  console.time("how long????");
   * for (let i = 0; i < 999999; i++) {
   *    // do stuff
   *    let x = i * i;
   * }
   * console.timeEnd("how long????");
   * ```
   */
  time(label?: string): void;
  /**
   * End a timer to log with {@link console.time}
   *
   * @param label - The label to use for the timer
   *
   * ```ts
   *  console.time("how long????");
   * for (let i = 0; i < 999999; i++) {
   *  // do stuff
   *  let x = i * i;
   * }
   * console.timeEnd("how long????");
   * ```
   */
  timeEnd(label?: string): void;
  timeLog(label?: string, ...data: any[]): void;
  timeStamp(label?: string): void;
  trace(...data: any[]): void;
  warn(...data: any[]): void;

  /**
   * Creates a new Console with one or two writable stream instances. stdout is a writable stream to print log or info output. stderr is used for warning or error output. If stderr is not provided, stdout is used for stderr.
   */
  // Console: {
  //   new (options: ConsoleOptions): Console;
  //   new (
  //     stdout: import("stream").Writable,
  //     stderr?: import("stream").Writable,
  //     ignoreErrors?: boolean,
  //   ): Console;
  // };
}

declare var console: Console;

interface ImportMetaEnv {
  [key: string]: string | undefined;
}

interface ImportMeta {
  /**
   * `file://` url string for the current module.
   *
   * @example
   * ```ts
   * console.log(import.meta.url);
   * "file:///Users/me/projects/my-app/src/my-app.ts"
   * ```
   */
  url: string;
  /**
   * Absolute path to the source file
   */
  readonly path: string;
  /**
   * Absolute path to the directory containing the source file.
   *
   * Does not have a trailing slash
   */
  readonly dir: string;
  /**
   * Filename of the source file
   */
  readonly file: string;
  /**
   * The environment variables of the process
   *
   * ```ts
   * import.meta.env === process.env
   * ```
   */
  readonly env: Bun.Env & NodeJS.ProcessEnv & ImportMetaEnv;

  /**
   * @deprecated Use `require.resolve` or `Bun.resolveSync(moduleId, path.dirname(parent))` instead
   *
   * Resolve a module ID the same as if you imported it
   *
   * The `parent` argument is optional, and defaults to the current module's path.
   */
  resolveSync(moduleId: string, parent?: string): string;

  /**
   * Load a CommonJS module within an ES Module. Bun's transpiler rewrites all
   * calls to `require` with `import.meta.require` when transpiling ES Modules
   * for the runtime.
   *
   * Warning: **This API is not stable** and may change or be removed in the
   * future. Use at your own risk.
   */
  require: NodeJS.Require;

  /**
   * Did the current file start the process?
   *
   * @example
   * ```ts
   * if (import.meta.main) {
   *  console.log("I started the process!");
   * }
   * ```
   *
   * @example
   * ```ts
   * console.log(
   *   import.meta.main === (import.meta.path === Bun.main)
   * )
   * ```
   */
  readonly main: boolean;

  /** Alias of `import.meta.dir`. Exists for Node.js compatibility */
  dirname: string;

  /** Alias of `import.meta.path`. Exists for Node.js compatibility */
  filename: string;
}

/**
 * NodeJS-style `require` function
 *
 * @param moduleId - The module ID to resolve
 */
declare var require: NodeJS.Require;

/** Same as module.exports */
declare var exports: any;

interface NodeModule {
  exports: any;
}

declare var module: NodeModule;

/**
 * Creates a deep clone of an object.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/structuredClone)
 */
declare function structuredClone<T>(value: T, options?: Bun.StructuredSerializeOptions): T;

/**
 * Post a message to the parent thread.
 *
 * Only useful in a worker thread; calling this from the main thread does nothing.
 */
declare function postMessage(message: any, transfer?: Bun.Transferable[]): void;

interface EventSourceInit {
  withCredentials?: boolean;
}

interface PromiseConstructor {
  /**
   * Create a deferred promise, with exposed `resolve` and `reject` methods which can be called
   * separately.
   *
   * This is useful when you want to return a Promise and have code outside the Promise
   * resolve or reject it.
   *
   * @example
   * ```ts
   * const { promise, resolve, reject } = Promise.withResolvers();
   *
   * setTimeout(() => {
   *  resolve("Hello world!");
   * }, 1000);
   *
   * await promise; // "Hello world!"
   * ```
   */
  withResolvers<T>(): {
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
  };

  /**
   * Try to run a function and return the result.
   * If the function throws, return the result of the `catch` function.
   *
   * @param fn - The function to run
   * @param args - The arguments to pass to the function. This is similar to `setTimeout` and avoids the extra closure.
   * @returns The result of the function or the result of the `catch` function
   */
  try<T, A extends any[] = []>(fn: (...args: A) => T | PromiseLike<T>, ...args: A): Promise<T>;
}

interface Navigator {
  readonly userAgent: string;
  readonly platform: "MacIntel" | "Win32" | "Linux x86_64";
  readonly hardwareConcurrency: number;
}

declare var navigator: Navigator;

interface BlobPropertyBag {
  /** Set a default "type". Not yet implemented. */
  type?: string;
  /** Not implemented in Bun yet. */
  // endings?: "transparent" | "native";
}

interface WorkerOptions extends Bun.WorkerOptions {}

interface Blob {
  /**
   * The size of this Blob in bytes
   */
  readonly size: number;

  /**
   * The MIME type of this Blob
   */
  readonly type: string;

  /**
   * Read the data from the blob as a JSON object.
   *
   * This first decodes the data from UTF-8, then parses it as JSON.
   */
  // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
  json(): Promise<any>;

  /**
   * Read the data from the blob as a {@link FormData} object.
   *
   * This first decodes the data from UTF-8, then parses it as a
   * `multipart/form-data` body or a `application/x-www-form-urlencoded` body.
   *
   * The `type` property of the blob is used to determine the format of the
   * body.
   *
   * This is a non-standard addition to the `Blob` API, to make it conform more
   * closely to the `BodyMixin` API.
   */
  formData(): Promise<FormData>;

  /**
   * Returns a promise that resolves to the contents of the blob as a string
   */
  text(): Promise<string>;

  /**
   * Returns a promise that resolves to the contents of the blob as an ArrayBuffer
   */
  arrayBuffer(): Promise<ArrayBuffer>;

  /**
   * Returns a promise that resolves to the contents of the blob as a Uint8Array (array of bytes) its the same as `new Uint8Array(await blob.arrayBuffer())`
   */
  bytes(): Promise<Uint8Array>;

  /**
   * Returns a readable stream of the blob's contents
   */
  stream(): ReadableStream<Uint8Array>;
}

declare var Blob: Bun.__internal.UseLibDomIfAvailable<
  "Blob",
  {
    prototype: Blob;
    new (blobParts?: Bun.BlobPart[], options?: BlobPropertyBag): Blob;
  }
>;

interface Uint8Array {
  /**
   * Convert the Uint8Array to a base64 encoded string
   * @returns The base64 encoded string representation of the Uint8Array
   */
  toBase64(options?: { alphabet?: "base64" | "base64url"; omitPadding?: boolean }): string;

  /**
   * Set the contents of the Uint8Array from a base64 encoded string
   * @param base64 The base64 encoded string to decode into the array
   * @param offset Optional starting index to begin setting the decoded bytes (default: 0)
   */
  setFromBase64(
    base64: string,
    offset?: number,
  ): {
    /**
     * The number of bytes read from the base64 string
     */
    read: number;
    /**
     * The number of bytes written to the Uint8Array
     * Will never be greater than the `.byteLength` of this Uint8Array
     */
    written: number;
  };

  /**
   * Convert the Uint8Array to a hex encoded string
   * @returns The hex encoded string representation of the Uint8Array
   */
  toHex(): string;

  /**
   * Set the contents of the Uint8Array from a hex encoded string
   * @param hex The hex encoded string to decode into the array. The string must have
   * an even number of characters, be valid hexadecimal characters and contain no whitespace.
   */
  setFromHex(hex: string): {
    /**
     * The number of bytes read from the hex string
     */
    read: number;
    /**
     * The number of bytes written to the Uint8Array
     * Will never be greater than the `.byteLength` of this Uint8Array
     */
    written: number;
  };
}

interface Uint8ArrayConstructor {
  /**
   * Create a new Uint8Array from a base64 encoded string
   * @param base64 The base64 encoded string to convert to a Uint8Array
   * @param options Optional options for decoding the base64 string
   * @returns A new Uint8Array containing the decoded data
   */
  fromBase64(
    base64: string,
    options?: {
      alphabet?: "base64" | "base64url";
      lastChunkHandling?: "loose" | "strict" | "stop-before-partial";
    },
  ): Uint8Array;

  /**
   * Create a new Uint8Array from a hex encoded string
   * @param hex The hex encoded string to convert to a Uint8Array
   * @returns A new Uint8Array containing the decoded data
   */
  fromHex(hex: string): Uint8Array;
}

interface BroadcastChannel {}
declare var BroadcastChannel: Bun.__internal.UseLibDomIfAvailable<
  "BroadcastChannel",
  typeof import("node:worker_threads").BroadcastChannel
>;

declare var URL: Bun.__internal.UseLibDomIfAvailable<
  "URL",
  {
    prototype: URL;
    new (url: string | URL, base?: string | URL): URL;
    /**
     * Check if a URL can be parsed.
     *
     * @param url - The URL to check.
     * @param base - The base URL to use.
     */
    canParse(url: string, base?: string): boolean;
    /**
     * Create a URL from an object.
     *
     * @param object - The object to create a URL from.
     */
    createObjectURL(object: Blob): `blob:${string}`;
    /**
     * Revoke a URL.
     *
     * @param url - The URL to revoke.
     */
    revokeObjectURL(url: string): void;
    /**
     * Parse a URL.
     *
     * @param url - The URL to parse.
     * @param base - The base URL to use.
     */
    parse(url: string, base?: string): URL | null;
  }
>;

declare var AbortController: Bun.__internal.UseLibDomIfAvailable<
  "AbortController",
  {
    prototype: AbortController;
    new (): AbortController;
  }
>;

declare var AbortSignal: Bun.__internal.UseLibDomIfAvailable<
  "AbortSignal",
  {
    prototype: AbortSignal;
    new (): AbortSignal;
    /**
     * Create an AbortSignal that will be aborted after a timeout
     * @param ms The timeout in milliseconds
     * @returns An AbortSignal that will be aborted after the timeout
     */
    timeout(ms: number): AbortSignal;
    /**
     * Create an immediately-aborted AbortSignal
     * @param reason The reason for the abort
     * @returns An AbortSignal that is already aborted
     */
    abort(reason?: any): AbortSignal;
    /**
     * Create an AbortSignal that will be aborted if any of the signals are aborted
     * @param signals The signals to combine
     * @returns An AbortSignal that will be aborted if any of the signals are aborted
     */
    any(signals: AbortSignal[]): AbortSignal;
  }
>;

interface DOMException {}
declare var DOMException: Bun.__internal.UseLibDomIfAvailable<
  "DOMException",
  { prototype: DOMException; new (): DOMException }
>;

interface FormData {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FormData/append) */
  append(name: string, value: string | Blob): void;
  append(name: string, value: string): void;
  append(name: string, blobValue: Blob, filename?: string): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FormData/delete) */
  delete(name: string): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FormData/get) */
  get(name: string): Bun.FormDataEntryValue | null;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FormData/getAll) */
  getAll(name: string): Bun.FormDataEntryValue[];
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FormData/has) */
  has(name: string): boolean;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FormData/set) */
  set(name: string, value: string | Blob): void;
  set(name: string, value: string): void;
  set(name: string, blobValue: Blob, filename?: string): void;
  forEach(callbackfn: (value: Bun.FormDataEntryValue, key: string, parent: FormData) => void, thisArg?: any): void;
  keys(): IterableIterator<string>;
  values(): IterableIterator<string>;
  entries(): IterableIterator<[string, string]>;
}
declare var FormData: Bun.__internal.UseLibDomIfAvailable<"FormData", { prototype: FormData; new (): FormData }>;

interface EventSource {}
declare var EventSource: Bun.__internal.UseLibDomIfAvailable<
  "EventSource",
  { prototype: EventSource; new (): EventSource }
>;

interface Performance extends Bun.__internal.LibPerformanceOrNodePerfHooksPerformance {}
declare var performance: Bun.__internal.UseLibDomIfAvailable<"performance", Performance>;

interface PerformanceEntry {}
declare var PerformanceEntry: Bun.__internal.UseLibDomIfAvailable<
  "PerformanceEntry",
  { prototype: PerformanceEntry; new (): PerformanceEntry }
>;

interface PerformanceMark {}
declare var PerformanceMark: Bun.__internal.UseLibDomIfAvailable<
  "PerformanceMark",
  { prototype: PerformanceMark; new (): PerformanceMark }
>;

interface PerformanceMeasure {}
declare var PerformanceMeasure: Bun.__internal.UseLibDomIfAvailable<
  "PerformanceMeasure",
  { prototype: PerformanceMeasure; new (): PerformanceMeasure }
>;

interface PerformanceObserver {}
declare var PerformanceObserver: Bun.__internal.UseLibDomIfAvailable<
  "PerformanceObserver",
  { prototype: PerformanceObserver; new (): PerformanceObserver }
>;

interface PerformanceObserverEntryList {}
declare var PerformanceObserverEntryList: Bun.__internal.UseLibDomIfAvailable<
  "PerformanceObserverEntryList",
  { prototype: PerformanceObserverEntryList; new (): PerformanceObserverEntryList }
>;

interface PerformanceResourceTiming {}
declare var PerformanceResourceTiming: Bun.__internal.UseLibDomIfAvailable<
  "PerformanceResourceTiming",
  { prototype: PerformanceResourceTiming; new (): PerformanceResourceTiming }
>;

interface ReadableByteStreamController {}
declare var ReadableByteStreamController: Bun.__internal.UseLibDomIfAvailable<
  "ReadableByteStreamController",
  { prototype: ReadableByteStreamController; new (): ReadableByteStreamController }
>;

interface ReadableStreamBYOBReader {}
declare var ReadableStreamBYOBReader: Bun.__internal.UseLibDomIfAvailable<
  "ReadableStreamBYOBReader",
  { prototype: ReadableStreamBYOBReader; new (): ReadableStreamBYOBReader }
>;

interface ReadableStreamBYOBRequest {}
declare var ReadableStreamBYOBRequest: Bun.__internal.UseLibDomIfAvailable<
  "ReadableStreamBYOBRequest",
  { prototype: ReadableStreamBYOBRequest; new (): ReadableStreamBYOBRequest }
>;

interface TextDecoderStream {}
declare var TextDecoderStream: Bun.__internal.UseLibDomIfAvailable<
  "TextDecoderStream",
  { prototype: TextDecoderStream; new (): TextDecoderStream }
>;

interface TextEncoderStream {}
declare var TextEncoderStream: Bun.__internal.UseLibDomIfAvailable<
  "TextEncoderStream",
  { prototype: TextEncoderStream; new (): TextEncoderStream }
>;

interface URLSearchParams {}
declare var URLSearchParams: Bun.__internal.UseLibDomIfAvailable<
  "URLSearchParams",
  {
    prototype: URLSearchParams;
    new (
      init?:
        | URLSearchParams
        | string
        | Record<string, string | readonly string[]>
        | Iterable<[string, string]>
        | ReadonlyArray<[string, string]>,
    ): URLSearchParams;
  }
>;

interface MessageChannel {
  /**
   * Returns the first MessagePort object.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MessageChannel/port1)
   */
  readonly port1: MessagePort;
  /**
   * Returns the second MessagePort object.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MessageChannel/port2)
   */
  readonly port2: MessagePort;
}
declare var MessageChannel: Bun.__internal.UseLibDomIfAvailable<
  "MessageChannel",
  { prototype: MessageChannel; new (): MessageChannel }
>;

interface MessagePort extends Bun.__internal.LibEmptyOrNodeMessagePort {}
declare var MessagePort: Bun.__internal.UseLibDomIfAvailable<
  "MessagePort",
  {
    prototype: MessagePort;
    new (): MessagePort;
  }
>;

//#region Fetch
interface RequestInit extends Bun.__internal.LibOrFallbackRequestInit {}
interface ResponseInit extends Bun.__internal.LibOrFallbackResponseInit {}

interface Headers extends Bun.__internal.BunHeadersOverride {}
declare var Headers: Bun.__internal.UseLibDomIfAvailable<
  "Headers",
  {
    prototype: Headers;
    new (init?: Bun.HeadersInit): Headers;
  }
>;

interface Request extends Bun.__internal.BunRequestOverride {}
declare var Request: Bun.__internal.UseLibDomIfAvailable<
  "Request",
  {
    prototype: Request;
    new (requestInfo: string, init?: RequestInit): Request;
    new (requestInfo: RequestInit & { url: string }): Request;
    new (requestInfo: Request, init?: RequestInit): Request;
  }
>;

interface Response extends Bun.__internal.BunResponseOverride {}
declare var Response: Bun.__internal.UseLibDomIfAvailable<
  "Response",
  {
    new (body?: Bun.BodyInit | null | undefined, init?: ResponseInit | undefined): Response;
    /**
     * Create a new {@link Response} with a JSON body
     *
     * @param body - The body of the response
     * @param options - options to pass to the response
     *
     * @example
     *
     * ```ts
     * const response = Response.json({hi: "there"});
     * console.assert(
     *   await response.text(),
     *   `{"hi":"there"}`
     * );
     * ```
     * -------
     *
     * This is syntactic sugar for:
     * ```js
     *  new Response(JSON.stringify(body), {headers: { "Content-Type": "application/json" }})
     * ```
     * @link https://github.com/whatwg/fetch/issues/1389
     */
    json(body?: any, init?: ResponseInit | number): Response;

    /**
     * Create a new {@link Response} that redirects to url
     *
     * @param url - the URL to redirect to
     * @param status - the HTTP status code to use for the redirect
     */
    redirect(url: string, status?: number): Response;

    /**
     * Create a new {@link Response} that redirects to url
     *
     * @param url - the URL to redirect to
     * @param options - options to pass to the response
     */
    redirect(url: string, init?: ResponseInit): Response;

    /**
     * Create a new {@link Response} that has a network error
     */
    error(): Response;
  }
>;

/**
 * Extends Bun.TLSOptions with extra properties that are only supported in `fetch(url, {tls: ...})`
 */
interface BunFetchRequestInitTLS extends Bun.TLSOptions {
  /**
   * Custom function to check the server identity
   * @param hostname - The hostname of the server
   * @param cert - The certificate of the server
   * @returns An error if the server is unauthorized, otherwise undefined
   */
  checkServerIdentity?: NonNullable<import("node:tls").ConnectionOptions["checkServerIdentity"]>;
}

/**
 * BunFetchRequestInit represents additional options that Bun supports in `fetch()` only.
 *
 * Bun extends the `fetch` API with some additional options, except
 * this interface is not quite a `RequestInit`, because they won't work
 * if passed to `new Request()`. This is why it's a separate type.
 */
interface BunFetchRequestInit extends RequestInit {
  /**
   * Override the default TLS options
   */
  tls?: BunFetchRequestInitTLS;

  /**
   * Log the raw HTTP request & response to stdout. This API may be
   * removed in a future version of Bun without notice.
   * This is a custom property that is not part of the Fetch API specification.
   * It exists mostly as a debugging tool
   */
  verbose?: boolean;

  /**
   * Override http_proxy or HTTPS_PROXY
   * This is a custom property that is not part of the Fetch API specification.
   *
   * @example
   * ```js
   * const response = await fetch("http://example.com", {
   *  proxy: "https://username:password@127.0.0.1:8080"
   * });
   * ```
   */
  proxy?: string;

  /**
   * Override the default S3 options
   *
   * @example
   * ```js
   * const response = await fetch("s3://bucket/key", {
   *   s3: {
   *     accessKeyId: "AKIAIOSFODNN7EXAMPLE",
   *     secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
   *     region: "us-east-1",
   *   }
   * });
   * ```
   */
  s3?: Bun.S3Options;

  /**
   * Make the request over a Unix socket
   *
   * @example
   * ```js
   * const response = await fetch("http://example.com", { unix: "/path/to/socket" });
   * ```
   */
  unix?: string;
}

/**
 * Send a HTTP(s) request
 *
 * @param input URL string or Request object
 * @param init A structured value that contains settings for the fetch() request.
 *
 * @returns A promise that resolves to {@link Response} object.
 */
declare function fetch(input: string | URL | Request, init?: BunFetchRequestInit): Promise<Response>;

/**
 * Bun's extensions of the `fetch` API
 *
 * @see {@link fetch} The `fetch` function itself
 */
declare namespace fetch {
  /**
   * Preconnect to a URL. This can be used to improve performance by pre-resolving the DNS and establishing a TCP connection before the request is made.
   *
   * This is a custom property that is not part of the Fetch API specification.
   *
   * @param url - The URL to preconnect to
   * @param options - Options for the preconnect
   */
  export function preconnect(
    url: string | URL,
    options?: {
      /** Preconnect to the DNS of the URL */
      dns?: boolean;
      /** Preconnect to the TCP connection of the URL */
      tcp?: boolean;
      /** Preconnect to the HTTP connection of the URL */
      http?: boolean;
      /** Preconnect to the HTTPS connection of the URL */
      https?: boolean;
    },
  ): void;
}
//#endregion

declare module "bun" {
  /**
   * Fast incremental writer for files and pipes.
   *
   * This uses the same interface as {@link ArrayBufferSink}, but writes to a file or pipe.
   */
  interface FileSink {
    /**
     * Write a chunk of data to the file.
     *
     * If the file descriptor is not writable yet, the data is buffered.
     *
     * @param chunk The data to write
     * @returns Number of bytes written
     */
    write(chunk: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer): number;
    /**
     * Flush the internal buffer, committing the data to disk or the pipe.
     *
     * @returns Number of bytes flushed or a Promise resolving to the number of bytes
     */
    flush(): number | Promise<number>;
    /**
     * Close the file descriptor. This also flushes the internal buffer.
     *
     * @param error Optional error to associate with the close operation
     * @returns Number of bytes written or a Promise resolving to the number of bytes
     */
    end(error?: Error): number | Promise<number>;

    /**
     * Start the file sink with provided options.
     *
     * @param options Configuration options for the file sink
     */
    start(options?: {
      /**
       * Preallocate an internal buffer of this size
       * This can significantly improve performance when the chunk size is small
       */
      highWaterMark?: number;
    }): void;

    /**
     * For FIFOs & pipes, this lets you decide whether Bun's process should
     * remain alive until the pipe is closed.
     *
     * By default, it is automatically managed. While the stream is open, the
     * process remains alive and once the other end hangs up or the stream
     * closes, the process exits.
     *
     * If you previously called {@link unref}, you can call this again to re-enable automatic management.
     *
     * Internally, it will reference count the number of times this is called. By default, that number is 1
     *
     * If the file is not a FIFO or pipe, {@link ref} and {@link unref} do
     * nothing. If the pipe is already closed, this does nothing.
     */
    ref(): void;

    /**
     * For FIFOs & pipes, this lets you decide whether Bun's process should
     * remain alive until the pipe is closed.
     *
     * If you want to allow Bun's process to terminate while the stream is open,
     * call this.
     *
     * If the file is not a FIFO or pipe, {@link ref} and {@link unref} do
     * nothing. If the pipe is already closed, this does nothing.
     */
    unref(): void;
  }

  interface NetworkSink extends FileSink {
    /**
     * Write a chunk of data to the network.
     *
     * If the network is not writable yet, the data is buffered.
     *
     * @param chunk The data to write
     * @returns Number of bytes written
     */
    write(chunk: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer): number;
    /**
     * Flush the internal buffer, committing the data to the network.
     *
     * @returns Number of bytes flushed or a Promise resolving to the number of bytes
     */
    flush(): number | Promise<number>;
    /**
     * Finish the upload. This also flushes the internal buffer.
     *
     * @param error Optional error to associate with the end operation
     * @returns Number of bytes written or a Promise resolving to the number of bytes
     */
    end(error?: Error): number | Promise<number>;

    /**
     * Get the stat of the file.
     *
     * @returns Promise resolving to the file stats
     */
    stat(): Promise<import("node:fs").Stats>;
  }

  /**
   * Configuration options for S3 operations
   */
  interface S3Options extends BlobPropertyBag {
    /**
     * The Access Control List (ACL) policy for the file.
     * Controls who can access the file and what permissions they have.
     *
     * @example
     *     // Setting public read access
     *     const file = s3.file("public-file.txt", {
     *       acl: "public-read",
     *       bucket: "my-bucket"
     *     });
     *
     * @example
     *     // Using with presigned URLs
     *     const url = file.presign({
     *       acl: "public-read",
     *       expiresIn: 3600
     *     });
     */
    acl?:
      | "private"
      | "public-read"
      | "public-read-write"
      | "aws-exec-read"
      | "authenticated-read"
      | "bucket-owner-read"
      | "bucket-owner-full-control"
      | "log-delivery-write";

    /**
     * The S3 bucket name. Defaults to `S3_BUCKET` or `AWS_BUCKET` environment variables.
     *
     * @example
     *     // Using explicit bucket
     *     const file = s3.file("my-file.txt", { bucket: "my-bucket" });
     *
     * @example
     *     // Using environment variables
     *     // With S3_BUCKET=my-bucket in .env
     *     const file = s3.file("my-file.txt");
     */
    bucket?: string;

    /**
     * The AWS region. Defaults to `S3_REGION` or `AWS_REGION` environment variables.
     *
     * @example
     *     const file = s3.file("my-file.txt", {
     *       bucket: "my-bucket",
     *       region: "us-west-2"
     *     });
     */
    region?: string;

    /**
     * The access key ID for authentication.
     * Defaults to `S3_ACCESS_KEY_ID` or `AWS_ACCESS_KEY_ID` environment variables.
     */
    accessKeyId?: string;

    /**
     * The secret access key for authentication.
     * Defaults to `S3_SECRET_ACCESS_KEY` or `AWS_SECRET_ACCESS_KEY` environment variables.
     */
    secretAccessKey?: string;

    /**
     * Optional session token for temporary credentials.
     * Defaults to `S3_SESSION_TOKEN` or `AWS_SESSION_TOKEN` environment variables.
     *
     * @example
     *     // Using temporary credentials
     *     const file = s3.file("my-file.txt", {
     *       accessKeyId: tempAccessKey,
     *       secretAccessKey: tempSecretKey,
     *       sessionToken: tempSessionToken
     *     });
     */
    sessionToken?: string;

    /**
     * The S3-compatible service endpoint URL.
     * Defaults to `S3_ENDPOINT` or `AWS_ENDPOINT` environment variables.
     *
     * @example
     *     // AWS S3
     *     const file = s3.file("my-file.txt", {
     *       endpoint: "https://s3.us-east-1.amazonaws.com"
     *     });
     *
     * @example
     *     // Cloudflare R2
     *     const file = s3.file("my-file.txt", {
     *       endpoint: "https://<account-id>.r2.cloudflarestorage.com"
     *     });
     *
     * @example
     *     // DigitalOcean Spaces
     *     const file = s3.file("my-file.txt", {
     *       endpoint: "https://<region>.digitaloceanspaces.com"
     *     });
     *
     * @example
     *     // MinIO (local development)
     *     const file = s3.file("my-file.txt", {
     *       endpoint: "http://localhost:9000"
     *     });
     */
    endpoint?: string;

    /**
     * Use virtual hosted style endpoint. default to false, when true if `endpoint` is informed it will ignore the `bucket`
     *
     * @example
     *     // Using virtual hosted style
     *     const file = s3.file("my-file.txt", {
     *       virtualHostedStyle: true,
     *       endpoint: "https://my-bucket.s3.us-east-1.amazonaws.com"
     *     });
     */
    virtualHostedStyle?: boolean;

    /**
     * The size of each part in multipart uploads (in bytes).
     * - Minimum: 5 MiB
     * - Maximum: 5120 MiB
     * - Default: 5 MiB
     *
     * @example
     *     // Configuring multipart uploads
     *     const file = s3.file("large-file.dat", {
     *       partSize: 10 * 1024 * 1024, // 10 MiB parts
     *       queueSize: 4  // Upload 4 parts in parallel
     *     });
     *
     *     const writer = file.writer();
     *     // ... write large file in chunks
     */
    partSize?: number;

    /**
     * Number of parts to upload in parallel for multipart uploads.
     * - Default: 5
     * - Maximum: 255
     *
     * Increasing this value can improve upload speeds for large files
     * but will use more memory.
     */
    queueSize?: number;

    /**
     * Number of retry attempts for failed uploads.
     * - Default: 3
     * - Maximum: 255
     *
     * @example
     *    // Setting retry attempts
     *     const file = s3.file("my-file.txt", {
     *       retry: 5 // Retry failed uploads up to 5 times
     *     });
     */
    retry?: number;

    /**
     * The Content-Type of the file.
     * Automatically set based on file extension when possible.
     *
     * @example
     *    // Setting explicit content type
     *     const file = s3.file("data.bin", {
     *       type: "application/octet-stream"
     *     });
     */
    type?: string;

    /**
     * By default, Amazon S3 uses the STANDARD Storage Class to store newly created objects.
     *
     * @example
     *    // Setting explicit Storage class
     *     const file = s3.file("my-file.json", {
     *       storageClass: "STANDARD_IA"
     *     });
     */
    storageClass?:
      | "STANDARD"
      | "DEEP_ARCHIVE"
      | "EXPRESS_ONEZONE"
      | "GLACIER"
      | "GLACIER_IR"
      | "INTELLIGENT_TIERING"
      | "ONEZONE_IA"
      | "OUTPOSTS"
      | "REDUCED_REDUNDANCY"
      | "SNOW"
      | "STANDARD_IA";

    /**
     * @deprecated The size of the internal buffer in bytes. Defaults to 5 MiB. use `partSize` and `queueSize` instead.
     */
    highWaterMark?: number;
  }

  /**
   * Options for generating presigned URLs
   */
  interface S3FilePresignOptions extends S3Options {
    /**
     * Number of seconds until the presigned URL expires.
     * - Default: 86400 (1 day)
     *
     * @example
     *     // Short-lived URL
     *     const url = file.presign({
     *       expiresIn: 3600 // 1 hour
     *     });
     *
     * @example
     *     // Long-lived public URL
     *     const url = file.presign({
     *       expiresIn: 7 * 24 * 60 * 60, // 7 days
     *       acl: "public-read"
     *     });
     */
    expiresIn?: number;

    /**
     * The HTTP method allowed for the presigned URL.
     *
     * @example
     *     // GET URL for downloads
     *     const downloadUrl = file.presign({
     *       method: "GET",
     *       expiresIn: 3600
     *     });
     *
     * @example
     *     // PUT URL for uploads
     *     const uploadUrl = file.presign({
     *       method: "PUT",
     *       expiresIn: 3600,
     *       type: "application/json"
     *     });
     */
    method?: "GET" | "POST" | "PUT" | "DELETE" | "HEAD";
  }

  interface S3Stats {
    size: number;
    lastModified: Date;
    etag: string;
    type: string;
  }

  /**
   * Represents a file in an S3-compatible storage service.
   * Extends the Blob interface for compatibility with web APIs.
   *
   * @category Cloud Storage
   */
  interface S3File extends Blob {
    /**
     * The size of the file in bytes.
     * This is a Promise because it requires a network request to determine the size.
     *
     * @example
     *     // Getting file size
     *     const size = await file.size;
     *     console.log(`File size: ${size} bytes`);
     *
     * @example
     *     // Check if file is larger than 1MB
     *     if (await file.size > 1024 * 1024) {
     *       console.log("Large file detected");
     *     }
     */
    /**
     * TODO: figure out how to get the typescript types to not error for this property.
     */
    // size: Promise<number>;

    /**
     * Creates a new S3File representing a slice of the original file.
     * Uses HTTP Range headers for efficient partial downloads.
     *
     * @param begin - Starting byte offset
     * @param end - Ending byte offset (exclusive)
     * @param contentType - Optional MIME type for the slice
     * @returns A new S3File representing the specified range
     *
     * @example
     *  // Reading file header
     *     const header = file.slice(0, 1024);
     *     const headerText = await header.text();
     *
     * @example
     *     // Reading with content type
     *     const jsonSlice = file.slice(1024, 2048, "application/json");
     *     const data = await jsonSlice.json();
     *
     * @example
     *     // Reading from offset to end
     *     const remainder = file.slice(1024);
     *     const content = await remainder.text();
     */
    slice(begin?: number, end?: number, contentType?: string): S3File;
    slice(begin?: number, contentType?: string): S3File;
    slice(contentType?: string): S3File;

    /**
     * Creates a writable stream for uploading data.
     * Suitable for large files as it uses multipart upload.
     *
     * @param options - Configuration for the upload
     * @returns A NetworkSink for writing data
     *
     * @example
     *     // Basic streaming write
     *     const writer = file.writer({
     *       type: "application/json"
     *     });
     *     writer.write('{"hello": ');
     *     writer.write('"world"}');
     *     await writer.end();
     *
     * @example
     *     // Optimized large file upload
     *     const writer = file.writer({
     *       partSize: 10 * 1024 * 1024, // 10MB parts
     *       queueSize: 4, // Upload 4 parts in parallel
     *       retry: 3 // Retry failed parts
     *     });
     *
     *     // Write large chunks of data efficiently
     *     for (const chunk of largeDataChunks) {
     *       writer.write(chunk);
     *     }
     *     await writer.end();
     *
     * @example
     *     // Error handling
     *     const writer = file.writer();
     *     try {
     *       writer.write(data);
     *       await writer.end();
     *     } catch (err) {
     *       console.error('Upload failed:', err);
     *       // Writer will automatically abort multipart upload on error
     *     }
     */
    writer(options?: S3Options): NetworkSink;

    /**
     * Gets a readable stream of the file's content.
     * Useful for processing large files without loading them entirely into memory.
     *
     * @returns A ReadableStream for the file content
     *
     * @example
     *     // Basic streaming read
     *     const stream = file.stream();
     *     for await (const chunk of stream) {
     *       console.log('Received chunk:', chunk);
     *     }
     *
     * @example
     *     // Piping to response
     *     const stream = file.stream();
     *     return new Response(stream, {
     *       headers: { 'Content-Type': file.type }
     *     });
     *
     * @example
     *     // Processing large files
     *     const stream = file.stream();
     *     const textDecoder = new TextDecoder();
     *     for await (const chunk of stream) {
     *       const text = textDecoder.decode(chunk);
     *       // Process text chunk by chunk
     *     }
     */
    readonly readable: ReadableStream;
    stream(): ReadableStream;

    /**
     * The name or path of the file in the bucket.
     *
     * @example
     * const file = s3.file("folder/image.jpg");
     * console.log(file.name); // "folder/image.jpg"
     */
    readonly name?: string;

    /**
     * The bucket name containing the file.
     *
     * @example
     *    const file = s3.file("s3://my-bucket/file.txt");
     *    console.log(file.bucket); // "my-bucket"
     */
    readonly bucket?: string;

    /**
     * Checks if the file exists in S3.
     * Uses HTTP HEAD request to efficiently check existence without downloading.
     *
     * @returns Promise resolving to true if file exists, false otherwise
     *
     * @example
     *     // Basic existence check
     *    if (await file.exists()) {
     *      console.log("File exists in S3");
     *    }
     *
     * @example
     *  // With error handling
     *  try {
     *    const exists = await file.exists();
     *    if (!exists) {
     *      console.log("File not found");
     *    }
     *  } catch (err) {
     *    console.error("Error checking file:", err);
     *  }
     */
    exists(): Promise<boolean>;

    /**
     * Uploads data to S3.
     * Supports various input types and automatically handles large files.
     *
     * @param data - The data to upload
     * @param options - Upload configuration options
     * @returns Promise resolving to number of bytes written
     *
     * @example
     *     // Writing string data
     *     await file.write("Hello World", {
     *       type: "text/plain"
     *     });
     *
     * @example
     *     // Writing JSON
     *     const data = { hello: "world" };
     *     await file.write(JSON.stringify(data), {
     *       type: "application/json"
     *     });
     *
     * @example
     *     // Writing from Response
     *     const response = await fetch("https://example.com/data");
     *     await file.write(response);
     *
     * @example
     *     // Writing with ACL
     *     await file.write(data, {
     *       acl: "public-read",
     *       type: "application/octet-stream"
     *     });
     */
    write(
      data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer | Request | Response | BunFile | S3File | Blob,
      options?: S3Options,
    ): Promise<number>;

    /**
     * Generates a presigned URL for the file.
     * Allows temporary access to the file without exposing credentials.
     *
     * @param options - Configuration for the presigned URL
     * @returns Presigned URL string
     *
     * @example
     *     // Basic download URL
     *     const url = file.presign({
     *       expiresIn: 3600 // 1 hour
     *     });
     *
     * @example
     *     // Upload URL with specific content type
     *     const uploadUrl = file.presign({
     *       method: "PUT",
     *       expiresIn: 3600,
     *       type: "image/jpeg",
     *       acl: "public-read"
     *     });
     *
     * @example
     *     // URL with custom permissions
     *     const url = file.presign({
     *       method: "GET",
     *       expiresIn: 7 * 24 * 60 * 60, // 7 days
     *       acl: "public-read"
     *     });
     */
    presign(options?: S3FilePresignOptions): string;

    /**
     * Deletes the file from S3.
     *
     * @returns Promise that resolves when deletion is complete
     *
     * @example
     *     // Basic deletion
     *     await file.delete();
     *
     * @example
     *     // With error handling
     *     try {
     *       await file.delete();
     *       console.log("File deleted successfully");
     *     } catch (err) {
     *       console.error("Failed to delete file:", err);
     *     }
     */
    delete(): Promise<void>;

    /**
     * Alias for delete() method.
     * Provided for compatibility with Node.js fs API naming.
     *
     * @example
     * await file.unlink();
     */
    unlink: S3File["delete"];

    /**
     * Get the stat of a file in an S3-compatible storage service.
     *
     * @returns Promise resolving to S3Stat
     */
    stat(): Promise<S3Stats>;
  }

  interface S3ListObjectsOptions {
    /** Limits the response to keys that begin with the specified prefix. */
    prefix?: string;
    /** ContinuationToken indicates to S3 that the list is being continued on this bucket with a token. ContinuationToken is obfuscated and is not a real key. You can use this ContinuationToken for pagination of the list results. */
    continuationToken?: string;
    /** A delimiter is a character that you use to group keys. */
    delimiter?: string;
    /** Sets the maximum number of keys returned in the response. By default, the action returns up to 1,000 key names. The response might contain fewer keys but will never contain more. */
    maxKeys?: number;
    /** StartAfter is where you want S3 to start listing from. S3 starts listing after this specified key. StartAfter can be any key in the bucket. */
    startAfter?: string;
    /** Encoding type used by S3 to encode the object keys in the response. Responses are encoded only in UTF-8. An object key can contain any Unicode character. However, the XML 1.0 parser can't parse certain characters, such as characters with an ASCII value from 0 to 10. For characters that aren't supported in XML 1.0, you can add this parameter to request that S3 encode the keys in the response. */
    encodingType?: "url";
    /** If you want to return the owner field with each key in the result, then set the FetchOwner field to true. */
    fetchOwner?: boolean;
  }

  interface S3ListObjectsResponse {
    /** All of the keys (up to 1,000) that share the same prefix are grouped together. When counting the total numbers of returns by this API operation, this group of keys is considered as one item.
     *
     * A response can contain CommonPrefixes only if you specify a delimiter.
     *
     * CommonPrefixes contains all (if there are any) keys between Prefix and the next occurrence of the string specified by a delimiter.
     *
     * CommonPrefixes lists keys that act like subdirectories in the directory specified by Prefix.
     *
     * For example, if the prefix is notes/ and the delimiter is a slash (/) as in notes/summer/july, the common prefix is notes/summer/. All of the keys that roll up into a common prefix count as a single return when calculating the number of returns. */
    commonPrefixes?: { prefix: string }[];
    /** Metadata about each object returned. */
    contents?: {
      /** The algorithm that was used to create a checksum of the object. */
      checksumAlgorithm?: "CRC32" | "CRC32C" | "SHA1" | "SHA256" | "CRC64NVME";
      /** The checksum type that is used to calculate the object's checksum value. */
      checksumType?: "COMPOSITE" | "FULL_OBJECT";
      /**
       * The entity tag is a hash of the object. The ETag reflects changes only to the contents of an object, not its metadata. The ETag may or may not be an MD5 digest of the object data. Whether or not it is depends on how the object was created and how it is encrypted as described below:
       *
       * - Objects created by the PUT Object, POST Object, or Copy operation, or through the AWS Management Console, and are encrypted by SSE-S3 or plaintext, have ETags that are an MD5 digest of their object data.
       * - Objects created by the PUT Object, POST Object, or Copy operation, or through the AWS Management Console, and are encrypted by SSE-C or SSE-KMS, have ETags that are not an MD5 digest of their object data.
       * - If an object is created by either the Multipart Upload or Part Copy operation, the ETag is not an MD5 digest, regardless of the method of encryption. If an object is larger than 16 MB, the AWS Management Console will upload or copy that object as a Multipart Upload, and therefore the ETag will not be an MD5 digest.
       *
       * MD5 is not supported by directory buckets.
       */
      eTag?: string;
      /** The name that you assign to an object. You use the object key to retrieve the object. */
      key: string;
      /** Creation date of the object. */
      lastModified?: string;
      /** The owner of the object */
      owner?: {
        /** The ID of the owner. */
        id?: string;
        /** The display name of the owner. */
        displayName?: string;
      };
      /** Specifies the restoration status of an object. Objects in certain storage classes must be restored before they can be retrieved. */
      restoreStatus?: {
        /** Specifies whether the object is currently being restored. */
        isRestoreInProgress?: boolean;
        /** Indicates when the restored copy will expire. This value is populated only if the object has already been restored. */
        restoreExpiryDate?: string;
      };
      /** Size in bytes of the object */
      size?: number;
      /** The class of storage used to store the object. */
      storageClass?:
        | "STANDARD"
        | "REDUCED_REDUNDANCY"
        | "GLACIER"
        | "STANDARD_IA"
        | "ONEZONE_IA"
        | "INTELLIGENT_TIERING"
        | "DEEP_ARCHIVE"
        | "OUTPOSTS"
        | "GLACIER_IR"
        | "SNOW"
        | "EXPRESS_ONEZONE";
    }[];
    /** If ContinuationToken was sent with the request, it is included in the response. You can use the returned ContinuationToken for pagination of the list response.  */
    continuationToken?: string;
    /** Causes keys that contain the same string between the prefix and the first occurrence of the delimiter to be rolled up into a single result element in the CommonPrefixes collection. These rolled-up keys are not returned elsewhere in the response. Each rolled-up result counts as only one return against the MaxKeys value. */
    delimiter?: string;
    /** Encoding type used by S3 to encode object key names in the XML response. */
    encodingType?: "url";
    /** Set to false if all of the results were returned. Set to true if more keys are available to return. If the number of results exceeds that specified by MaxKeys, all of the results might not be returned. */
    isTruncated?: boolean;
    /** KeyCount is the number of keys returned with this request. KeyCount will always be less than or equal to the MaxKeys field. For example, if you ask for 50 keys, your result will include 50 keys or fewer. */
    keyCount?: number;
    /** Sets the maximum number of keys returned in the response. By default, the action returns up to 1,000 key names. The response might contain fewer keys but will never contain more. */
    maxKeys?: number;
    /** The bucket name. */
    name?: string;
    /** NextContinuationToken is sent when isTruncated is true, which means there are more keys in the bucket that can be listed. The next list requests to S3 can be continued with this NextContinuationToken. NextContinuationToken is obfuscated and is not a real key. */
    nextContinuationToken?: string;
    /** Keys that begin with the indicated prefix. */
    prefix?: string;
    /** If StartAfter was sent with the request, it is included in the response. */
    startAfter?: string;
  }

  /**
   * A configured S3 bucket instance for managing files.
   * The instance is callable to create S3File instances and provides methods
   * for common operations.
   *
   * @example
   *     // Basic bucket setup
   *     const bucket = new S3Client({
   *       bucket: "my-bucket",
   *       accessKeyId: "key",
   *       secretAccessKey: "secret"
   *     });
   *
   *     // Get file instance
   *     const file = bucket.file("image.jpg");
   *
   *     // Common operations
   *     await bucket.write("data.json", JSON.stringify({hello: "world"}));
   *     const url = bucket.presign("file.pdf");
   *     await bucket.unlink("old.txt");
   *
   * @category Cloud Storage
   */
  class S3Client {
    /**
     * Create a new instance of an S3 bucket so that credentials can be managed
     * from a single instance instead of being passed to every method.
     *
     * @param options The default options to use for the S3 client. Can be
     * overriden by passing options to the methods.
     * @returns A new S3Client instance
     *
     * ## Keep S3 credentials in a single instance
     *
     * @example
     *     const bucket = new Bun.S3Client({
     *       accessKeyId: "your-access-key",
     *       secretAccessKey: "your-secret-key",
     *       bucket: "my-bucket",
     *       endpoint: "https://s3.us-east-1.amazonaws.com",
     *       sessionToken: "your-session-token",
     *     });
     *
     *     // S3Client is callable, so you can do this:
     *     const file = bucket.file("my-file.txt");
     *
     *     // or this:
     *     await file.write("Hello Bun!");
     *     await file.text();
     *
     *     // To delete the file:
     *     await bucket.delete("my-file.txt");
     *
     *     // To write a file without returning the instance:
     *     await bucket.write("my-file.txt", "Hello Bun!");
     *
     */
    constructor(options?: S3Options);

    /**
     * Creates an S3File instance for the given path.
     *
     * @param path The path to the file in the bucket
     * @param options Additional S3 options to override defaults
     * @returns An S3File instance
     *
     * @example
     *     const file = bucket.file("image.jpg");
     *     await file.write(imageData);
     *
     *     const configFile = bucket.file("config.json", {
     *       type: "application/json",
     *       acl: "private"
     *     });
     */
    file(path: string, options?: S3Options): S3File;

    /**
     * Creates an S3File instance for the given path.
     *
     * @param path The path to the file in the bucket
     * @param options S3 credentials and configuration options
     * @returns An S3File instance
     *
     * @example
     *     const file = S3Client.file("image.jpg", credentials);
     *     await file.write(imageData);
     *
     *     const configFile = S3Client.file("config.json", {
     *       ...credentials,
     *       type: "application/json",
     *       acl: "private"
     *     });
     */
    static file(path: string, options?: S3Options): S3File;

    /**
     * Writes data directly to a path in the bucket.
     * Supports strings, buffers, streams, and web API types.
     *
     * @param path The path to the file in the bucket
     * @param data The data to write to the file
     * @param options Additional S3 options to override defaults
     * @returns The number of bytes written
     *
     * @example
     *     // Write string
     *     await bucket.write("hello.txt", "Hello World");
     *
     *     // Write JSON with type
     *     await bucket.write(
     *       "data.json",
     *       JSON.stringify({hello: "world"}),
     *       {type: "application/json"}
     *     );
     *
     *     // Write from fetch
     *     const res = await fetch("https://example.com/data");
     *     await bucket.write("data.bin", res);
     *
     *     // Write with ACL
     *     await bucket.write("public.html", html, {
     *       acl: "public-read",
     *       type: "text/html"
     *     });
     */
    write(
      path: string,
      data:
        | string
        | ArrayBufferView
        | ArrayBuffer
        | SharedArrayBuffer
        | Request
        | Response
        | BunFile
        | S3File
        | Blob
        | File,
      options?: S3Options,
    ): Promise<number>;

    /**
     * Writes data directly to a path in the bucket.
     * Supports strings, buffers, streams, and web API types.
     *
     * @param path The path to the file in the bucket
     * @param data The data to write to the file
     * @param options S3 credentials and configuration options
     * @returns The number of bytes written
     *
     * @example
     *     // Write string
     *     await S3Client.write("hello.txt", "Hello World", credentials);
     *
     *     // Write JSON with type
     *     await S3Client.write(
     *       "data.json",
     *       JSON.stringify({hello: "world"}),
     *       {
     *         ...credentials,
     *         type: "application/json"
     *       }
     *     );
     *
     *     // Write from fetch
     *     const res = await fetch("https://example.com/data");
     *     await S3Client.write("data.bin", res, credentials);
     *
     *     // Write with ACL
     *     await S3Client.write("public.html", html, {
     *       ...credentials,
     *       acl: "public-read",
     *       type: "text/html"
     *     });
     */
    static write(
      path: string,
      data:
        | string
        | ArrayBufferView
        | ArrayBuffer
        | SharedArrayBuffer
        | Request
        | Response
        | BunFile
        | S3File
        | Blob
        | File,
      options?: S3Options,
    ): Promise<number>;

    /**
     * Generate a presigned URL for temporary access to a file.
     * Useful for generating upload/download URLs without exposing credentials.
     *
     * @param path The path to the file in the bucket
     * @param options Options for generating the presigned URL
     * @returns A presigned URL string
     *
     * @example
     *     // Download URL
     *     const downloadUrl = bucket.presign("file.pdf", {
     *       expiresIn: 3600 // 1 hour
     *     });
     *
     *     // Upload URL
     *     const uploadUrl = bucket.presign("uploads/image.jpg", {
     *       method: "PUT",
     *       expiresIn: 3600,
     *       type: "image/jpeg",
     *       acl: "public-read"
     *     });
     *
     *     // Long-lived public URL
     *     const publicUrl = bucket.presign("public/doc.pdf", {
     *       expiresIn: 7 * 24 * 60 * 60, // 7 days
     *       acl: "public-read"
     *     });
     */
    presign(path: string, options?: S3FilePresignOptions): string;

    /**
     * Generate a presigned URL for temporary access to a file.
     * Useful for generating upload/download URLs without exposing credentials.
     *
     * @param path The path to the file in the bucket
     * @param options S3 credentials and presigned URL configuration
     * @returns A presigned URL string
     *
     * @example
     *     // Download URL
     *     const downloadUrl = S3Client.presign("file.pdf", {
     *       ...credentials,
     *       expiresIn: 3600 // 1 hour
     *     });
     *
     *     // Upload URL
     *     const uploadUrl = S3Client.presign("uploads/image.jpg", {
     *       ...credentials,
     *       method: "PUT",
     *       expiresIn: 3600,
     *       type: "image/jpeg",
     *       acl: "public-read"
     *     });
     *
     *     // Long-lived public URL
     *     const publicUrl = S3Client.presign("public/doc.pdf", {
     *       ...credentials,
     *       expiresIn: 7 * 24 * 60 * 60, // 7 days
     *       acl: "public-read"
     *     });
     */
    static presign(path: string, options?: S3FilePresignOptions): string;

    /**
     * Delete a file from the bucket.
     *
     * @param path The path to the file in the bucket
     * @param options Additional S3 options to override defaults
     * @returns A promise that resolves when deletion is complete
     *
     * @example
     *     // Simple delete
     *     await bucket.unlink("old-file.txt");
     *
     *     // With error handling
     *     try {
     *       await bucket.unlink("file.dat");
     *       console.log("File deleted");
     *     } catch (err) {
     *       console.error("Delete failed:", err);
     *     }
     */
    unlink(path: string, options?: S3Options): Promise<void>;

    /**
     * Delete a file from the bucket.
     *
     * @param path The path to the file in the bucket
     * @param options S3 credentials and configuration options
     * @returns A promise that resolves when deletion is complete
     *
     * @example
     *     // Simple delete
     *     await S3Client.unlink("old-file.txt", credentials);
     *
     *     // With error handling
     *     try {
     *       await S3Client.unlink("file.dat", credentials);
     *       console.log("File deleted");
     *     } catch (err) {
     *       console.error("Delete failed:", err);
     *     }
     */
    static unlink(path: string, options?: S3Options): Promise<void>;

    /**
     * Delete a file from the bucket.
     * Alias for {@link S3Client.unlink}.
     *
     * @param path The path to the file in the bucket
     * @param options Additional S3 options to override defaults
     * @returns A promise that resolves when deletion is complete
     *
     * @example
     *     // Simple delete
     *     await bucket.delete("old-file.txt");
     *
     *     // With error handling
     *     try {
     *       await bucket.delete("file.dat");
     *       console.log("File deleted");
     *     } catch (err) {
     *       console.error("Delete failed:", err);
     *     }
     */
    delete(path: string, options?: S3Options): Promise<void>;

    /**
     * Delete a file from the bucket.
     * Alias for {@link S3Client.unlink}.
     *
     * @param path The path to the file in the bucket
     * @param options S3 credentials and configuration options
     * @returns A promise that resolves when deletion is complete
     *
     * @example
     *     // Simple delete
     *     await S3Client.delete("old-file.txt", credentials);
     *
     *     // With error handling
     *     try {
     *       await S3Client.delete("file.dat", credentials);
     *       console.log("File deleted");
     *     } catch (err) {
     *       console.error("Delete failed:", err);
     *     }
     */
    static delete(path: string, options?: S3Options): Promise<void>;

    /**
     * Get the size of a file in bytes.
     * Uses HEAD request to efficiently get size.
     *
     * @param path The path to the file in the bucket
     * @param options Additional S3 options to override defaults
     * @returns A promise that resolves to the file size in bytes
     *
     * @example
     *     // Get size
     *     const bytes = await bucket.size("video.mp4");
     *     console.log(`Size: ${bytes} bytes`);
     *
     *     // Check if file is large
     *     if (await bucket.size("data.zip") > 100 * 1024 * 1024) {
     *       console.log("File is larger than 100MB");
     *     }
     */
    size(path: string, options?: S3Options): Promise<number>;

    /**
     * Get the size of a file in bytes.
     * Uses HEAD request to efficiently get size.
     *
     * @param path The path to the file in the bucket
     * @param options S3 credentials and configuration options
     * @returns A promise that resolves to the file size in bytes
     *
     * @example
     *     // Get size
     *     const bytes = await S3Client.size("video.mp4", credentials);
     *     console.log(`Size: ${bytes} bytes`);
     *
     *     // Check if file is large
     *     if (await S3Client.size("data.zip", credentials) > 100 * 1024 * 1024) {
     *       console.log("File is larger than 100MB");
     *     }
     */
    static size(path: string, options?: S3Options): Promise<number>;

    /**
     * Check if a file exists in the bucket.
     * Uses HEAD request to check existence.
     *
     * @param path The path to the file in the bucket
     * @param options Additional S3 options to override defaults
     * @returns A promise that resolves to true if the file exists, false otherwise
     *
     * @example
     *     // Check existence
     *     if (await bucket.exists("config.json")) {
     *       const file = bucket.file("config.json");
     *       const config = await file.json();
     *     }
     *
     *     // With error handling
     *     try {
     *       if (!await bucket.exists("required.txt")) {
     *         throw new Error("Required file missing");
     *       }
     *     } catch (err) {
     *       console.error("Check failed:", err);
     *     }
     */
    exists(path: string, options?: S3Options): Promise<boolean>;

    /**
     * Check if a file exists in the bucket.
     * Uses HEAD request to check existence.
     *
     * @param path The path to the file in the bucket
     * @param options S3 credentials and configuration options
     * @returns A promise that resolves to true if the file exists, false otherwise
     *
     * @example
     *     // Check existence
     *     if (await S3Client.exists("config.json", credentials)) {
     *       const file = bucket.file("config.json");
     *       const config = await file.json();
     *     }
     *
     *     // With error handling
     *     try {
     *       if (!await S3Client.exists("required.txt", credentials)) {
     *         throw new Error("Required file missing");
     *       }
     *     } catch (err) {
     *       console.error("Check failed:", err);
     *     }
     */
    static exists(path: string, options?: S3Options): Promise<boolean>;

    /**
     * Get the stat of a file in an S3-compatible storage service.
     *
     * @param path The path to the file in the bucket
     * @param options Additional S3 options to override defaults
     * @returns A promise that resolves to the file stats
     *
     * @example
     *     const stat = await bucket.stat("my-file.txt");
     */
    stat(path: string, options?: S3Options): Promise<S3Stats>;

    /**
     * Get the stat of a file in an S3-compatible storage service.
     *
     * @param path The path to the file in the bucket
     * @param options S3 credentials and configuration options
     * @returns A promise that resolves to the file stats
     *
     * @example
     *     const stat = await S3Client.stat("my-file.txt", credentials);
     */
    static stat(path: string, options?: S3Options): Promise<S3Stats>;

    /**
     * Returns some or all (up to 1,000) of the objects in a bucket with each request.
     *
     * You can use the request parameters as selection criteria to return a subset of the objects in a bucket.
     *
     * @param input Options for listing objects in the bucket
     * @param options Additional S3 options to override defaults
     * @returns A promise that resolves to the list response
     *
     * @example
     *     // List (up to) 1000 objects in the bucket
     *     const allObjects = await bucket.list();
     *
     *     // List (up to) 500 objects under `uploads/` prefix, with owner field for each object
     *     const uploads = await bucket.list({
     *       prefix: 'uploads/',
     *       maxKeys: 500,
     *       fetchOwner: true,
     *     });
     *
     *     // Check if more results are available
     *     if (uploads.isTruncated) {
     *       // List next batch of objects under `uploads/` prefix
     *       const moreUploads = await bucket.list({
     *         prefix: 'uploads/',
     *         maxKeys: 500,
     *         startAfter: uploads.contents!.at(-1).key
     *         fetchOwner: true,
     *       });
     *     }
     */
    list(
      input?: S3ListObjectsOptions | null,
      options?: Pick<S3Options, "accessKeyId" | "secretAccessKey" | "sessionToken" | "region" | "bucket" | "endpoint">,
    ): Promise<S3ListObjectsResponse>;

    /**
     * Returns some or all (up to 1,000) of the objects in a bucket with each request.
     *
     * You can use the request parameters as selection criteria to return a subset of the objects in a bucket.
     *
     * @param input Options for listing objects in the bucket
     * @param options S3 credentials and configuration options
     * @returns A promise that resolves to the list response
     *
     * @example
     *     // List (up to) 1000 objects in the bucket
     *     const allObjects = await S3Client.list(null, credentials);
     *
     *     // List (up to) 500 objects under `uploads/` prefix, with owner field for each object
     *     const uploads = await S3Client.list({
     *       prefix: 'uploads/',
     *       maxKeys: 500,
     *       fetchOwner: true,
     *     }, credentials);
     *
     *     // Check if more results are available
     *     if (uploads.isTruncated) {
     *       // List next batch of objects under `uploads/` prefix
     *       const moreUploads = await S3Client.list({
     *         prefix: 'uploads/',
     *         maxKeys: 500,
     *         startAfter: uploads.contents!.at(-1).key
     *         fetchOwner: true,
     *       }, credentials);
     *     }
     */
    static list(
      input?: S3ListObjectsOptions | null,
      options?: Pick<S3Options, "accessKeyId" | "secretAccessKey" | "sessionToken" | "region" | "bucket" | "endpoint">,
    ): Promise<S3ListObjectsResponse>;
  }

  /**
   * A default instance of S3Client
   *
   * Pulls credentials from environment variables. Use `new Bun.S3Client()` if you need to explicitly set credentials.
   *
   * @category Cloud Storage
   */
  var s3: S3Client;
}

/*

  This file does not declare any global types.

  That should only happen in [./globals.d.ts](./globals.d.ts)
  so that our documentation generator can pick it up, as it
  expects all globals to be declared in one file.

 */

declare module "bun" {
  type HeadersInit = string[][] | Record<string, string | ReadonlyArray<string>> | Headers;
  type BodyInit =
    | ReadableStream
    | Bun.XMLHttpRequestBodyInit
    | URLSearchParams
    | AsyncGenerator<string | ArrayBuffer | ArrayBufferView>
    | (() => AsyncGenerator<string | ArrayBuffer | ArrayBufferView>);

  namespace __internal {
    type LibOrFallbackHeaders = LibDomIsLoaded extends true ? {} : import("undici-types").Headers;
    type LibOrFallbackRequest = LibDomIsLoaded extends true ? {} : import("undici-types").Request;
    type LibOrFallbackResponse = LibDomIsLoaded extends true ? {} : import("undici-types").Response;
    type LibOrFallbackResponseInit = LibDomIsLoaded extends true ? {} : import("undici-types").ResponseInit;
    type LibOrFallbackRequestInit = LibDomIsLoaded extends true
      ? {}
      : Omit<import("undici-types").RequestInit, "body" | "headers"> & {
          body?: Bun.BodyInit | null | undefined;
          headers?: Bun.HeadersInit;
        };

    interface BunHeadersOverride extends LibOrFallbackHeaders {
      /**
       * Convert {@link Headers} to a plain JavaScript object.
       *
       * About 10x faster than `Object.fromEntries(headers.entries())`
       *
       * Called when you run `JSON.stringify(headers)`
       *
       * Does not preserve insertion order. Well-known header names are lowercased. Other header names are left as-is.
       */
      toJSON(): Record<string, string> & { "set-cookie"?: string[] };

      /**
       * Get the total number of headers
       */
      readonly count: number;

      /**
       * Get all headers matching the name
       *
       * Only supports `"Set-Cookie"`. All other headers are empty arrays.
       *
       * @param name - The header name to get
       *
       * @returns An array of header values
       *
       * @example
       * ```ts
       * const headers = new Headers();
       * headers.append("Set-Cookie", "foo=bar");
       * headers.append("Set-Cookie", "baz=qux");
       * headers.getAll("Set-Cookie"); // ["foo=bar", "baz=qux"]
       * ```
       */
      getAll(name: "set-cookie" | "Set-Cookie"): string[];
    }

    interface BunRequestOverride extends LibOrFallbackRequest {
      headers: BunHeadersOverride;
    }

    interface BunResponseOverride extends LibOrFallbackResponse {
      headers: BunHeadersOverride;
    }
  }
}

/**
 * Bun.js runtime APIs
 *
 * @example
 *
 * ```js
 * import {file} from 'bun';
 *
 * // Log the file to the console
 * const input = await file('/path/to/file.txt').text();
 * console.log(input);
 * ```
 *
 * This module aliases `globalThis.Bun`.
 */
declare module "bun" {
  type DistributedOmit<T, K extends PropertyKey> = T extends T ? Omit<T, K> : never;
  type PathLike = string | NodeJS.TypedArray | ArrayBufferLike | URL;
  type ArrayBufferView<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> =
    | NodeJS.TypedArray<TArrayBuffer>
    | DataView<TArrayBuffer>;
  type BufferSource = NodeJS.TypedArray | DataView | ArrayBufferLike;
  type StringOrBuffer = string | NodeJS.TypedArray | ArrayBufferLike;
  type XMLHttpRequestBodyInit = Blob | BufferSource | string | FormData | Iterable<Uint8Array>;
  type ReadableStreamController<T> = ReadableStreamDefaultController<T>;
  type ReadableStreamDefaultReadResult<T> =
    | ReadableStreamDefaultReadValueResult<T>
    | ReadableStreamDefaultReadDoneResult;
  type ReadableStreamReader<T> = ReadableStreamDefaultReader<T>;
  type Transferable = ArrayBuffer | MessagePort;
  type MessageEventSource = Bun.__internal.UseLibDomIfAvailable<"MessageEventSource", undefined>;
  type Encoding = "utf-8" | "windows-1252" | "utf-16";
  type UncaughtExceptionOrigin = "uncaughtException" | "unhandledRejection";
  type MultipleResolveType = "resolve" | "reject";
  type BeforeExitListener = (code: number) => void;
  type DisconnectListener = () => void;
  type ExitListener = (code: number) => void;
  type RejectionHandledListener = (promise: Promise<unknown>) => void;
  type FormDataEntryValue = File | string;
  type WarningListener = (warning: Error) => void;
  type MessageListener = (message: unknown, sendHandle: unknown) => void;
  type SignalsListener = (signal: NodeJS.Signals) => void;
  type BlobPart = string | Blob | BufferSource;
  type TimerHandler = (...args: any[]) => void;
  type DOMHighResTimeStamp = number;
  type EventListenerOrEventListenerObject = EventListener | EventListenerObject;
  type BlobOrStringOrBuffer = string | NodeJS.TypedArray | ArrayBufferLike | Blob;
  type MaybePromise<T> = T | Promise<T>;

  namespace __internal {
    type LibDomIsLoaded = typeof globalThis extends { onabort: any } ? true : false;

    /**
     * Helper type for avoiding conflicts in types.
     *
     * Uses the lib.dom.d.ts definition if it exists, otherwise defines it locally.
     *
     * This is to avoid type conflicts between lib.dom.d.ts and \@types/bun.
     *
     * Unfortunately some symbols cannot be defined when both Bun types and lib.dom.d.ts types are loaded,
     * and since we can't redeclare the symbol in a way that satisfies both, we need to fallback
     * to the type that lib.dom.d.ts provides.
     */
    type UseLibDomIfAvailable<GlobalThisKeyName extends PropertyKey, Otherwise> =
      // `onabort` is defined in lib.dom.d.ts, so we can check to see if lib dom is loaded by checking if `onabort` is defined
      LibDomIsLoaded extends true
        ? typeof globalThis extends { [K in GlobalThisKeyName]: infer T } // if it is loaded, infer it from `globalThis` and use that value
          ? T
          : Otherwise // Not defined in lib dom (or anywhere else), so no conflict. We can safely use our own definition
        : Otherwise; // Lib dom not loaded anyway, so no conflict. We can safely use our own definition
  }

  /** @deprecated This type is unused in Bun's types and might be removed in the near future */
  type Platform =
    | "aix"
    | "android"
    | "darwin"
    | "freebsd"
    | "haiku"
    | "linux"
    | "openbsd"
    | "sunos"
    | "win32"
    | "cygwin"
    | "netbsd";

  /** @deprecated This type is unused in Bun's types and might be removed in the near future */
  type Architecture = "arm" | "arm64" | "ia32" | "mips" | "mipsel" | "ppc" | "ppc64" | "s390" | "s390x" | "x64";

  /** @deprecated This type is unused in Bun's types and might be removed in the near future */
  type UncaughtExceptionListener = (error: Error, origin: UncaughtExceptionOrigin) => void;

  /**
   * Most of the time the unhandledRejection will be an Error, but this should not be relied upon
   * as *anything* can be thrown/rejected, it is therefore unsafe to assume that the value is an Error.
   *
   * @deprecated This type is unused in Bun's types and might be removed in the near future
   */
  type UnhandledRejectionListener = (reason: unknown, promise: Promise<unknown>) => void;

  /** @deprecated This type is unused in Bun's types and might be removed in the near future */
  type MultipleResolveListener = (type: MultipleResolveType, promise: Promise<unknown>, value: unknown) => void;

  interface ErrorEventInit extends EventInit {
    colno?: number;
    error?: any;
    filename?: string;
    lineno?: number;
    message?: string;
  }

  interface CloseEventInit extends EventInit {
    code?: number;
    reason?: string;
    wasClean?: boolean;
  }

  interface MessageEventInit<T = any> extends EventInit {
    data?: T;
    lastEventId?: string;
    origin?: string;
    source?: Bun.MessageEventSource | null;
  }

  interface EventInit {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
  }

  interface EventListenerOptions {
    capture?: boolean;
  }

  interface CustomEventInit<T = any> extends Bun.EventInit {
    detail?: T;
  }

  /** A message received by a target object. */
  interface BunMessageEvent<T = any> extends Event {
    /** Returns the data of the message. */
    readonly data: T;
    /** Returns the last event ID string, for server-sent events. */
    readonly lastEventId: string;
    /** Returns the origin of the message, for server-sent events and cross-document messaging. */
    readonly origin: string;
    /** Returns the MessagePort array sent with the message, for cross-document messaging and channel messaging. */
    readonly ports: readonly MessagePort[]; // ReadonlyArray<typeof import("worker_threads").MessagePort["prototype"]>;
    readonly source: Bun.MessageEventSource | null;
  }

  type MessageEvent<T = any> = Bun.__internal.UseLibDomIfAvailable<"MessageEvent", BunMessageEvent<T>>;

  interface ReadableStreamDefaultReadManyResult<T> {
    done: boolean;
    /** Number of bytes */
    size: number;
    value: T[];
  }

  interface EventSourceEventMap {
    error: Event;
    message: MessageEvent;
    open: Event;
  }

  interface AddEventListenerOptions extends EventListenerOptions {
    /** When `true`, the listener is automatically removed when it is first invoked. Default: `false`. */
    once?: boolean;
    /** When `true`, serves as a hint that the listener will not call the `Event` object's `preventDefault()` method. Default: false. */
    passive?: boolean;
    signal?: AbortSignal;
  }

  interface EventListener {
    (evt: Event): void;
  }

  interface EventListenerObject {
    handleEvent(object: Event): void;
  }

  interface FetchEvent extends Event {
    readonly request: Request;
    readonly url: string;

    waitUntil(promise: Promise<any>): void;
    respondWith(response: Response | Promise<Response>): void;
  }

  interface EventMap {
    fetch: FetchEvent;
    message: MessageEvent;
    messageerror: MessageEvent;
    // exit: Event;
  }

  interface StructuredSerializeOptions {
    transfer?: Bun.Transferable[];
  }

  interface EventSource extends EventTarget {
    new (url: string | URL, eventSourceInitDict?: EventSourceInit): EventSource;

    onerror: ((this: EventSource, ev: Event) => any) | null;
    onmessage: ((this: EventSource, ev: MessageEvent) => any) | null;
    onopen: ((this: EventSource, ev: Event) => any) | null;
    /** Returns the state of this EventSource object's connection. It can have the values described below. */
    readonly readyState: number;
    /** Returns the URL providing the event stream. */
    readonly url: string;
    /** Returns true if the credentials mode for connection requests to the URL providing the event stream is set to "include", and false otherwise.
     *
     * Not supported in Bun
     */
    readonly withCredentials: boolean;
    /** Aborts any instances of the fetch algorithm started for this EventSource object, and sets the readyState attribute to CLOSED. */
    close(): void;
    readonly CLOSED: 2;
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    addEventListener<K extends keyof EventSourceEventMap>(
      type: K,
      listener: (this: EventSource, ev: EventSourceEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: (this: EventSource, event: MessageEvent) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof EventSourceEventMap>(
      type: K,
      listener: (this: EventSource, ev: EventSourceEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: (this: EventSource, event: MessageEvent) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void;

    /**
     * Keep the event loop alive while connection is open or reconnecting
     *
     * Not available in browsers
     */
    ref(): void;

    /**
     * Do not keep the event loop alive while connection is open or reconnecting
     *
     * Not available in browsers
     */
    unref(): void;
  }

  interface TransformerFlushCallback<O> {
    (controller: TransformStreamDefaultController<O>): void | PromiseLike<void>;
  }

  interface TransformerStartCallback<O> {
    (controller: TransformStreamDefaultController<O>): any;
  }

  interface TransformerTransformCallback<I, O> {
    (chunk: I, controller: TransformStreamDefaultController<O>): void | PromiseLike<void>;
  }

  interface UnderlyingSinkAbortCallback {
    (reason?: any): void | PromiseLike<void>;
  }

  interface UnderlyingSinkCloseCallback {
    (): void | PromiseLike<void>;
  }

  interface UnderlyingSinkStartCallback {
    (controller: WritableStreamDefaultController): any;
  }

  interface UnderlyingSinkWriteCallback<W> {
    (chunk: W, controller: WritableStreamDefaultController): void | PromiseLike<void>;
  }

  interface UnderlyingSourceCancelCallback {
    (reason?: any): void | PromiseLike<void>;
  }

  interface UnderlyingSink<W = any> {
    abort?: UnderlyingSinkAbortCallback;
    close?: UnderlyingSinkCloseCallback;
    start?: UnderlyingSinkStartCallback;
    type?: undefined | "default" | "bytes";
    write?: UnderlyingSinkWriteCallback<W>;
  }

  interface UnderlyingSource<R = any> {
    cancel?: UnderlyingSourceCancelCallback;
    pull?: UnderlyingSourcePullCallback<R>;
    start?: UnderlyingSourceStartCallback<R>;
    /**
     * Mode "bytes" is not currently supported.
     */
    type?: undefined;
  }

  interface DirectUnderlyingSource<R = any> {
    cancel?: UnderlyingSourceCancelCallback;
    pull: (controller: ReadableStreamDirectController) => void | PromiseLike<void>;
    type: "direct";
  }

  interface UnderlyingSourcePullCallback<R> {
    (controller: ReadableStreamController<R>): void | PromiseLike<void>;
  }

  interface UnderlyingSourceStartCallback<R> {
    (controller: ReadableStreamController<R>): any;
  }

  interface GenericTransformStream {
    readonly readable: ReadableStream;
    readonly writable: WritableStream;
  }

  interface AbstractWorkerEventMap {
    error: ErrorEvent;
  }

  interface WorkerEventMap extends AbstractWorkerEventMap {
    message: MessageEvent;
    messageerror: MessageEvent;
    close: CloseEvent;
    open: Event;
  }

  type WorkerType = "classic" | "module";

  /**
   * This type-only interface is identical at runtime to {@link ReadableStream},
   * and exists to document types that do not exist yet in libdom.
   */
  interface BunReadableStream<T = any> extends ReadableStream<T> {
    text(): Promise<string>;
    bytes(): Promise<Uint8Array>;
    json(): Promise<any>;
    blob(): Promise<Blob>;
  }

  interface AbstractWorker {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ServiceWorker/error_event) */
    onerror: ((this: AbstractWorker, ev: ErrorEvent) => any) | null;
    addEventListener<K extends keyof AbstractWorkerEventMap>(
      type: K,
      listener: (this: AbstractWorker, ev: AbstractWorkerEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof AbstractWorkerEventMap>(
      type: K,
      listener: (this: AbstractWorker, ev: AbstractWorkerEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void;
  }

  /**
   * Bun's Web Worker constructor supports some extra options on top of the API browsers have.
   */
  interface WorkerOptions {
    /**
     * A string specifying an identifying name for the DedicatedWorkerGlobalScope representing the scope of
     * the worker, which is mainly useful for debugging purposes.
     */
    name?: string;

    /**
     * Use less memory, but make the worker slower.
     *
     * Internally, this sets the heap size configuration in JavaScriptCore to be
     * the small heap instead of the large heap.
     */
    smol?: boolean;

    /**
     * When `true`, the worker will keep the parent thread alive until the worker is terminated or `unref`'d.
     * When `false`, the worker will not keep the parent thread alive.
     *
     * By default, this is `false`.
     */
    ref?: boolean;

    /**
     * In Bun, this does nothing.
     */
    type?: Bun.WorkerType | undefined;

    /**
     * List of arguments which would be stringified and appended to
     * `Bun.argv` / `process.argv` in the worker. This is mostly similar to the `data`
     * but the values will be available on the global `Bun.argv` as if they
     * were passed as CLI options to the script.
     */
    argv?: any[] | undefined;

    /** If `true` and the first argument is a string, interpret the first argument to the constructor as a script that is executed once the worker is online. */
    // eval?: boolean | undefined;

    /**
     * If set, specifies the initial value of process.env inside the Worker thread. As a special value, worker.SHARE_ENV may be used to specify that the parent thread and the child thread should share their environment variables; in that case, changes to one thread's process.env object affect the other thread as well. Default: process.env.
     */
    env?: Record<string, string> | (typeof import("node:worker_threads"))["SHARE_ENV"] | undefined;

    /**
     * In Bun, this does nothing.
     */
    credentials?: import("undici-types").RequestCredentials | undefined;

    /**
     * @default true
     */
    // trackUnmanagedFds?: boolean;
    // resourceLimits?: import("worker_threads").ResourceLimits;

    /**
     * An array of module specifiers to preload in the worker.
     *
     * These modules load before the worker's entry point is executed.
     *
     * Equivalent to passing the `--preload` CLI argument, but only for this Worker.
     */
    preload?: string[] | string | undefined;
  }

  interface Worker extends EventTarget, AbstractWorker {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Worker/message_event) */
    onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Worker/messageerror_event) */
    onmessageerror: ((this: Worker, ev: MessageEvent) => any) | null;
    /**
     * Clones message and transmits it to worker's global environment. transfer can be passed as a list of objects that are to be transferred rather than cloned.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Worker/postMessage)
     */
    postMessage(message: any, transfer: Transferable[]): void;
    postMessage(message: any, options?: StructuredSerializeOptions): void;
    /**
     * Aborts worker's associated global environment.
     *
     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Worker/terminate)
     */
    terminate(): void;
    addEventListener<K extends keyof WorkerEventMap>(
      type: K,
      listener: (this: Worker, ev: WorkerEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof WorkerEventMap>(
      type: K,
      listener: (this: Worker, ev: WorkerEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void;

    /**
     * Opposite of `unref()`, calling `ref()` on a previously `unref()`ed worker does _not_ let the program exit if it's the only active handle left (the default
     * behavior). If the worker is `ref()`ed, calling `ref()` again has
     * no effect.
     * @since v10.5.0
     */
    ref(): void;

    /**
     * Calling `unref()` on a worker allows the thread to exit if this is the only
     * active handle in the event system. If the worker is already `unref()`ed calling`unref()` again has no effect.
     * @since v10.5.0
     */
    unref(): void;

    /**
     * An integer identifier for the referenced thread. Inside the worker thread,
     * it is available as `require('node:worker_threads').threadId`.
     * This value is unique for each `Worker` instance inside a single process.
     * @since v10.5.0
     */
    threadId: number;
  }

  interface Env {
    NODE_ENV?: string;
    /**
     * Can be used to change the default timezone at runtime
     */
    TZ?: string;
  }

  /**
   * The environment variables of the process
   *
   * Defaults to `process.env` as it was when the current Bun process launched.
   *
   * Changes to `process.env` at runtime won't automatically be reflected in the default value. For that, you can pass `process.env` explicitly.
   */
  const env: Env & NodeJS.ProcessEnv & ImportMetaEnv;

  /**
   * The raw arguments passed to the process, including flags passed to Bun. If you want to easily read flags passed to your script, consider using `process.argv` instead.
   */
  const argv: string[];

  interface WhichOptions {
    /**
     * Overrides the PATH environment variable
     */
    PATH?: string;

    /**
     * When given a relative path, use this path to join it.
     */
    cwd?: string;
  }

  /**
   * Find the path to an executable, similar to typing which in your terminal. Reads the `PATH` environment variable unless overridden with `options.PATH`.
   *
   * @category Utilities
   *
   * @param command The name of the executable or script to find
   * @param options Options for the search
   */
  function which(command: string, options?: WhichOptions): string | null;

  interface StringWidthOptions {
    /**
     * If `true`, count ANSI escape codes as part of the string width. If `false`, ANSI escape codes are ignored when calculating the string width.
     *
     * @default false
     */
    countAnsiEscapeCodes?: boolean;

    /**
     * When it's ambiugous and `true`, count emoji as 1 characters wide. If `false`, emoji are counted as 2 character wide.
     *
     * @default true
     */
    ambiguousIsNarrow?: boolean;
  }

  /**
   * Get the column count of a string as it would be displayed in a terminal.
   * Supports ANSI escape codes, emoji, and wide characters.
   *
   * This is useful for:
   * - Aligning text in a terminal
   * - Quickly checking if a string contains ANSI escape codes
   * - Measuring the width of a string in a terminal
   *
   * This API is designed to match the popular "string-width" package, so that
   * existing code can be easily ported to Bun and vice versa.
   *
   * @returns The width of the string in columns
   *
   * @example
   * ```ts
   * import { stringWidth } from "bun";
   *
   * console.log(stringWidth("abc")); // 3
   * console.log(stringWidth("👩‍👩‍👧‍👦")); // 1
   * console.log(stringWidth("\u001b[31mhello\u001b[39m")); // 5
   * console.log(stringWidth("\u001b[31mhello\u001b[39m", { countAnsiEscapeCodes: false })); // 5
   * console.log(stringWidth("\u001b[31mhello\u001b[39m", { countAnsiEscapeCodes: true })); // 13
   * ```
   */
  function stringWidth(
    /**
     * The string to measure
     */
    input: string,
    options?: StringWidthOptions,
  ): number;

  /**
   * TOML related APIs
   */
  namespace TOML {
    /**
     * Parse a TOML string into a JavaScript object.
     *
     * @category Utilities
     *
     * @param input The TOML string to parse
     * @returns A JavaScript object
     */
    export function parse(input: string): object;
  }

  /**
   * Synchronously resolve a `moduleId` as though it were imported from `parent`
   *
   * On failure, throws a `ResolveMessage`
   */
  function resolveSync(moduleId: string, parent: string): string;

  /**
   * Resolve a `moduleId` as though it were imported from `parent`
   *
   * On failure, throws a `ResolveMessage`
   *
   * For now, use the sync version. There is zero performance benefit to using this async version. It exists for future-proofing.
   */
  function resolve(moduleId: string, parent: string): Promise<string>;

  /**
   * Use the fastest syscalls available to copy from `input` into `destination`.
   *
   * If `destination` exists, it must be a regular file or symlink to a file. If `destination`'s directory does not exist, it will be created by default.
   *
   * @category File System
   *
   * @param destination The file or file path to write to
   * @param input The data to copy into `destination`.
   * @param options Options for the write
   *
   * @returns A promise that resolves with the number of bytes written.
   */
  function write(
    destination: BunFile | S3File | PathLike,
    input: Blob | NodeJS.TypedArray | ArrayBufferLike | string | BlobPart[],
    options?: {
      /**
       * If writing to a PathLike, set the permissions of the file.
       */
      mode?: number;
      /**
       * If `true`, create the parent directory if it doesn't exist. By default, this is `true`.
       *
       * If `false`, this will throw an error if the directory doesn't exist.
       *
       * @default true
       */
      createPath?: boolean;
    },
  ): Promise<number>;

  /**
   * Persist a {@link Response} body to disk.
   *
   * @param destination The file to write to. If the file doesn't exist,
   * it will be created and if the file does exist, it will be
   * overwritten. If `input`'s size is less than `destination`'s size,
   * `destination` will be truncated.
   * @param input - `Response` object
   * @param options Options for the write
   *
   * @returns A promise that resolves with the number of bytes written.
   */
  function write(
    destination: BunFile,
    input: Response,
    options?: {
      /**
       * If `true`, create the parent directory if it doesn't exist. By default, this is `true`.
       *
       * If `false`, this will throw an error if the directory doesn't exist.
       *
       * @default true
       */
      createPath?: boolean;
    },
  ): Promise<number>;

  /**
   * Persist a {@link Response} body to disk.
   *
   * @param destinationPath The file path to write to. If the file doesn't
   * exist, it will be created and if the file does exist, it will be
   * overwritten. If `input`'s size is less than `destination`'s size,
   * `destination` will be truncated.
   * @param input - `Response` object
   * @returns A promise that resolves with the number of bytes written.
   */
  function write(
    destinationPath: PathLike,
    input: Response,
    options?: {
      /**
       * If `true`, create the parent directory if it doesn't exist. By default, this is `true`.
       *
       * If `false`, this will throw an error if the directory doesn't exist.
       *
       * @default true
       */
      createPath?: boolean;
    },
  ): Promise<number>;

  /**
   * Use the fastest syscalls available to copy from `input` into `destination`.
   *
   * If `destination` exists, it must be a regular file or symlink to a file.
   *
   * On Linux, this uses `copy_file_range`.
   *
   * On macOS, when the destination doesn't already exist, this uses
   * [`clonefile()`](https://www.manpagez.com/man/2/clonefile/) and falls
   * back to [`fcopyfile()`](https://www.manpagez.com/man/2/fcopyfile/)
   *
   * @param destination The file to write to. If the file doesn't exist,
   * it will be created and if the file does exist, it will be
   * overwritten. If `input`'s size is less than `destination`'s size,
   * `destination` will be truncated.
   * @param input The file to copy from.
   * @returns A promise that resolves with the number of bytes written.
   */

  function write(
    destination: BunFile,
    input: BunFile,
    options?: {
      /**
       * If `true`, create the parent directory if it doesn't exist. By default, this is `true`.
       *
       * If `false`, this will throw an error if the directory doesn't exist.
       *
       * @default true
       */
      createPath?: boolean;
    },
  ): Promise<number>;

  /**
   * Use the fastest syscalls available to copy from `input` into `destination`.
   *
   * If `destination` exists, it must be a regular file or symlink to a file.
   *
   * On Linux, this uses `copy_file_range`.
   *
   * On macOS, when the destination doesn't already exist, this uses
   * [`clonefile()`](https://www.manpagez.com/man/2/clonefile/) and falls
   * back to [`fcopyfile()`](https://www.manpagez.com/man/2/fcopyfile/)
   *
   * @param destinationPath The file path to write to. If the file doesn't
   * exist, it will be created and if the file does exist, it will be
   * overwritten. If `input`'s size is less than `destination`'s size,
   * `destination` will be truncated.
   * @param input The file to copy from.
   * @returns A promise that resolves with the number of bytes written.
   */
  function write(
    destinationPath: PathLike,
    input: BunFile,
    options?: {
      /**
       * If `true`, create the parent directory if it doesn't exist. By default, this is `true`.
       *
       * If `false`, this will throw an error if the directory doesn't exist.
       *
       * @default true
       */
      createPath?: boolean;
    },
  ): Promise<number>;

  interface SystemError extends Error {
    errno?: number | undefined;
    code?: string | undefined;
    path?: string | undefined;
    syscall?: string | undefined;
  }

  /**
   * Concatenate an array of typed arrays into a single `ArrayBuffer`. This is a fast path.
   *
   * You can do this manually if you'd like, but this function will generally
   * be a little faster.
   *
   * If you want a `Uint8Array` instead, consider `Buffer.concat`.
   *
   * @param buffers An array of typed arrays to concatenate.
   * @returns An `ArrayBuffer` with the data from all the buffers.
   *
   * Here is similar code to do it manually, except about 30% slower:
   * ```js
   *   var chunks = [...];
   *   var size = 0;
   *   for (const chunk of chunks) {
   *     size += chunk.byteLength;
   *   }
   *   var buffer = new ArrayBuffer(size);
   *   var view = new Uint8Array(buffer);
   *   var offset = 0;
   *   for (const chunk of chunks) {
   *     view.set(chunk, offset);
   *     offset += chunk.byteLength;
   *   }
   *   return buffer;
   * ```
   *
   * This function is faster because it uses uninitialized memory when copying. Since the entire
   * length of the buffer is known, it is safe to use uninitialized memory.
   */
  function concatArrayBuffers(buffers: Array<ArrayBufferView | ArrayBufferLike>, maxLength?: number): ArrayBuffer;
  function concatArrayBuffers(
    buffers: Array<ArrayBufferView | ArrayBufferLike>,
    maxLength: number,
    asUint8Array: false,
  ): ArrayBuffer;
  function concatArrayBuffers(
    buffers: Array<ArrayBufferView | ArrayBufferLike>,
    maxLength: number,
    asUint8Array: true,
  ): Uint8Array;

  /**
   * Consume all data from a {@link ReadableStream} until it closes or errors.
   *
   * Concatenate the chunks into a single {@link ArrayBuffer}.
   *
   * Each chunk must be a TypedArray or an ArrayBuffer. If you need to support
   * chunks of different types, consider {@link readableStreamToBlob}
   *
   * @param stream The stream to consume.
   * @returns A promise that resolves with the concatenated chunks or the concatenated chunks as an `ArrayBuffer`.
   */
  function readableStreamToArrayBuffer(
    stream: ReadableStream<ArrayBufferView | ArrayBufferLike>,
  ): Promise<ArrayBuffer> | ArrayBuffer;

  /**
   * Consume all data from a {@link ReadableStream} until it closes or errors.
   *
   * Concatenate the chunks into a single {@link ArrayBuffer}.
   *
   * Each chunk must be a TypedArray or an ArrayBuffer. If you need to support
   * chunks of different types, consider {@link readableStreamToBlob}
   *
   * @param stream The stream to consume.
   * @returns A promise that resolves with the concatenated chunks or the concatenated chunks as a {@link Uint8Array}.
   */
  function readableStreamToBytes(
    stream: ReadableStream<ArrayBufferView | ArrayBufferLike>,
  ): Promise<Uint8Array> | Uint8Array;

  /**
   * Consume all data from a {@link ReadableStream} until it closes or errors.
   *
   * Concatenate the chunks into a single {@link Blob}.
   *
   * @param stream The stream to consume.
   * @returns A promise that resolves with the concatenated chunks as a {@link Blob}.
   */
  function readableStreamToBlob(stream: ReadableStream): Promise<Blob>;

  /**
   * Consume all data from a {@link ReadableStream} until it closes or errors.
   *
   * Reads the multi-part or URL-encoded form data into a {@link FormData} object
   *
   * @param stream The stream to consume.
   * @param multipartBoundaryExcludingDashes Optional boundary to use for multipart form data. If none is provided, assumes it is a URLEncoded form.
   * @returns A promise that resolves with the data encoded into a {@link FormData} object.
   *
   * @example
   * **Multipart form data example**
   * ```ts
   * // without dashes
   * const boundary = "WebKitFormBoundary" + Math.random().toString(16).slice(2);
   *
   * const myStream = getStreamFromSomewhere() // ...
   * const formData = await Bun.readableStreamToFormData(stream, boundary);
   * formData.get("foo"); // "bar"
   * ```
   *
   * **URL-encoded form data example**
   * ```ts
   * const stream = new Response("hello=123").body;
   * const formData = await Bun.readableStreamToFormData(stream);
   * formData.get("hello"); // "123"
   * ```
   */
  function readableStreamToFormData(
    stream: ReadableStream<string | NodeJS.TypedArray | ArrayBufferView>,
    multipartBoundaryExcludingDashes?: string | NodeJS.TypedArray | ArrayBufferView,
  ): Promise<FormData>;

  /**
   * Consume all data from a {@link ReadableStream} until it closes or errors.
   *
   * Concatenate the chunks into a single string. Chunks must be a TypedArray or an ArrayBuffer. If you need to support chunks of different types, consider {@link readableStreamToBlob}.
   *
   * @param stream The stream to consume.
   * @returns A promise that resolves with the concatenated chunks as a {@link String}.
   */
  function readableStreamToText(stream: ReadableStream): Promise<string>;

  /**
   * Consume all data from a {@link ReadableStream} until it closes or errors.
   *
   * Concatenate the chunks into a single string and parse as JSON. Chunks must be a TypedArray or an ArrayBuffer. If you need to support chunks of different types, consider {@link readableStreamToBlob}.
   *
   * @param stream The stream to consume.
   * @returns A promise that resolves with the concatenated chunks as a {@link String}.
   */
  function readableStreamToJSON(stream: ReadableStream): Promise<any>;

  /**
   * Consume all data from a {@link ReadableStream} until it closes or errors.
   *
   * @param stream The stream to consume
   * @returns A promise that resolves with the chunks as an array
   */
  function readableStreamToArray<T>(stream: ReadableStream<T>): Promise<T[]> | T[];

  /**
   * Escape the following characters in a string:
   *
   * @category Security
   *
   * - `"` becomes `"&quot;"`
   * - `&` becomes `"&amp;"`
   * - `'` becomes `"&#x27;"`
   * - `<` becomes `"&lt;"`
   * - `>` becomes `"&gt;"`
   *
   * This function is optimized for large input. On an M1X, it processes 480 MB/s -
   * 20 GB/s, depending on how much data is being escaped and whether there is non-ascii
   * text.
   *
   * Non-string types will be converted to a string before escaping.
   */
  function escapeHTML(input: string | object | number | boolean): string;

  /**
   * Convert a filesystem path to a file:// URL.
   *
   * @param path The path to convert.
   * @returns A {@link URL} with the file:// scheme.
   *
   * @category File System
   *
   * @example
   * ```js
   * const url = Bun.pathToFileURL("/foo/bar.txt");
   * console.log(url.href); // "file:///foo/bar.txt"
   * ```
   *
   * Internally, this function uses WebKit's URL API to
   * convert the path to a file:// URL.
   */
  function pathToFileURL(path: string): URL;

  /**
   * Extract the value from the Promise in the same tick of the event loop
   */
  function peek<T = undefined>(promise: T | Promise<T>): Promise<T> | T;
  namespace peek {
    function status<T = undefined>(promise: T | Promise<T>): "pending" | "fulfilled" | "rejected";
  }

  /**
   * Convert a {@link URL} to a filesystem path.
   *
   * @param url The URL to convert.
   * @returns A filesystem path.
   * @throws If the URL is not a URL.
   *
   * @category File System
   *
   * @example
   * ```js
   * const path = Bun.fileURLToPath(new URL("file:///foo/bar.txt"));
   * console.log(path); // "/foo/bar.txt"
   * ```
   */
  function fileURLToPath(url: URL | string): string;

  /**
   * Fast incremental writer that becomes an {@link ArrayBuffer} on end().
   */
  class ArrayBufferSink {
    start(options?: {
      asUint8Array?: boolean;
      /**
       * Preallocate an internal buffer of this size
       * This can significantly improve performance when the chunk size is small
       */
      highWaterMark?: number;
      /**
       * On {@link ArrayBufferSink.flush}, return the written data as a `Uint8Array`.
       * Writes will restart from the beginning of the buffer.
       */
      stream?: boolean;
    }): void;

    write(chunk: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer): number;
    /**
     * Flush the internal buffer
     *
     * If {@link ArrayBufferSink.start} was passed a `stream` option, this will return a `ArrayBuffer`
     * If {@link ArrayBufferSink.start} was passed a `stream` option and `asUint8Array`, this will return a `Uint8Array`
     * Otherwise, this will return the number of bytes written since the last flush
     *
     * This API might change later to separate Uint8ArraySink and ArrayBufferSink
     */
    flush(): number | Uint8Array | ArrayBuffer;
    end(): ArrayBuffer | Uint8Array;
  }

  /** DNS Related APIs */
  namespace dns {
    /**
     * Lookup the IP address for a hostname
     *
     * Uses non-blocking APIs by default
     *
     * @param hostname The hostname to lookup
     * @param options Options for the lookup
     *
     * @example
     * ## Basic usage
     * ```js
     * const [{ address }] = await Bun.dns.lookup('example.com');
     * ```
     *
     * ## Filter results to IPv4
     * ```js
     * import { dns } from 'bun';
     * const [{ address }] = await dns.lookup('example.com', {family: 4});
     * console.log(address); // "123.122.22.126"
     * ```
     *
     * ## Filter results to IPv6
     * ```js
     * import { dns } from 'bun';
     * const [{ address }] = await dns.lookup('example.com', {family: 6});
     * console.log(address); // "2001:db8::1"
     * ```
     *
     * ## DNS resolver client
     *
     * Bun supports three DNS resolvers:
     * - `c-ares` - Uses the c-ares library to perform DNS resolution. This is the default on Linux.
     * - `system` - Uses the system's non-blocking DNS resolver API if available, falls back to `getaddrinfo`. This is the default on macOS and the same as `getaddrinfo` on Linux.
     * - `getaddrinfo` - Uses the posix standard `getaddrinfo` function. Will cause performance issues under concurrent loads.
     *
     * To customize the DNS resolver, pass a `backend` option to `dns.lookup`:
     * ```js
     * import { dns } from 'bun';
     * const [{ address }] = await dns.lookup('example.com', {backend: 'getaddrinfo'});
     * console.log(address); // "19.42.52.62"
     * ```
     */
    function lookup(
      hostname: string,
      options?: {
        /**
         * Limit results to either IPv4, IPv6, or both
         */
        family?: 4 | 6 | 0 | "IPv4" | "IPv6" | "any";
        /**
         * Limit results to either UDP or TCP
         */
        socketType?: "udp" | "tcp";
        flags?: number;
        port?: number;

        /**
         * The DNS resolver implementation to use
         *
         * Defaults to `"c-ares"` on Linux and `"system"` on macOS. This default
         * may change in a future version of Bun if c-ares is not reliable
         * enough.
         *
         * On macOS, `system` uses the builtin macOS [non-blocking DNS
         * resolution
         * API](https://opensource.apple.com/source/Libinfo/Libinfo-222.1/lookup.subproj/netdb_async.h.auto.html).
         *
         * On Linux, `system` is the same as `getaddrinfo`.
         *
         * `c-ares` is more performant on Linux in some high concurrency
         * situations, but it lacks support support for mDNS (`*.local`,
         * `*.localhost` domains) along with some other advanced features. If
         * you run into issues using `c-ares`, you should try `system`. If the
         * hostname ends with `.local` or `.localhost`, Bun will automatically
         * use `system` instead of `c-ares`.
         *
         * [`getaddrinfo`](https://man7.org/linux/man-pages/man3/getaddrinfo.3.html)
         * is the POSIX standard function for blocking DNS resolution. Bun runs
         * it in Bun's thread pool, which is limited to `cpus / 2`. That means
         * if you run a lot of concurrent DNS lookups, concurrent IO will
         * potentially pause until the DNS lookups are done.
         *
         * On macOS, it shouldn't be necessary to use "`getaddrinfo`" because
         * `"system"` uses the same API underneath (except non-blocking).
         *
         * On Windows, libuv's non-blocking DNS resolver is used by default, and
         * when specifying backends "system", "libc", or "getaddrinfo". The c-ares
         * backend isn't currently supported on Windows.
         */
        backend?: "libc" | "c-ares" | "system" | "getaddrinfo";
      },
    ): Promise<DNSLookup[]>;

    /**
     *
     * **Experimental API**
     *
     * Prefetch a hostname.
     *
     * This will be used by fetch() and Bun.connect() to avoid DNS lookups.
     *
     * @param hostname The hostname to prefetch
     * @param port The port to prefetch. Default is 443. Port helps distinguish between IPv6 vs IPv4-only connections.
     *
     * @example
     * ```js
     * import { dns } from 'bun';
     * dns.prefetch('example.com');
     * // ... something expensive
     * await fetch('https://example.com');
     * ```
     */
    function prefetch(hostname: string, port?: number): void;

    /**
     * **Experimental API**
     */
    function getCacheStats(): {
      /**
       * The number of times a cached DNS entry that was already resolved was used.
       */
      cacheHitsCompleted: number;
      cacheHitsInflight: number;
      cacheMisses: number;
      size: number;
      errors: number;
      totalCount: number;
    };

    const ADDRCONFIG: number;
    const ALL: number;
    const V4MAPPED: number;
  }

  interface DNSLookup {
    /**
     * The IP address of the host as a string in IPv4 or IPv6 format.
     *
     * @example "127.0.0.1"
     * @example "192.168.0.1"
     * @example "2001:4860:4860::8888"
     */
    address: string;
    family: 4 | 6;

    /**
     * Time to live in seconds
     *
     * Only supported when using the `c-ares` DNS resolver via "backend" option
     * to {@link dns.lookup}. Otherwise, it's 0.
     */
    ttl: number;
  }

  interface FileBlob extends BunFile {}
  /**
   * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) powered by the fastest system calls available for operating on files.
   *
   * This Blob is lazy. That means it won't do any work until you read from it.
   *
   * - `size` will not be valid until the contents of the file are read at least once.
   * - `type` is auto-set based on the file extension when possible
   *
   * @category File System
   *
   * @example
   * ```js
   * const file = Bun.file("./hello.json");
   * console.log(file.type); // "application/json"
   * console.log(await file.text()); // '{"hello":"world"}'
   * ```
   *
   * @example
   * ```js
   * await Bun.write(
   *   Bun.file("./hello.txt"),
   *   "Hello, world!"
   * );
   * ```
   */
  interface BunFile extends Blob {
    /**
     * Offset any operation on the file starting at `begin` and ending at `end`. `end` is relative to 0
     *
     * Similar to [`TypedArray.subarray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray). Does not copy the file, open the file, or modify the file.
     *
     * If `begin` > 0, {@link Bun.write()} will be slower on macOS
     *
     * @param begin - start offset in bytes
     * @param end - absolute offset in bytes (relative to 0)
     * @param contentType - MIME type for the new BunFile
     */
    slice(begin?: number, end?: number, contentType?: string): BunFile;

    /**
     * Offset any operation on the file starting at `begin`
     *
     * Similar to [`TypedArray.subarray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray). Does not copy the file, open the file, or modify the file.
     *
     * If `begin` > 0, {@link Bun.write}() will be slower on macOS
     *
     * @param begin - start offset in bytes
     * @param contentType - MIME type for the new BunFile
     */
    slice(begin?: number, contentType?: string): BunFile;

    /**
     * Slice the file from the beginning to the end, optionally with a new MIME type.
     *
     * @param contentType - MIME type for the new BunFile
     */
    slice(contentType?: string): BunFile;

    /**
     * Incremental writer for files and pipes.
     */
    writer(options?: { highWaterMark?: number }): FileSink;

    readonly readable: BunReadableStream;

    // TODO: writable: WritableStream;

    /**
     * A UNIX timestamp indicating when the file was last modified.
     */
    lastModified: number;
    /**
     * The name or path of the file, as specified in the constructor.
     */
    readonly name?: string;

    /**
     * Does the file exist?
     *
     * This returns true for regular files and FIFOs. It returns false for
     * directories. Note that a race condition can occur where the file is
     * deleted or renamed after this is called but before you open it.
     *
     * This does a system call to check if the file exists, which can be
     * slow.
     *
     * If using this in an HTTP server, it's faster to instead use `return new
     * Response(Bun.file(path))` and then an `error` handler to handle
     * exceptions.
     *
     * Instead of checking for a file's existence and then performing the
     * operation, it is faster to just perform the operation and handle the
     * error.
     *
     * For empty Blob, this always returns true.
     */
    exists(): Promise<boolean>;

    /**
     * Write data to the file. This is equivalent to using {@link Bun.write} with a {@link BunFile}.
     * @param data - The data to write.
     * @param options - The options to use for the write.
     */
    write(
      data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer | Request | Response | BunFile,
      options?: { highWaterMark?: number },
    ): Promise<number>;

    /**
     * Deletes the file.
     */
    unlink(): Promise<void>;

    /**
     * Deletes the file (same as unlink)
     */
    delete(): Promise<void>;

    /**
     *  Provides useful information about the file.
     */
    stat(): Promise<import("node:fs").Stats>;
  }

  /**
   * Configuration options for SQL client connection and behavior
   *  @example
   * const config: SQLOptions = {
   *   host: 'localhost',
   *   port: 5432,
   *   user: 'dbuser',
   *   password: 'secretpass',
   *   database: 'myapp',
   *   idleTimeout: 30,
   *   max: 20,
   *   onconnect: (client) => {
   *     console.log('Connected to database');
   *   }
   * };
   */

  interface SQLOptions {
    /** Connection URL (can be string or URL object) */
    url?: URL | string;
    /** Database server hostname */
    host?: string;
    /** Database server hostname (alias for host) */
    hostname?: string;
    /** Database server port number */
    port?: number | string;
    /** Database user for authentication */
    username?: string;
    /** Database user for authentication (alias for username) */
    user?: string;
    /** Database password for authentication */
    password?: string | (() => Promise<string>);
    /** Database password for authentication (alias for password) */
    pass?: string | (() => Promise<string>);
    /** Name of the database to connect to */
    database?: string;
    /** Name of the database to connect to (alias for database) */
    db?: string;
    /** Database adapter/driver to use */
    adapter?: string;
    /** Maximum time in seconds to wait for connection to become available */
    idleTimeout?: number;
    /** Maximum time in seconds to wait for connection to become available (alias for idleTimeout) */
    idle_timeout?: number;
    /** Maximum time in seconds to wait when establishing a connection */
    connectionTimeout?: number;
    /** Maximum time in seconds to wait when establishing a connection (alias for connectionTimeout) */
    connection_timeout?: number;
    /** Maximum lifetime in seconds of a connection */
    maxLifetime?: number;
    /** Maximum lifetime in seconds of a connection (alias for maxLifetime) */
    max_lifetime?: number;
    /** Whether to use TLS/SSL for the connection */
    tls?: TLSOptions | boolean;
    /** Whether to use TLS/SSL for the connection (alias for tls) */
    ssl?: TLSOptions | boolean;
    /** Callback function executed when a connection is established */
    onconnect?: (client: SQL) => void;
    /** Callback function executed when a connection is closed */
    onclose?: (client: SQL) => void;
    /** Maximum number of connections in the pool */
    max?: number;
    /** By default values outside i32 range are returned as strings. If this is true, values outside i32 range are returned as BigInts. */
    bigint?: boolean;
    /** Automatic creation of prepared statements, defaults to true */
    prepare?: boolean;
  }

  /**
   * Represents a SQL query that can be executed, with additional control methods
   * Extends Promise to allow for async/await usage
   */
  interface SQLQuery<T = any> extends Promise<T> {
    /** Indicates if the query is currently executing */
    active: boolean;

    /** Indicates if the query has been cancelled */
    cancelled: boolean;

    /** Cancels the executing query */
    cancel(): SQLQuery<T>;

    /** Execute as a simple query, no parameters are allowed but can execute multiple commands separated by semicolons */
    simple(): SQLQuery<T>;

    /** Executes the query */
    execute(): SQLQuery<T>;

    /** Returns the raw query result */
    raw(): SQLQuery<T>;

    /** Returns only the values from the query result */
    values(): SQLQuery<T>;
  }

  /**
   * Callback function type for transaction contexts
   * @param sql Function to execute SQL queries within the transaction
   */
  type SQLTransactionContextCallback = (sql: TransactionSQL) => Promise<any> | Array<SQLQuery>;
  /**
   * Callback function type for savepoint contexts
   * @param sql Function to execute SQL queries within the savepoint
   */
  type SQLSavepointContextCallback = (sql: SavepointSQL) => Promise<any> | Array<SQLQuery>;

  /**
   * Main SQL client interface providing connection and transaction management
   */
  interface SQL {
    /**
     * Executes a SQL query using template literals
     * @example
     * ```ts
     * const [user] = await sql`select * from users where id = ${1}`;
     * ```
     */
    (strings: string[] | TemplateStringsArray, ...values: any[]): SQLQuery;

    /**
     * Helper function for inserting an object into a query
     *
     * @example
     * ```ts
     * // Insert an object
     * const result = await sql`insert into users ${sql(users)} RETURNING *`;
     *
     * // Or pick specific columns
     * const result = await sql`insert into users ${sql(users, "id", "name")} RETURNING *`;
     *
     * // Or a single object
     * const result = await sql`insert into users ${sql(user)} RETURNING *`;
     * ```
     */
    <T extends { [Key in PropertyKey]: unknown }>(obj: T | T[] | readonly T[], ...columns: (keyof T)[]): SQLQuery;

    /**
     * Helper function for inserting any serializable value into a query
     *
     * @example
     * ```ts
     * const result = await sql`SELECT * FROM users WHERE id IN ${sql([1, 2, 3])}`;
     * ```
     */
    (obj: unknown): SQLQuery;

    /**
     * Commits a distributed transaction also know as prepared transaction in postgres or XA transaction in MySQL
     *
     * @param name - The name of the distributed transaction
     *
     * @example
     * ```ts
     * await sql.commitDistributed("my_distributed_transaction");
     * ```
     */
    commitDistributed(name: string): Promise<void>;

    /**
     * Rolls back a distributed transaction also know as prepared transaction in postgres or XA transaction in MySQL
     *
     * @param name - The name of the distributed transaction
     *
     * @example
     * ```ts
     * await sql.rollbackDistributed("my_distributed_transaction");
     * ```
     */
    rollbackDistributed(name: string): Promise<void>;

    /** Waits for the database connection to be established
     *
     * @example
     * ```ts
     * await sql.connect();
     * ```
     */
    connect(): Promise<SQL>;

    /**
     * Closes the database connection with optional timeout in seconds. If timeout is 0, it will close immediately, if is not provided it will wait for all queries to finish before closing.
     *
     * @param options - The options for the close
     *
     * @example
     * ```ts
     * await sql.close({ timeout: 1 });
     * ```
     */
    close(options?: { timeout?: number }): Promise<void>;

    /**
     * Closes the database connection with optional timeout in seconds. If timeout is 0, it will close immediately, if is not provided it will wait for all queries to finish before closing.
     * This is an alias of {@link SQL.close}
     *
     * @param options - The options for the close
     *
     * @example
     * ```ts
     * await sql.end({ timeout: 1 });
     * ```
     */
    end(options?: { timeout?: number }): Promise<void>;

    /**
     * Flushes any pending operations
     *
     * @example
     * ```ts
     * sql.flush();
     * ```
     */
    flush(): void;

    /**
     * The reserve method pulls out a connection from the pool, and returns a client that wraps the single connection.
     * This can be used for running queries on an isolated connection.
     * Calling reserve in a reserved Sql will return a new reserved connection,  not the same connection (behavior matches postgres package).
     *
     * @example
     * ```ts
     * const reserved = await sql.reserve();
     * await reserved`select * from users`;
     * await reserved.release();
     * // with in a production scenario would be something more like
     * const reserved = await sql.reserve();
     * try {
     *   // ... queries
     * } finally {
     *   await reserved.release();
     * }
     *
     * // Bun supports Symbol.dispose and Symbol.asyncDispose
     * {
     *  // always release after context (safer)
     *  using reserved = await sql.reserve()
     *  await reserved`select * from users`
     * }
     * ```
     */
    reserve(): Promise<ReservedSQL>;
    /** Begins a new transaction
     * Will reserve a connection for the transaction and supply a scoped sql instance for all transaction uses in the callback function. sql.begin will resolve with the returned value from the callback function.
     * BEGIN is automatically sent with the optional options, and if anything fails ROLLBACK will be called so the connection can be released and execution can continue.
     * @example
     * const [user, account] = await sql.begin(async sql => {
     *   const [user] = await sql`
     *     insert into users (
     *       name
     *     ) values (
     *       'Murray'
     *     )
     *     returning *
     *   `
     *   const [account] = await sql`
     *     insert into accounts (
     *       user_id
     *     ) values (
     *       ${ user.user_id }
     *     )
     *     returning *
     *   `
     *   return [user, account]
     * })
     */
    begin(fn: SQLTransactionContextCallback): Promise<any>;
    /** Begins a new transaction with options
     * Will reserve a connection for the transaction and supply a scoped sql instance for all transaction uses in the callback function. sql.begin will resolve with the returned value from the callback function.
     * BEGIN is automatically sent with the optional options, and if anything fails ROLLBACK will be called so the connection can be released and execution can continue.
     * @example
     * const [user, account] = await sql.begin("read write", async sql => {
     *   const [user] = await sql`
     *     insert into users (
     *       name
     *     ) values (
     *       'Murray'
     *     )
     *     returning *
     *   `
     *   const [account] = await sql`
     *     insert into accounts (
     *       user_id
     *     ) values (
     *       ${ user.user_id }
     *     )
     *     returning *
     *   `
     *   return [user, account]
     * })
     */
    begin(options: string, fn: SQLTransactionContextCallback): Promise<any>;
    /** Alternative method to begin a transaction
     * Will reserve a connection for the transaction and supply a scoped sql instance for all transaction uses in the callback function. sql.transaction will resolve with the returned value from the callback function.
     * BEGIN is automatically sent with the optional options, and if anything fails ROLLBACK will be called so the connection can be released and execution can continue.
     * @alias begin
     * @example
     * const [user, account] = await sql.transaction(async sql => {
     *   const [user] = await sql`
     *     insert into users (
     *       name
     *     ) values (
     *       'Murray'
     *     )
     *     returning *
     *   `
     *   const [account] = await sql`
     *     insert into accounts (
     *       user_id
     *     ) values (
     *       ${ user.user_id }
     *     )
     *     returning *
     *   `
     *   return [user, account]
     * })
     */
    transaction(fn: SQLTransactionContextCallback): Promise<any>;
    /** Alternative method to begin a transaction with options
     * Will reserve a connection for the transaction and supply a scoped sql instance for all transaction uses in the callback function. sql.transaction will resolve with the returned value from the callback function.
     * BEGIN is automatically sent with the optional options, and if anything fails ROLLBACK will be called so the connection can be released and execution can continue.
     * @alias begin
     * @example
     * const [user, account] = await sql.transaction("read write", async sql => {
     *   const [user] = await sql`
     *     insert into users (
     *       name
     *     ) values (
     *       'Murray'
     *     )
     *     returning *
     *   `
     *   const [account] = await sql`
     *     insert into accounts (
     *       user_id
     *     ) values (
     *       ${ user.user_id }
     *     )
     *     returning *
     *   `
     *   return [user, account]
     * })
     */
    transaction(options: string, fn: SQLTransactionContextCallback): Promise<any>;
    /** Begins a distributed transaction
     * Also know as Two-Phase Commit, in a distributed transaction, Phase 1 involves the coordinator preparing nodes by ensuring data is written and ready to commit, while Phase 2 finalizes with nodes committing or rolling back based on the coordinator's decision, ensuring durability and releasing locks.
     * In PostgreSQL and MySQL distributed transactions persist beyond the original session, allowing privileged users or coordinators to commit/rollback them, ensuring support for distributed transactions, recovery, and administrative tasks.
     * beginDistributed will automatic rollback if any exception are not caught, and you can commit and rollback later if everything goes well.
     * PostgreSQL natively supports distributed transactions using PREPARE TRANSACTION, while MySQL uses XA Transactions, and MSSQL also supports distributed/XA transactions. However, in MSSQL, distributed transactions are tied to the original session, the DTC coordinator, and the specific connection.
     * These transactions are automatically committed or rolled back following the same rules as regular transactions, with no option for manual intervention from other sessions, in MSSQL distributed transactions are used to coordinate transactions using Linked Servers.
     * @example
     * await sql.beginDistributed("numbers", async sql => {
     *   await sql`create table if not exists numbers (a int)`;
     *   await sql`insert into numbers values(1)`;
     * });
     * // later you can call
     * await sql.commitDistributed("numbers");
     * // or await sql.rollbackDistributed("numbers");
     */
    beginDistributed(name: string, fn: SQLTransactionContextCallback): Promise<any>;
    /** Alternative method to begin a distributed transaction
     * @alias beginDistributed
     */
    distributed(name: string, fn: SQLTransactionContextCallback): Promise<any>;
    /**If you know what you're doing, you can use unsafe to pass any string you'd like.
     * Please note that this can lead to SQL injection if you're not careful.
     * You can also nest sql.unsafe within a safe sql expression. This is useful if only part of your fraction has unsafe elements.
     * @example
     * const result = await sql.unsafe(`select ${danger} from users where id = ${dragons}`)
     */
    unsafe(string: string, values?: any[]): SQLQuery;
    /**
     * Reads a file and uses the contents as a query.
     * Optional parameters can be used if the file includes $1, $2, etc
     * @example
     * const result = await sql.file("query.sql", [1, 2, 3]);
     */
    file(filename: string, values?: any[]): SQLQuery;

    /** Current client options */
    options: SQLOptions;

    [Symbol.asyncDispose](): Promise<any>;
  }
  const SQL: {
    /**
     * Creates a new SQL client instance
     *
     * @param connectionString - The connection string for the SQL client
     *
     * @example
     * ```ts
     * const sql = new SQL("postgres://localhost:5432/mydb");
     * const sql = new SQL(new URL("postgres://localhost:5432/mydb"));
     * ```
     */
    new (connectionString: string | URL): SQL;

    /**
     * Creates a new SQL client instance with options
     *
     * @param connectionString - The connection string for the SQL client
     * @param options - The options for the SQL client
     *
     * @example
     * ```ts
     * const sql = new SQL("postgres://localhost:5432/mydb", { idleTimeout: 1000 });
     * ```
     */
    new (connectionString: string | URL, options: Omit<SQLOptions, "url">): SQL;

    /**
     * Creates a new SQL client instance with options
     *
     * @param options - The options for the SQL client
     *
     * @example
     * ```ts
     * const sql = new SQL({ url: "postgres://localhost:5432/mydb", idleTimeout: 1000 });
     * ```
     */
    new (options?: SQLOptions): SQL;
  };

  /**
   * Represents a reserved connection from the connection pool
   * Extends SQL with additional release functionality
   */
  interface ReservedSQL extends SQL {
    /** Releases the client back to the connection pool */
    release(): void;
    [Symbol.dispose](): void;
  }

  /**
   * Represents a client within a transaction context
   * Extends SQL with savepoint functionality
   */
  interface TransactionSQL extends SQL {
    /** Creates a savepoint within the current transaction */
    savepoint(name: string, fn: SQLSavepointContextCallback): Promise<any>;
    savepoint(fn: SQLSavepointContextCallback): Promise<any>;
  }
  /**
   * Represents a savepoint within a transaction
   */
  interface SavepointSQL extends SQL {}

  type CSRFAlgorithm = "blake2b256" | "blake2b512" | "sha256" | "sha384" | "sha512" | "sha512-256";
  interface CSRFGenerateOptions {
    /**
     * The number of milliseconds until the token expires. 0 means the token never expires.
     * @default 24 * 60 * 60 * 1000 (24 hours)
     */
    expiresIn?: number;
    /**
     * The encoding of the token.
     * @default "base64url"
     */
    encoding?: "base64" | "base64url" | "hex";
    /**
     * The algorithm to use for the token.
     * @default "sha256"
     */
    algorithm?: CSRFAlgorithm;
  }

  interface CSRFVerifyOptions {
    /**
     * The secret to use for the token. If not provided, a random default secret will be generated in memory and used.
     */
    secret?: string;
    /**
     * The encoding of the token.
     * @default "base64url"
     */
    encoding?: "base64" | "base64url" | "hex";
    /**
     * The algorithm to use for the token.
     * @default "sha256"
     */
    algorithm?: CSRFAlgorithm;
    /**
     * The number of milliseconds until the token expires. 0 means the token never expires.
     * @default 24 * 60 * 60 * 1000 (24 hours)
     */
    maxAge?: number;
  }

  /**
   * SQL client
   *
   * @category Database
   */
  const sql: SQL;

  /**
   * SQL client for PostgreSQL
   *
   * @category Database
   */
  const postgres: SQL;

  /**
   * Generate and verify CSRF tokens
   *
   * @category Security
   */
  namespace CSRF {
    /**
     * Generate a CSRF token.
     * @param secret The secret to use for the token. If not provided, a random default secret will be generated in memory and used.
     * @param options The options for the token.
     * @returns The generated token.
     */
    function generate(secret?: string, options?: CSRFGenerateOptions): string;

    /**
     * Verify a CSRF token.
     * @param token The token to verify.
     * @param options The options for the token.
     * @returns True if the token is valid, false otherwise.
     */
    function verify(token: string, options?: CSRFVerifyOptions): boolean;
  }

  /**
   *   This lets you use macros as regular imports
   *   @example
   *   ```
   *   {
   *     "react-relay": {
   *       "graphql": "bun-macro-relay/bun-macro-relay.tsx"
   *     }
   *   }
   *  ```
   */
  type MacroMap = Record<string, Record<string, string>>;

  /**
   * Hash a string or array buffer using Wyhash
   *
   * This is not a cryptographic hash function.
   * @param data The data to hash.
   * @param seed The seed to use.
   */
  const hash: ((
    data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer,
    seed?: number | bigint,
  ) => number | bigint) &
    Hash;

  interface Hash {
    wyhash: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: bigint) => bigint;
    adler32: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer) => number;
    crc32: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer) => number;
    cityHash32: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer) => number;
    cityHash64: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: bigint) => bigint;
    xxHash32: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: number) => number;
    xxHash64: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: bigint) => bigint;
    xxHash3: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: bigint) => bigint;
    murmur32v3: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: number) => number;
    murmur32v2: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: number) => number;
    murmur64v2: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: bigint) => bigint;
    rapidhash: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: bigint) => bigint;
  }

  type JavaScriptLoader = "jsx" | "js" | "ts" | "tsx";

  /**
   * Fast deep-equality check two objects.
   *
   * This also powers expect().toEqual in `bun:test`
   */
  function deepEquals(
    a: any,
    b: any,
    /** @default false */
    strict?: boolean,
  ): boolean;

  /**
   * Returns true if all properties in the subset exist in the
   * other and have equal values.
   *
   * This also powers expect().toMatchObject in `bun:test`
   */
  function deepMatch(subset: unknown, a: unknown): boolean;

  /**
   * tsconfig.json options supported by Bun
   */
  interface TSConfig {
    extends?: string;
    compilerOptions?: {
      paths?: Record<string, string[]>;
      baseUrl?: string;
      /** "preserve" is not supported yet */
      jsx?: "preserve" | "react" | "react-jsx" | "react-jsxdev";
      jsxFactory?: string;
      jsxFragmentFactory?: string;
      jsxImportSource?: string;
      useDefineForClassFields?: boolean;
      importsNotUsedAsValues?: "remove" | "preserve" | "error";
      /** moduleSuffixes is not supported yet */
      moduleSuffixes?: any;
    };
  }

  interface TranspilerOptions {
    /**
     * Replace key with value. Value must be a JSON string.
     * @example
     *  ```
     *  { "process.env.NODE_ENV": "\"production\"" }
     * ```
     */
    define?: Record<string, string>;

    /** What is the default loader used for this transpiler?  */
    loader?: JavaScriptLoader;

    /**  What platform are we targeting? This may affect how import and/or require is used */
    /**  @example "browser" */
    target?: Target;

    /**
     *  TSConfig.json file as stringified JSON or an object
     *  Use this to set a custom JSX factory, fragment, or import source
     *  For example, if you want to use Preact instead of React. Or if you want to use Emotion.
     */
    tsconfig?: string | TSConfig;

    /**
     *    Replace an import statement with a macro.
     *
     *    This will remove the import statement from the final output
     *    and replace any function calls or template strings with the result returned by the macro
     *
     *    @example
     *    ```json
     *    {
     *        "react-relay": {
     *            "graphql": "bun-macro-relay"
     *        }
     *    }
     *    ```
     *
     *    Code that calls `graphql` will be replaced with the result of the macro.
     *
     *    ```js
     *    import {graphql} from "react-relay";
     *
     *    // Input:
     *    const query = graphql`
     *        query {
     *            ... on User {
     *                id
     *            }
     *        }
     *    }`;
     *    ```
     *
     *    Will be replaced with:
     *
     *    ```js
     *    import UserQuery from "./UserQuery.graphql";
     *    const query = UserQuery;
     *    ```
     */
    macro?: MacroMap;

    autoImportJSX?: boolean;
    allowBunRuntime?: boolean;
    exports?: {
      eliminate?: string[];
      replace?: Record<string, string>;
    };
    treeShaking?: boolean;
    trimUnusedImports?: boolean;
    jsxOptimizationInline?: boolean;

    /**
     * **Experimental**
     *
     * Minify whitespace and comments from the output.
     */
    minifyWhitespace?: boolean;
    /**
     * **Experimental**
     *
     * Enabled by default, use this to disable dead code elimination.
     *
     * Some other transpiler options may still do some specific dead code elimination.
     */
    deadCodeElimination?: boolean;

    /**
     * This does two things (and possibly more in the future):
     * 1. `const` declarations to primitive types (excluding Object/Array) at the top of a scope before any `let` or `var` declarations will be inlined into their usages.
     * 2. `let` and `const` declarations only used once are inlined into their usages.
     *
     * JavaScript engines typically do these optimizations internally, however
     * it might only happen much later in the compilation pipeline, after code
     * has been executed many many times.
     *
     * This will typically shrink the output size of code, but it might increase
     * it in some cases. Do your own benchmarks!
     */
    inline?: boolean;

    /**
     * @default "warn"
     */
    logLevel?: "verbose" | "debug" | "info" | "warn" | "error";
  }

  /**
   * Quickly transpile TypeScript, JSX, or JS to modern JavaScript.
   *
   * @example
   * ```js
   * const transpiler = new Bun.Transpiler();
   * transpiler.transformSync(`
   *   const App = () => <div>Hello World</div>;
   * export default App;
   * `);
   * // This outputs:
   * const output = `
   * const App = () => jsx("div", {
   *   children: "Hello World"
   * }, undefined, false, undefined, this);
   * export default App;
   * `
   * ```
   */

  class Transpiler {
    constructor(options?: TranspilerOptions);

    /**
     * Transpile code from TypeScript or JSX into valid JavaScript.
     * This function does not resolve imports.
     * @param code The code to transpile
     */
    transform(code: Bun.StringOrBuffer, loader?: JavaScriptLoader): Promise<string>;
    /**
     * Transpile code from TypeScript or JSX into valid JavaScript.
     * This function does not resolve imports.
     * @param code The code to transpile
     */
    transformSync(code: Bun.StringOrBuffer, loader: JavaScriptLoader, ctx: object): string;
    /**
     * Transpile code from TypeScript or JSX into valid JavaScript.
     * This function does not resolve imports.
     * @param code The code to transpile
     * @param ctx An object to pass to macros
     */
    transformSync(code: Bun.StringOrBuffer, ctx: object): string;

    /**
     * Transpile code from TypeScript or JSX into valid JavaScript.
     * This function does not resolve imports.
     * @param code The code to transpile
     */
    transformSync(code: Bun.StringOrBuffer, loader?: JavaScriptLoader): string;

    /**
     * Get a list of import paths and paths from a TypeScript, JSX, TSX, or JavaScript file.
     * @param code The code to scan
     * @example
     * ```js
     * const {imports, exports} = transpiler.scan(`
     * import {foo} from "baz";
     * export const hello = "hi!";
     * `);
     *
     * console.log(imports); // ["baz"]
     * console.log(exports); // ["hello"]
     * ```
     */
    scan(code: Bun.StringOrBuffer): { exports: string[]; imports: Import[] };

    /**
     *  Get a list of import paths from a TypeScript, JSX, TSX, or JavaScript file.
     * @param code The code to scan
     * @example
     * ```js
     * const imports = transpiler.scanImports(`
     * import {foo} from "baz";
     * import type {FooType} from "bar";
     * import type {DogeType} from "wolf";
     * `);
     *
     * console.log(imports); // ["baz"]
     * ```
     * This is a fast path which performs less work than `scan`.
     */
    scanImports(code: Bun.StringOrBuffer): Import[];
  }

  type ImportKind =
    | "import-statement"
    | "require-call"
    | "require-resolve"
    | "dynamic-import"
    | "import-rule"
    | "url-token"
    | "internal"
    | "entry-point-run"
    | "entry-point-build";

  interface Import {
    path: string;
    kind: ImportKind;
  }

  /**
   * @see [Bun.build API docs](https://bun.sh/docs/bundler#api)
   */
  interface BuildConfig {
    entrypoints: string[]; // list of file path
    outdir?: string; // output directory
    /**
     * @default "browser"
     */
    target?: Target; // default: "browser"
    /**
     * Output module format. Top-level await is only supported for `"esm"`.
     *
     * Can be:
     * - `"esm"`
     * - `"cjs"` (**experimental**)
     * - `"iife"` (**experimental**)
     *
     * @default "esm"
     */
    format?: /**

     * ECMAScript Module format
     */
    | "esm"
      /**
       * CommonJS format
       * **Experimental**
       */
      | "cjs"
      /**
       * IIFE format
       * **Experimental**
       */
      | "iife";
    naming?:
      | string
      | {
          chunk?: string;
          entry?: string;
          asset?: string;
        }; // | string;
    root?: string; // project root
    splitting?: boolean; // default true, enable code splitting
    plugins?: BunPlugin[];
    // manifest?: boolean; // whether to return manifest
    external?: string[];
    packages?: "bundle" | "external";
    publicPath?: string;
    define?: Record<string, string>;
    // origin?: string; // e.g. http://mydomain.com
    loader?: { [k in string]: Loader };
    /**
     * Specifies if and how to generate source maps.
     *
     * - `"none"` - No source maps are generated
     * - `"linked"` - A separate `*.ext.map` file is generated alongside each
     *   `*.ext` file. A `//# sourceMappingURL` comment is added to the output
     *   file to link the two. Requires `outdir` to be set.
     * - `"inline"` - an inline source map is appended to the output file.
     * - `"external"` - Generate a separate source map file for each input file.
     *   No `//# sourceMappingURL` comment is added to the output file.
     *
     * `true` and `false` are aliases for `"inline"` and `"none"`, respectively.
     *
     * @default "none"
     *
     * @see {@link outdir} required for `"linked"` maps
     * @see {@link publicPath} to customize the base url of linked source maps
     */
    sourcemap?: "none" | "linked" | "inline" | "external" | "linked" | boolean;

    /**
     * package.json `exports` conditions used when resolving imports
     *
     * Equivalent to `--conditions` in `bun build` or `bun run`.
     *
     * https://nodejs.org/api/packages.html#exports
     */
    conditions?: Array<string> | string;

    /**
     * Controls how environment variables are handled during bundling.
     *
     * Can be one of:
     * - `"inline"`: Injects environment variables into the bundled output by converting `process.env.FOO`
     *   references to string literals containing the actual environment variable values
     * - `"disable"`: Disables environment variable injection entirely
     * - A string ending in `*`: Inlines environment variables that match the given prefix.
     *   For example, `"MY_PUBLIC_*"` will only include env vars starting with "MY_PUBLIC_"
     *
     * @example
     * ```ts
     * Bun.build({
     *   env: "MY_PUBLIC_*",
     *   entrypoints: ["src/index.ts"],
     * })
     * ```
     */
    env?: "inline" | "disable" | `${string}*`;

    /**
     * Whether to enable minification.
     *
     * Use `true`/`false` to enable/disable all minification options. Alternatively,
     * you can pass an object for granular control over certain minifications.
     *
     * @default false
     */
    minify?:
      | boolean
      | {
          whitespace?: boolean;
          syntax?: boolean;
          identifiers?: boolean;
        };

    /**
     * Ignore dead code elimination/tree-shaking annotations such as @__PURE__ and package.json
     * "sideEffects" fields. This should only be used as a temporary workaround for incorrect
     * annotations in libraries.
     */
    ignoreDCEAnnotations?: boolean;

    /**
     * Force emitting @__PURE__ annotations even if minify.whitespace is true.
     */
    emitDCEAnnotations?: boolean;

    // treeshaking?: boolean;

    // jsx?:
    //   | "automatic"
    //   | "classic"
    //   | /* later: "preserve" */ {
    //       runtime?: "automatic" | "classic"; // later: "preserve"
    //       /** Only works when runtime=classic */
    //       factory?: string; // default: "React.createElement"
    //       /** Only works when runtime=classic */
    //       fragment?: string; // default: "React.Fragment"
    //       /** Only works when runtime=automatic */
    //       importSource?: string; // default: "react"
    //     };

    /**
     * Generate bytecode for the output. This can dramatically improve cold
     * start times, but will make the final output larger and slightly increase
     * memory usage.
     *
     * Bytecode is currently only supported for CommonJS (`format: "cjs"`).
     *
     * Must be `target: "bun"`
     * @default false
     */
    bytecode?: boolean;

    /**
     * Add a banner to the bundled code such as "use client";
     */
    banner?: string;

    /**
     * Add a footer to the bundled code such as a comment block like
     *
     * `// made with bun!`
     */
    footer?: string;

    /**
     * Drop function calls to matching property accesses.
     */
    drop?: string[];

    /**
     * When set to `true`, the returned promise rejects with an AggregateError when a build failure happens.
     * When set to `false`, the `success` property of the returned object will be `false` when a build failure happens.
     * This defaults to `true`.
     */
    throw?: boolean;
  }

  /**
   * Hash and verify passwords using argon2 or bcrypt
   *
   * These are fast APIs that can run in a worker thread if used asynchronously.
   *
   * @see [Bun.password API docs](https://bun.sh/guides/util/hash-a-password)
   *
   * @category Security
   */
  namespace Password {
    interface Argon2Algorithm {
      algorithm: "argon2id" | "argon2d" | "argon2i";

      /**
       * Memory cost, which defines the memory usage, given in kibibytes.
       */
      memoryCost?: number;
      /**
       * Defines the amount of computation realized and therefore the execution
       * time, given in number of iterations.
       */
      timeCost?: number;
    }

    interface BCryptAlgorithm {
      algorithm: "bcrypt";

      /**
       * A number between 4 and 31. The default is 10.
       */
      cost?: number;
    }

    type AlgorithmLabel = (BCryptAlgorithm | Argon2Algorithm)["algorithm"];
  }

  /**
   * Hash and verify passwords using argon2 or bcrypt. The default is argon2.
   * Password hashing functions are necessarily slow, and this object will
   * automatically run in a worker thread.
   *
   * @see [Bun.password API docs](https://bun.sh/guides/util/hash-a-password)
   *
   * The underlying implementation of these functions are provided by the Zig
   * Standard Library. Thanks to \@jedisct1 and other Zig contributors for their
   * work on this.
   *
   * @example
   * **Example with argon2**
   * ```ts
   * import {password} from "bun";
   *
   * const hash = await password.hash("hello world");
   * const verify = await password.verify("hello world", hash);
   * console.log(verify); // true
   * ```
   *
   * **Example with bcrypt**
   * ```ts
   * import {password} from "bun";
   *
   * const hash = await password.hash("hello world", "bcrypt");
   * // algorithm is optional, will be inferred from the hash if not specified
   * const verify = await password.verify("hello world", hash, "bcrypt");
   *
   * console.log(verify); // true
   * ```
   *
   * @category Security
   */
  const password: {
    /**
     * Verify a password against a previously hashed password.
     *
     * @returns true if the password matches, false otherwise
     *
     * @example
     * ```ts
     * import {password} from "bun";
     * await password.verify("hey", "$argon2id$v=19$m=65536,t=2,p=1$ddbcyBcbAcagei7wSkZFiouX6TqnUQHmTyS5mxGCzeM$+3OIaFatZ3n6LtMhUlfWbgJyNp7h8/oIsLK+LzZO+WI");
     * // true
     * ```
     *
     * @throws If the algorithm is specified and does not match the hash
     * @throws If the algorithm is invalid
     * @throws if the hash is invalid
     */
    verify(
      /**
       * The password to verify.
       *
       * If empty, always returns false
       */
      password: Bun.StringOrBuffer,
      /**
       * Previously hashed password.
       * If empty, always returns false
       */
      hash: Bun.StringOrBuffer,
      /**
       * If not specified, the algorithm will be inferred from the hash.
       *
       * If specified and the algorithm does not match the hash, this function
       * throws an error.
       */
      algorithm?: Password.AlgorithmLabel,
    ): Promise<boolean>;
    /**
     * Asynchronously hash a password using argon2 or bcrypt. The default is argon2.
     *
     * @returns A promise that resolves to the hashed password
     *
     * @example
     * **Example with argon2**
     * ```ts
     * import {password} from "bun";
     * const hash = await password.hash("hello world");
     * console.log(hash); // $argon2id$v=1...
     * const verify = await password.verify("hello world", hash);
     * ```
     *
     * **Example with bcrypt**
     * ```ts
     * import {password} from "bun";
     * const hash = await password.hash("hello world", "bcrypt");
     * console.log(hash); // $2b$10$...
     * const verify = await password.verify("hello world", hash);
     * ```
     */
    hash(
      /**
       * The password to hash
       *
       * If empty, this function throws an error. It is usually a programming
       * mistake to hash an empty password.
       */
      password: Bun.StringOrBuffer,
      /**
       * When using bcrypt, passwords exceeding 72 characters will be SHA512'd before
       *
       * @default "argon2id"
       */
      algorithm?: Password.AlgorithmLabel | Password.Argon2Algorithm | Password.BCryptAlgorithm,
    ): Promise<string>;

    /**
     * Synchronously hash and verify passwords using argon2 or bcrypt. The default is argon2.
     * Warning: password hashing is slow, consider using {@link Bun.password.verify}
     * instead which runs in a worker thread.
     *
     * The underlying implementation of these functions are provided by the Zig
     * Standard Library. Thanks to \@jedisct1 and other Zig contributors for their
     * work on this.
     *
     * @example
     * **Example with argon2**
     * ```ts
     * import {password} from "bun";
     *
     * const hash = await password.hashSync("hello world");
     * const verify = await password.verifySync("hello world", hash);
     * console.log(verify); // true
     * ```
     *
     * **Example with bcrypt**
     * ```ts
     * import {password} from "bun";
     *
     * const hash = await password.hashSync("hello world", "bcrypt");
     * // algorithm is optional, will be inferred from the hash if not specified
     * const verify = await password.verifySync("hello world", hash, "bcrypt");
     *
     * console.log(verify); // true
     * ```
     */
    verifySync(
      /**
       * The password to verify.
       */
      password: Bun.StringOrBuffer,
      /**
       * The hash to verify against.
       */
      hash: Bun.StringOrBuffer,
      /**
       * If not specified, the algorithm will be inferred from the hash.
       */
      algorithm?: Password.AlgorithmLabel,
    ): boolean;

    /**
     * Synchronously hash and verify passwords using argon2 or bcrypt. The default is argon2.
     * Warning: password hashing is slow, consider using {@link Bun.password.hash}
     * instead which runs in a worker thread.
     *
     * The underlying implementation of these functions are provided by the Zig
     * Standard Library. Thanks to \@jedisct1 and other Zig contributors for their
     * work on this.
     *
     * @example
     * **Example with argon2**
     * ```ts
     * import {password} from "bun";
     *
     * const hash = await password.hashSync("hello world");
     * const verify = await password.verifySync("hello world", hash);
     * console.log(verify); // true
     * ```
     *
     * **Example with bcrypt**
     * ```ts
     * import {password} from "bun";
     *
     * const hash = await password.hashSync("hello world", "bcrypt");
     * // algorithm is optional, will be inferred from the hash if not specified
     * const verify = await password.verifySync("hello world", hash, "bcrypt");
     *
     * console.log(verify); // true
     * ```
     */
    hashSync(
      /**
       * The password to hash
       *
       * If empty, this function throws an error. It is usually a programming
       * mistake to hash an empty password.
       */
      password: Bun.StringOrBuffer,

      /**
       * When using bcrypt, passwords exceeding 72 characters will be SHA256'd before
       *
       * @default "argon2id"
       */
      algorithm?: Password.AlgorithmLabel | Password.Argon2Algorithm | Password.BCryptAlgorithm,
    ): string;
  };

  /**
   * A build artifact represents a file that was generated by the bundler @see {@link Bun.build}
   *
   * @category Bundler
   */
  interface BuildArtifact extends Blob {
    path: string;
    loader: Loader;
    hash: string | null;
    kind: "entry-point" | "chunk" | "asset" | "sourcemap" | "bytecode";
    sourcemap: BuildArtifact | null;
  }

  /**
   * The output of a build
   *
   * @category Bundler
   */
  interface BuildOutput {
    outputs: BuildArtifact[];
    success: boolean;
    logs: Array<BuildMessage | ResolveMessage>;
  }

  /**
   * Bundles JavaScript, TypeScript, CSS, HTML and other supported files into optimized outputs.
   *
   * @param config - Build configuration options
   * @returns Promise that resolves to build output containing generated artifacts and build status
   * @throws {AggregateError} When build fails and config.throw is true (default in Bun 1.2+)
   *
   * @category Bundler
   *
   * @example
   * Basic usage - Bundle a single entrypoint and check results
   *```ts
   * const result = await Bun.build({
   *   entrypoints: ['./src/index.tsx'],
   *   outdir: './dist'
   * });
   *
   * if (!result.success) {
   *   console.error('Build failed:', result.logs);
   *   process.exit(1);
   * }
   *```
   *
   * @example
   * Set up multiple entrypoints with code splitting enabled
   *```ts
   * await Bun.build({
   *   entrypoints: ['./src/app.tsx', './src/admin.tsx'],
   *   outdir: './dist',
   *   splitting: true,
   *   sourcemap: "external"
   * });
   *```
   *
   * @example
   * Configure minification and optimization settings
   *```ts
   * await Bun.build({
   *   entrypoints: ['./src/index.tsx'],
   *   outdir: './dist',
   *   minify: {
   *     whitespace: true,
   *     identifiers: true,
   *     syntax: true
   *   },
   *   drop: ['console', 'debugger']
   * });
   *```
   *
   * @example
   * Set up custom loaders and mark packages as external
   *```ts
   * await Bun.build({
   *   entrypoints: ['./src/index.tsx'],
   *   outdir: './dist',
   *   loader: {
   *     '.png': 'dataurl',
   *     '.svg': 'file',
   *     '.txt': 'text',
   *     '.json': 'json'
   *   },
   *   external: ['react', 'react-dom']
   * });
   *```
   *
   * @example
   * Configure environment variable handling with different modes
   *```ts
   * // Inline all environment variables
   * await Bun.build({
   *   entrypoints: ['./src/index.tsx'],
   *   outdir: './dist',
   *   env: 'inline'
   * });
   *
   * // Only include specific env vars
   * await Bun.build({
   *   entrypoints: ['./src/index.tsx'],
   *   outdir: './dist',
   *   env: 'PUBLIC_*'
   * });
   *```
   *
   * @example
   * Set up custom naming patterns for all output types
   *```ts
   * await Bun.build({
   *   entrypoints: ['./src/index.tsx'],
   *   outdir: './dist',
   *   naming: {
   *     entry: '[dir]/[name]-[hash].[ext]',
   *     chunk: 'chunks/[name]-[hash].[ext]',
   *     asset: 'assets/[name]-[hash].[ext]'
   *   }
   * });
   *```
   *
   * @example
   * Work with build artifacts in different formats
   *```ts
   * const result = await Bun.build({
   *   entrypoints: ['./src/index.tsx']
   * });
   * for (const artifact of result.outputs) {
   *   const text = await artifact.text();
   *   const buffer = await artifact.arrayBuffer();
   *   const bytes = await artifact.bytes();
   *   new Response(artifact);
   *   await Bun.write(artifact.path, artifact);
   * }
   *```
   *
   * @example
   * Implement comprehensive error handling with position info
   *```ts
   * try {
   *   const result = await Bun.build({
   *     entrypoints: ['./src/index.tsx'],
   *   });
   * } catch (e) {
   *   const error = e as AggregateError;
   *   console.error('Build failed:');
   *   for (const msg of error.errors) {
   *     if ('position' in msg) {
   *       console.error(
   *         `${msg.message} at ${msg.position?.file}:${msg.position?.line}:${msg.position?.column}`
   *       );
   *     } else {
   *       console.error(msg.message);
   *     }
   *   }
   * }
   *```
   *
   * @example
   * Set up Node.js target with specific configurations
   *```ts
   * await Bun.build({
   *   entrypoints: ['./src/server.ts'],
   *   outdir: './dist',
   *   target: 'node',
   *   format: 'cjs',
   *   sourcemap: 'external',
   *   minify: false,
   *   packages: 'external'
   * });
   *```
   *
   * @example
   * Configure experimental CSS bundling with multiple themes
   *```ts
   * await Bun.build({
   *   entrypoints: [
   *     './src/styles.css',
   *     './src/themes/dark.css',
   *     './src/themes/light.css'
   *   ],
   *   outdir: './dist/css',
   * });
   *```
   *
   * @example
   * Define compile-time constants and version information
   *```ts
   * await Bun.build({
   *   entrypoints: ['./src/index.tsx'],
   *   outdir: './dist',
   *   define: {
   *     'process.env.NODE_ENV': JSON.stringify('production'),
   *     'CONSTANTS.VERSION': JSON.stringify('1.0.0'),
   *     'CONSTANTS.BUILD_TIME': JSON.stringify(new Date().toISOString())
   *   }
   * });
   *```
   *
   * @example
   * Create a custom plugin for handling special file types
   *```ts
   * await Bun.build({
   *   entrypoints: ['./src/index.tsx'],
   *   outdir: './dist',
   *   plugins: [
   *     {
   *       name: 'my-plugin',
   *       setup(build) {
   *         build.onLoad({ filter: /\.custom$/ }, async (args) => {
   *           const content = await Bun.file(args.path).text();
   *           return {
   *             contents: `export default ${JSON.stringify(content)}`,
   *             loader: 'js'
   *           };
   *         });
   *       }
   *     }
   *   ]
   * });
   *```
   *
   * @example
   * Enable bytecode generation for faster startup
   *```ts
   * await Bun.build({
   *   entrypoints: ['./src/server.ts'],
   *   outdir: './dist',
   *   target: 'bun',
   *   format: 'cjs',
   *   bytecode: true
   * });
   *```
   *
   * @example
   * Add custom banner and footer to output files
   *```ts
   * await Bun.build({
   *   entrypoints: ['./src/index.tsx'],
   *   outdir: './dist',
   *   banner: '"use client";\n// Built with Bun',
   *   footer: '// Generated on ' + new Date().toISOString()
   * });
   *```
   *
   * @example
   * Configure CDN public path for asset loading
   *```ts
   * await Bun.build({
   *   entrypoints: ['./src/index.tsx'],
   *   outdir: './dist',
   *   publicPath: 'https://cdn.example.com/assets/',
   *   loader: {
   *     '.png': 'file',
   *     '.svg': 'file'
   *   }
   * });
   *```
   *
   * @example
   * Set up package export conditions for different environments
   *```ts
   * await Bun.build({
   *   entrypoints: ['./src/index.tsx'],
   *   outdir: './dist',
   *   conditions: ['production', 'browser', 'module'],
   *   packages: 'external'
   * });
   *```
   */
  function build(config: BuildConfig): Promise<BuildOutput>;

  /**
   * A status that represents the outcome of a sent message.
   *
   * - if **0**, the message was **dropped**.
   * - if **-1**, there is **backpressure** of messages.
   * - if **>0**, it represents the **number of bytes sent**.
   *
   * @example
   * ```js
   * const status = ws.send("Hello!");
   * if (status === 0) {
   *   console.log("Message was dropped");
   * } else if (status === -1) {
   *   console.log("Backpressure was applied");
   * } else {
   *   console.log(`Success! Sent ${status} bytes`);
   * }
   * ```
   */
  type ServerWebSocketSendStatus = number;

  /**
   * A state that represents if a WebSocket is connected.
   *
   * - `WebSocket.CONNECTING` is `0`, the connection is pending.
   * - `WebSocket.OPEN` is `1`, the connection is established and `send()` is possible.
   * - `WebSocket.CLOSING` is `2`, the connection is closing.
   * - `WebSocket.CLOSED` is `3`, the connection is closed or couldn't be opened.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
   */
  type WebSocketReadyState = 0 | 1 | 2 | 3;

  /**
   * A fast WebSocket designed for servers.
   *
   * Features:
   * - **Message compression** - Messages can be compressed
   * - **Backpressure** - If the client is not ready to receive data, the server will tell you.
   * - **Dropped messages** - If the client cannot receive data, the server will tell you.
   * - **Topics** - Messages can be {@link ServerWebSocket.publish}ed to a specific topic and the client can {@link ServerWebSocket.subscribe} to topics
   *
   * This is slightly different than the browser {@link WebSocket} which Bun supports for clients.
   *
   * Powered by [uWebSockets](https://github.com/uNetworking/uWebSockets).
   *
   * @example
   * ```ts
   * Bun.serve({
   *   websocket: {
   *     open(ws) {
   *       console.log("Connected", ws.remoteAddress);
   *     },
   *     message(ws, data) {
   *       console.log("Received", data);
   *       ws.send(data);
   *     },
   *     close(ws, code, reason) {
   *       console.log("Disconnected", code, reason);
   *     },
   *   }
   * });
   * ```
   *
   * @category HTTP & Networking
   */
  interface ServerWebSocket<T = undefined> {
    /**
     * Sends a message to the client.
     *
     * @param data The data to send.
     * @param compress Should the data be compressed? If the client does not support compression, this is ignored.
     * @example
     * ws.send("Hello!");
     * ws.send("Compress this.", true);
     * ws.send(new Uint8Array([1, 2, 3, 4]));
     */
    send(data: string | BufferSource, compress?: boolean): ServerWebSocketSendStatus;

    /**
     * Sends a text message to the client.
     *
     * @param data The data to send.
     * @param compress Should the data be compressed? If the client does not support compression, this is ignored.
     * @example
     * ws.send("Hello!");
     * ws.send("Compress this.", true);
     */
    sendText(data: string, compress?: boolean): ServerWebSocketSendStatus;

    /**
     * Sends a binary message to the client.
     *
     * @param data The data to send.
     * @param compress Should the data be compressed? If the client does not support compression, this is ignored.
     * @example
     * ws.send(new TextEncoder().encode("Hello!"));
     * ws.send(new Uint8Array([1, 2, 3, 4]), true);
     */
    sendBinary(data: BufferSource, compress?: boolean): ServerWebSocketSendStatus;

    /**
     * Closes the connection.
     *
     * Here is a list of close codes:
     * - `1000` means "normal closure" **(default)**
     * - `1009` means a message was too big and was rejected
     * - `1011` means the server encountered an error
     * - `1012` means the server is restarting
     * - `1013` means the server is too busy or the client is rate-limited
     * - `4000` through `4999` are reserved for applications (you can use it!)
     *
     * To close the connection abruptly, use `terminate()`.
     *
     * @param code The close code to send
     * @param reason The close reason to send
     */
    close(code?: number, reason?: string): void;

    /**
     * Abruptly close the connection.
     *
     * To gracefully close the connection, use `close()`.
     */
    terminate(): void;

    /**
     * Sends a ping.
     *
     * @param data The data to send
     */
    ping(data?: string | BufferSource): ServerWebSocketSendStatus;

    /**
     * Sends a pong.
     *
     * @param data The data to send
     */
    pong(data?: string | BufferSource): ServerWebSocketSendStatus;

    /**
     * Sends a message to subscribers of the topic.
     *
     * @param topic The topic name.
     * @param data The data to send.
     * @param compress Should the data be compressed? If the client does not support compression, this is ignored.
     * @example
     * ws.publish("chat", "Hello!");
     * ws.publish("chat", "Compress this.", true);
     * ws.publish("chat", new Uint8Array([1, 2, 3, 4]));
     */
    publish(topic: string, data: string | BufferSource, compress?: boolean): ServerWebSocketSendStatus;

    /**
     * Sends a text message to subscribers of the topic.
     *
     * @param topic The topic name.
     * @param data The data to send.
     * @param compress Should the data be compressed? If the client does not support compression, this is ignored.
     * @example
     * ws.publish("chat", "Hello!");
     * ws.publish("chat", "Compress this.", true);
     */
    publishText(topic: string, data: string, compress?: boolean): ServerWebSocketSendStatus;

    /**
     * Sends a binary message to subscribers of the topic.
     *
     * @param topic The topic name.
     * @param data The data to send.
     * @param compress Should the data be compressed? If the client does not support compression, this is ignored.
     * @example
     * ws.publish("chat", new TextEncoder().encode("Hello!"));
     * ws.publish("chat", new Uint8Array([1, 2, 3, 4]), true);
     */
    publishBinary(topic: string, data: BufferSource, compress?: boolean): ServerWebSocketSendStatus;

    /**
     * Subscribes a client to the topic.
     *
     * @param topic The topic name.
     * @example
     * ws.subscribe("chat");
     */
    subscribe(topic: string): void;

    /**
     * Unsubscribes a client to the topic.
     *
     * @param topic The topic name.
     * @example
     * ws.unsubscribe("chat");
     */
    unsubscribe(topic: string): void;

    /**
     * Is the client subscribed to a topic?
     *
     * @param topic The topic name.
     * @example
     * ws.subscribe("chat");
     * console.log(ws.isSubscribed("chat")); // true
     */
    isSubscribed(topic: string): boolean;

    /**
     * Batches `send()` and `publish()` operations, which makes it faster to send data.
     *
     * The `message`, `open`, and `drain` callbacks are automatically corked, so
     * you only need to call this if you are sending messages outside of those
     * callbacks or in async functions.
     *
     * @param callback The callback to run.
     * @example
     * ws.cork((ctx) => {
     *   ctx.send("These messages");
     *   ctx.sendText("are sent");
     *   ctx.sendBinary(new TextEncoder().encode("together!"));
     * });
     */
    cork<T = unknown>(callback: (ws: ServerWebSocket<T>) => T): T;

    /**
     * The IP address of the client.
     *
     * @example
     * console.log(socket.remoteAddress); // "127.0.0.1"
     */
    readonly remoteAddress: string;

    /**
     * The ready state of the client.
     *
     * - if `0`, the client is connecting.
     * - if `1`, the client is connected.
     * - if `2`, the client is closing.
     * - if `3`, the client is closed.
     *
     * @example
     * console.log(socket.readyState); // 1
     */
    readonly readyState: WebSocketReadyState;

    /**
     * Sets how binary data is returned in events.
     *
     * - if `nodebuffer`, binary data is returned as `Buffer` objects. **(default)**
     * - if `arraybuffer`, binary data is returned as `ArrayBuffer` objects.
     * - if `uint8array`, binary data is returned as `Uint8Array` objects.
     *
     * @example
     * let ws: WebSocket;
     * ws.binaryType = "uint8array";
     * ws.addEventListener("message", ({ data }) => {
     *   console.log(data instanceof Uint8Array); // true
     * });
     */
    binaryType?: "nodebuffer" | "arraybuffer" | "uint8array";

    /**
     * Custom data that you can assign to a client, can be read and written at any time.
     *
     * @example
     * import { serve } from "bun";
     *
     * serve({
     *   fetch(request, server) {
     *     const data = {
     *       accessToken: request.headers.get("Authorization"),
     *     };
     *     if (server.upgrade(request, { data })) {
     *       return;
     *     }
     *     return new Response();
     *   },
     *   websocket: {
     *     open(ws) {
     *       console.log(ws.data.accessToken);
     *     }
     *   }
     * });
     */
    data: T;

    getBufferedAmount(): number;
  }

  /**
   * Compression options for WebSocket messages.
   */
  type WebSocketCompressor =
    | "disable"
    | "shared"
    | "dedicated"
    | "3KB"
    | "4KB"
    | "8KB"
    | "16KB"
    | "32KB"
    | "64KB"
    | "128KB"
    | "256KB";

  /**
   * Create a server-side {@link ServerWebSocket} handler for use with {@link Bun.serve}
   *
   * @category HTTP & Networking
   *
   * @example
   * ```ts
   * import { websocket, serve } from "bun";
   *
   * serve<{name: string}>({
   *   port: 3000,
   *   websocket: {
   *     open: (ws) => {
   *       console.log("Client connected");
   *    },
   *     message: (ws, message) => {
   *       console.log(`${ws.data.name}: ${message}`);
   *    },
   *     close: (ws) => {
   *       console.log("Client disconnected");
   *    },
   *  },
   *
   *   fetch(req, server) {
   *     const url = new URL(req.url);
   *     if (url.pathname === "/chat") {
   *       const upgraded = server.upgrade(req, {
   *         data: {
   *           name: new URL(req.url).searchParams.get("name"),
   *        },
   *      });
   *       if (!upgraded) {
   *         return new Response("Upgrade failed", { status: 400 });
   *      }
   *      return;
   *    }
   *     return new Response("Hello World");
   *  },
   * });
   * ```
   */
  interface WebSocketHandler<T = undefined> {
    /**
     * Called when the server receives an incoming message.
     *
     * If the message is not a `string`, its type is based on the value of `binaryType`.
     * - if `nodebuffer`, then the message is a `Buffer`.
     * - if `arraybuffer`, then the message is an `ArrayBuffer`.
     * - if `uint8array`, then the message is a `Uint8Array`.
     *
     * @param ws The websocket that sent the message
     * @param message The message received
     */
    message(ws: ServerWebSocket<T>, message: string | Buffer): void | Promise<void>;

    /**
     * Called when a connection is opened.
     *
     * @param ws The websocket that was opened
     */
    open?(ws: ServerWebSocket<T>): void | Promise<void>;

    /**
     * Called when a connection was previously under backpressure,
     * meaning it had too many queued messages, but is now ready to receive more data.
     *
     * @param ws The websocket that is ready for more data
     */
    drain?(ws: ServerWebSocket<T>): void | Promise<void>;

    /**
     * Called when a connection is closed.
     *
     * @param ws The websocket that was closed
     * @param code The close code
     * @param reason The close reason
     */
    close?(ws: ServerWebSocket<T>, code: number, reason: string): void | Promise<void>;

    /**
     * Called when a ping is sent.
     *
     * @param ws The websocket that received the ping
     * @param data The data sent with the ping
     */
    ping?(ws: ServerWebSocket<T>, data: Buffer): void | Promise<void>;

    /**
     * Called when a pong is received.
     *
     * @param ws The websocket that received the ping
     * @param data The data sent with the ping
     */
    pong?(ws: ServerWebSocket<T>, data: Buffer): void | Promise<void>;

    /**
     * Sets the maximum size of messages in bytes.
     *
     * Default is 16 MB, or `1024 * 1024 * 16` in bytes.
     */
    maxPayloadLength?: number;

    /**
     * Sets the maximum number of bytes that can be buffered on a single connection.
     *
     * Default is 16 MB, or `1024 * 1024 * 16` in bytes.
     */
    backpressureLimit?: number;

    /**
     * Sets if the connection should be closed if `backpressureLimit` is reached.
     *
     * Default is `false`.
     */
    closeOnBackpressureLimit?: boolean;

    /**
     * Sets the the number of seconds to wait before timing out a connection
     * due to no messages or pings.
     *
     * Default is 2 minutes, or `120` in seconds.
     */
    idleTimeout?: number;

    /**
     * Should `ws.publish()` also send a message to `ws` (itself), if it is subscribed?
     *
     * Default is `false`.
     */
    publishToSelf?: boolean;

    /**
     * Should the server automatically send and respond to pings to clients?
     *
     * Default is `true`.
     */
    sendPings?: boolean;

    /**
     * Sets the compression level for messages, for clients that supports it. By default, compression is disabled.
     *
     * Default is `false`.
     */
    perMessageDeflate?:
      | boolean
      | {
          /**
           * Sets the compression level.
           */
          compress?: WebSocketCompressor | boolean;
          /**
           * Sets the decompression level.
           */
          decompress?: WebSocketCompressor | boolean;
        };
  }

  namespace RouterTypes {
    type ExtractRouteParams<T> = T extends `${string}:${infer Param}/${infer Rest}`
      ? { [K in Param]: string } & ExtractRouteParams<Rest>
      : T extends `${string}:${infer Param}`
        ? { [K in Param]: string }
        : T extends `${string}*`
          ? {}
          : {};

    type RouteHandler<T extends string> = (req: BunRequest<T>, server: Server) => Response | Promise<Response>;

    type RouteHandlerWithWebSocketUpgrade<T extends string> = (
      req: BunRequest<T>,
      server: Server,
    ) => Response | undefined | void | Promise<Response | undefined | void>;

    type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

    type RouteHandlerObject<T extends string> = {
      [K in HTTPMethod]?: RouteHandler<T>;
    };

    type RouteHandlerWithWebSocketUpgradeObject<T extends string> = {
      [K in HTTPMethod]?: RouteHandlerWithWebSocketUpgrade<T>;
    };

    type RouteValue<T extends string> = Response | false | RouteHandler<T> | RouteHandlerObject<T> | HTMLBundle;
    type RouteValueWithWebSocketUpgrade<T extends string> =
      | RouteValue<T>
      | RouteHandlerWithWebSocketUpgrade<T>
      | RouteHandlerWithWebSocketUpgradeObject<T>;
  }

  interface BunRequest<T extends string = string> extends Request {
    params: RouterTypes.ExtractRouteParams<T>;
    readonly cookies: CookieMap;

    clone(): BunRequest<T>;
  }

  interface GenericServeOptions {
    /**
     * What URI should be used to make {@link Request.url} absolute?
     *
     * By default, looks at {@link hostname}, {@link port}, and whether or not SSL is enabled to generate one
     *
     * @example
     * ```js
     * "http://my-app.com"
     * ```
     *
     * @example
     * ```js
     * "https://wongmjane.com/"
     * ```
     *
     * This should be the public, absolute URL – include the protocol and {@link hostname}. If the port isn't 80 or 443, then include the {@link port} too.
     *
     * @example
     * "http://localhost:3000"
     */
    // baseURI?: string;

    /**
     * What is the maximum size of a request body? (in bytes)
     * @default 1024 * 1024 * 128 // 128MB
     */
    maxRequestBodySize?: number;

    /**
     * Render contextual errors? This enables bun's error page
     * @default process.env.NODE_ENV !== 'production'
     */
    development?:
      | boolean
      | {
          /**
           * Enable Hot Module Replacement for routes (including React Fast Refresh, if React is in use)
           *
           * @default true if process.env.NODE_ENV !== 'production'
           *
           */
          hmr?: boolean;

          /**
           * Enable console log streaming from browser to server
           * @default false
           */
          console?: boolean;

          /**
           * Enable automatic workspace folders for Chrome DevTools
           *
           * This lets you persistently edit files in the browser. It works by adding the following route to the server:
           * `/.well-known/appspecific/com.chrome.devtools.json`
           *
           * The response is a JSON object with the following shape:
           * ```json
           * {
           *   "workspace": {
           *     "root": "<cwd>",
           *     "uuid": "<uuid>"
           *   }
           * }
           * ```
           *
           * The `root` field is the current working directory of the server.
           * The `"uuid"` field is a hash of the file that started the server and a hash of the current working directory.
           *
           * For security reasons, if the remote socket address is not from localhost, 127.0.0.1, or ::1, the request is ignored.
           * @default true
           */
          chromeDevToolsAutomaticWorkspaceFolders?: boolean;
        };

    error?: (this: Server, error: ErrorLike) => Response | Promise<Response> | void | Promise<void>;

    /**
     * Uniquely identify a server instance with an ID
     *
     * ---
     *
     * **When bun is started with the `--hot` flag**:
     *
     * This string will be used to hot reload the server without interrupting
     * pending requests or websockets. If not provided, a value will be
     * generated. To disable hot reloading, set this value to `null`.
     *
     * **When bun is not started with the `--hot` flag**:
     *
     * This string will currently do nothing. But in the future it could be useful for logs or metrics.
     */
    id?: string | null;
  }

  interface ServeOptions extends GenericServeOptions {
    /**
     * What port should the server listen on?
     * @default process.env.PORT || "3000"
     */
    port?: string | number;

    /**
     * Whether the `SO_REUSEPORT` flag should be set.
     *
     * This allows multiple processes to bind to the same port, which is useful for load balancing.
     *
     * @default false
     */
    reusePort?: boolean;

    /**
     * Whether the `IPV6_V6ONLY` flag should be set.
     * @default false
     */
    ipv6Only?: boolean;

    /**
     * What hostname should the server listen on?
     *
     * @default
     * ```js
     * "0.0.0.0" // listen on all interfaces
     * ```
     * @example
     *  ```js
     * "127.0.0.1" // Only listen locally
     * ```
     * @example
     * ```js
     * "remix.run" // Only listen on remix.run
     * ````
     *
     * note: hostname should not include a {@link port}
     */
    hostname?: string;

    /**
     * If set, the HTTP server will listen on a unix socket instead of a port.
     * (Cannot be used with hostname+port)
     */
    unix?: never;

    /**
     * Sets the the number of seconds to wait before timing out a connection
     * due to inactivity.
     *
     * Default is `10` seconds.
     */
    idleTimeout?: number;

    /**
     * Handle HTTP requests
     *
     * Respond to {@link Request} objects with a {@link Response} object.
     */
    fetch(this: Server, request: Request, server: Server): Response | Promise<Response>;
  }

  interface UnixServeOptions extends GenericServeOptions {
    /**
     * If set, the HTTP server will listen on a unix socket instead of a port.
     * (Cannot be used with hostname+port)
     */
    unix: string;
    /**
     * Handle HTTP requests
     *
     * Respond to {@link Request} objects with a {@link Response} object.
     */
    fetch(this: Server, request: Request, server: Server): Response | Promise<Response>;
  }

  interface WebSocketServeOptions<WebSocketDataType = undefined> extends GenericServeOptions {
    /**
     * What port should the server listen on?
     * @default process.env.PORT || "3000"
     */
    port?: string | number;

    /**
     * What hostname should the server listen on?
     *
     * @default
     * ```js
     * "0.0.0.0" // listen on all interfaces
     * ```
     * @example
     *  ```js
     * "127.0.0.1" // Only listen locally
     * ```
     * @example
     * ```js
     * "remix.run" // Only listen on remix.run
     * ````
     *
     * note: hostname should not include a {@link port}
     */
    hostname?: string;

    /**
     * Enable websockets with {@link Bun.serve}
     *
     * For simpler type safety, see {@link Bun.websocket}
     *
     * @example
     * ```js
     * Bun.serve({
     *  websocket: {
     *    open: (ws) => {
     *      console.log("Client connected");
     *    },
     *    message: (ws, message) => {
     *      console.log("Client sent message", message);
     *    },
     *    close: (ws) => {
     *      console.log("Client disconnected");
     *    },
     *  },
     *  fetch(req, server) {
     *    const url = new URL(req.url);
     *    if (url.pathname === "/chat") {
     *      const upgraded = server.upgrade(req);
     *      if (!upgraded) {
     *        return new Response("Upgrade failed", { status: 400 });
     *      }
     *    }
     *    return new Response("Hello World");
     *  },
     * });
     * ```
     * Upgrade a {@link Request} to a {@link ServerWebSocket} via {@link Server.upgrade}
     *
     * Pass `data` in @{link Server.upgrade} to attach data to the {@link ServerWebSocket.data} property
     */
    websocket: WebSocketHandler<WebSocketDataType>;

    /**
     * Handle HTTP requests or upgrade them to a {@link ServerWebSocket}
     *
     * Respond to {@link Request} objects with a {@link Response} object.
     */
    fetch(
      this: Server,
      request: Request,
      server: Server,
    ): Response | undefined | void | Promise<Response | undefined | void>;
  }

  interface UnixWebSocketServeOptions<WebSocketDataType = undefined> extends GenericServeOptions {
    /**
     * If set, the HTTP server will listen on a unix socket instead of a port.
     * (Cannot be used with hostname+port)
     */
    unix: string;

    /**
     * Enable websockets with {@link Bun.serve}
     *
     * For simpler type safety, see {@link Bun.websocket}
     *
     * @example
     * ```js
     * import { serve } from "bun";
     * serve({
     *  websocket: {
     *    open: (ws) => {
     *      console.log("Client connected");
     *    },
     *    message: (ws, message) => {
     *      console.log("Client sent message", message);
     *    },
     *    close: (ws) => {
     *      console.log("Client disconnected");
     *    },
     *  },
     *  fetch(req, server) {
     *    const url = new URL(req.url);
     *    if (url.pathname === "/chat") {
     *      const upgraded = server.upgrade(req);
     *      if (!upgraded) {
     *        return new Response("Upgrade failed", { status: 400 });
     *      }
     *    }
     *    return new Response("Hello World");
     *  },
     * });
     * ```
     * Upgrade a {@link Request} to a {@link ServerWebSocket} via {@link Server.upgrade}
     *
     * Pass `data` in @{link Server.upgrade} to attach data to the {@link ServerWebSocket.data} property
     */
    websocket: WebSocketHandler<WebSocketDataType>;

    /**
     * Handle HTTP requests or upgrade them to a {@link ServerWebSocket}
     *
     * Respond to {@link Request} objects with a {@link Response} object.
     */
    fetch(this: Server, request: Request, server: Server): Response | undefined | Promise<Response | undefined>;
  }

  interface TLSWebSocketServeOptions<WebSocketDataType = undefined>
    extends WebSocketServeOptions<WebSocketDataType>,
      TLSOptionsAsDeprecated {
    unix?: never;
    tls?: TLSOptions | TLSOptions[];
  }

  interface UnixTLSWebSocketServeOptions<WebSocketDataType = undefined>
    extends UnixWebSocketServeOptions<WebSocketDataType>,
      TLSOptionsAsDeprecated {
    /**
     * If set, the HTTP server will listen on a unix socket instead of a port.
     * (Cannot be used with hostname+port)
     */
    unix: string;
    tls?: TLSOptions | TLSOptions[];
  }

  interface TLSServeOptions extends ServeOptions, TLSOptionsAsDeprecated {
    tls?: TLSOptions | TLSOptions[];
  }

  interface UnixTLSServeOptions extends UnixServeOptions, TLSOptionsAsDeprecated {
    tls?: TLSOptions | TLSOptions[];
  }

  interface ErrorLike extends Error {
    code?: string;
    errno?: number;
    syscall?: string;
  }

  /**
   * Options for TLS connections
   */
  interface TLSOptions {
    /**
     * Passphrase for the TLS key
     */
    passphrase?: string;

    /**
     * File path to a .pem file custom Diffie Helman parameters
     */
    dhParamsFile?: string;

    /**
     * Explicitly set a server name
     */
    serverName?: string;

    /**
     * This sets `OPENSSL_RELEASE_BUFFERS` to 1.
     * It reduces overall performance but saves some memory.
     * @default false
     */
    lowMemoryMode?: boolean;

    /**
     * If set to `false`, any certificate is accepted.
     * Default is `$NODE_TLS_REJECT_UNAUTHORIZED` environment variable, or `true` if it is not set.
     */
    rejectUnauthorized?: boolean;

    /**
     * If set to `true`, the server will request a client certificate.
     *
     * Default is `false`.
     */
    requestCert?: boolean;

    /**
     * Optionally override the trusted CA certificates. Default is to trust
     * the well-known CAs curated by Mozilla. Mozilla's CAs are completely
     * replaced when CAs are explicitly specified using this option.
     */
    ca?: string | BufferSource | BunFile | Array<string | BufferSource | BunFile> | undefined;
    /**
     *  Cert chains in PEM format. One cert chain should be provided per
     *  private key. Each cert chain should consist of the PEM formatted
     *  certificate for a provided private key, followed by the PEM
     *  formatted intermediate certificates (if any), in order, and not
     *  including the root CA (the root CA must be pre-known to the peer,
     *  see ca). When providing multiple cert chains, they do not have to
     *  be in the same order as their private keys in key. If the
     *  intermediate certificates are not provided, the peer will not be
     *  able to validate the certificate, and the handshake will fail.
     */
    cert?: string | BufferSource | BunFile | Array<string | BufferSource | BunFile> | undefined;
    /**
     * Private keys in PEM format. PEM allows the option of private keys
     * being encrypted. Encrypted keys will be decrypted with
     * options.passphrase. Multiple keys using different algorithms can be
     * provided either as an array of unencrypted key strings or buffers,
     * or an array of objects in the form {pem: <string|buffer>[,
     * passphrase: <string>]}. The object form can only occur in an array.
     * object.passphrase is optional. Encrypted keys will be decrypted with
     * object.passphrase if provided, or options.passphrase if it is not.
     */
    key?: string | BufferSource | BunFile | Array<string | BufferSource | BunFile> | undefined;
    /**
     * Optionally affect the OpenSSL protocol behavior, which is not
     * usually necessary. This should be used carefully if at all! Value is
     * a numeric bitmask of the SSL_OP_* options from OpenSSL Options
     */
    secureOptions?: number | undefined; // Value is a numeric bitmask of the `SSL_OP_*` options

    keyFile?: string;

    certFile?: string;

    ALPNProtocols?: string | BufferSource;

    ciphers?: string;

    clientRenegotiationLimit?: number;

    clientRenegotiationWindow?: number;
  }

  // Note for contributors: TLSOptionsAsDeprecated should be considered immutable
  // and new TLS option keys should only be supported on the `.tls` property (which comes
  // from the TLSOptions interface above).
  /**
   * This exists because Bun.serve() extends the TLSOptions object, but
   * they're now considered deprecated. You should be passing the
   * options on `.tls` instead.
   *
   * @example
   * ```ts
   * //// OLD ////
   * Bun.serve({
   *   fetch: () => new Response("Hello World"),
   *   passphrase: "secret",
   * });
   *
   * //// NEW ////
   * Bun.serve({
   *   fetch: () => new Response("Hello World"),
   *   tls: {
   *     passphrase: "secret",
   *   },
   * });
   * ```
   */
  interface TLSOptionsAsDeprecated {
    /**
     * Passphrase for the TLS key
     *
     * @deprecated Use `.tls.passphrase` instead
     */
    passphrase?: string;

    /**
     * File path to a .pem file custom Diffie Helman parameters
     *
     * @deprecated Use `.tls.dhParamsFile` instead
     */
    dhParamsFile?: string;

    /**
     * Explicitly set a server name
     *
     * @deprecated Use `.tls.serverName` instead
     */
    serverName?: string;

    /**
     * This sets `OPENSSL_RELEASE_BUFFERS` to 1.
     * It reduces overall performance but saves some memory.
     * @default false
     *
     * @deprecated Use `.tls.lowMemoryMode` instead
     */
    lowMemoryMode?: boolean;

    /**
     * If set to `false`, any certificate is accepted.
     * Default is `$NODE_TLS_REJECT_UNAUTHORIZED` environment variable, or `true` if it is not set.
     *
     * @deprecated Use `.tls.rejectUnauthorized` instead
     */
    rejectUnauthorized?: boolean;

    /**
     * If set to `true`, the server will request a client certificate.
     *
     * Default is `false`.
     *
     * @deprecated Use `.tls.requestCert` instead
     */
    requestCert?: boolean;

    /**
     * Optionally override the trusted CA certificates. Default is to trust
     * the well-known CAs curated by Mozilla. Mozilla's CAs are completely
     * replaced when CAs are explicitly specified using this option.
     *
     * @deprecated Use `.tls.ca` instead
     */
    ca?: string | Buffer | BunFile | Array<string | Buffer | BunFile> | undefined;
    /**
     *  Cert chains in PEM format. One cert chain should be provided per
     *  private key. Each cert chain should consist of the PEM formatted
     *  certificate for a provided private key, followed by the PEM
     *  formatted intermediate certificates (if any), in order, and not
     *  including the root CA (the root CA must be pre-known to the peer,
     *  see ca). When providing multiple cert chains, they do not have to
     *  be in the same order as their private keys in key. If the
     *  intermediate certificates are not provided, the peer will not be
     *  able to validate the certificate, and the handshake will fail.
     *
     * @deprecated Use `.tls.cert` instead
     */
    cert?: string | Buffer | BunFile | Array<string | Buffer | BunFile> | undefined;
    /**
     * Private keys in PEM format. PEM allows the option of private keys
     * being encrypted. Encrypted keys will be decrypted with
     * options.passphrase. Multiple keys using different algorithms can be
     * provided either as an array of unencrypted key strings or buffers,
     * or an array of objects in the form {pem: <string|buffer>[,
     * passphrase: <string>]}. The object form can only occur in an array.
     * object.passphrase is optional. Encrypted keys will be decrypted with
     * object.passphrase if provided, or options.passphrase if it is not.
     *
     * @deprecated Use `.tls.key` instead
     */
    key?: string | Buffer | BunFile | Array<string | Buffer | BunFile> | undefined;
    /**
     * Optionally affect the OpenSSL protocol behavior, which is not
     * usually necessary. This should be used carefully if at all! Value is
     * a numeric bitmask of the SSL_OP_* options from OpenSSL Options
     *
     * @deprecated `Use .tls.secureOptions` instead
     */
    secureOptions?: number | undefined; // Value is a numeric bitmask of the `SSL_OP_*` options
  }

  interface SocketAddress {
    /**
     * The IP address of the client.
     */
    address: string;
    /**
     * The port of the client.
     */
    port: number;
    /**
     * The IP family ("IPv4" or "IPv6").
     */
    family: "IPv4" | "IPv6";
  }

  /**
   * HTTP & HTTPS Server
   *
   * To start the server, see {@link serve}
   *
   * For performance, Bun pre-allocates most of the data for 2048 concurrent requests.
   * That means starting a new server allocates about 500 KB of memory. Try to
   * avoid starting and stopping the server often (unless it's a new instance of bun).
   *
   * Powered by a fork of [uWebSockets](https://github.com/uNetworking/uWebSockets). Thank you \@alexhultman.
   *
   * @category HTTP & Networking
   */
  interface Server extends Disposable {
    /**
     * Stop listening to prevent new connections from being accepted.
     *
     * By default, it does not cancel in-flight requests or websockets. That means it may take some time before all network activity stops.
     *
     * @param closeActiveConnections Immediately terminate in-flight requests, websockets, and stop accepting new connections.
     * @default false
     */
    stop(closeActiveConnections?: boolean): Promise<void>;

    /**
     * Update the `fetch` and `error` handlers without restarting the server.
     *
     * This is useful if you want to change the behavior of your server without
     * restarting it or for hot reloading.
     *
     * @example
     *
     * ```js
     * // create the server
     * const server = Bun.serve({
     *  fetch(request) {
     *    return new Response("Hello World v1")
     *  }
     * });
     *
     * // Update the server to return a different response
     * server.reload({
     *   fetch(request) {
     *     return new Response("Hello World v2")
     *   }
     * });
     * ```
     *
     * Passing other options such as `port` or `hostname` won't do anything.
     */
    reload<T, R extends { [K in keyof R]: RouterTypes.RouteValue<K & string> }>(
      options: ServeFunctionOptions<T, R> & {
        /**
         * @deprecated Use `routes` instead in new code. This will continue to work for awhile though.
         */
        static?: R;
      },
    ): Server;

    /**
     * Mock the fetch handler for a running server.
     *
     * This feature is not fully implemented yet. It doesn't normalize URLs
     * consistently in all cases and it doesn't yet call the `error` handler
     * consistently. This needs to be fixed
     */
    fetch(request: Request | string): Response | Promise<Response>;

    /**
     * Upgrade a {@link Request} to a {@link ServerWebSocket}
     *
     * @param request The {@link Request} to upgrade
     * @param options Pass headers or attach data to the {@link ServerWebSocket}
     *
     * @returns `true` if the upgrade was successful and `false` if it failed
     *
     * @example
     * ```js
     * import { serve } from "bun";
     *  serve({
     *    websocket: {
     *      open: (ws) => {
     *        console.log("Client connected");
     *      },
     *      message: (ws, message) => {
     *        console.log("Client sent message", message);
     *      },
     *      close: (ws) => {
     *        console.log("Client disconnected");
     *      },
     *    },
     *    fetch(req, server) {
     *      const url = new URL(req.url);
     *      if (url.pathname === "/chat") {
     *        const upgraded = server.upgrade(req);
     *        if (!upgraded) {
     *          return new Response("Upgrade failed", { status: 400 });
     *        }
     *      }
     *      return new Response("Hello World");
     *    },
     *  });
     * ```
     *  What you pass to `data` is available on the {@link ServerWebSocket.data} property
     */
    // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
    upgrade<T = undefined>(
      request: Request,
      options?: {
        /**
         * Send any additional headers while upgrading, like cookies
         */
        headers?: HeadersInit;
        /**
         * This value is passed to the {@link ServerWebSocket.data} property
         */
        data?: T;
      },
    ): boolean;

    /**
     * Send a message to all connected {@link ServerWebSocket} subscribed to a topic
     *
     * @param topic The topic to publish to
     * @param data The data to send
     * @param compress Should the data be compressed? Ignored if the client does not support compression.
     *
     * @returns 0 if the message was dropped, -1 if backpressure was applied, or the number of bytes sent.
     *
     * @example
     *
     * ```js
     * server.publish("chat", "Hello World");
     * ```
     *
     * @example
     * ```js
     * server.publish("chat", new Uint8Array([1, 2, 3, 4]));
     * ```
     *
     * @example
     * ```js
     * server.publish("chat", new ArrayBuffer(4), true);
     * ```
     *
     * @example
     * ```js
     * server.publish("chat", new DataView(new ArrayBuffer(4)));
     * ```
     */
    publish(
      topic: string,
      data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer,
      compress?: boolean,
    ): ServerWebSocketSendStatus;

    /**
     * A count of connections subscribed to a given topic
     *
     * This operation will loop through each topic internally to get the count.
     *
     * @param topic the websocket topic to check how many subscribers are connected to
     * @returns the number of subscribers
     */
    subscriberCount(topic: string): number;

    /**
     * Returns the client IP address and port of the given Request. If the request was closed or is a unix socket, returns null.
     *
     * @example
     * ```js
     * export default {
     *  async fetch(request, server) {
     *    return new Response(server.requestIP(request));
     *  }
     * }
     * ```
     */
    requestIP(request: Request): SocketAddress | null;

    /**
     * Reset the idleTimeout of the given Request to the number in seconds. 0 means no timeout.
     *
     * @example
     * ```js
     * export default {
     *  async fetch(request, server) {
     *    server.timeout(request, 60);
     *    await Bun.sleep(30000);
     *    return new Response("30 seconds have passed");
     *  }
     * }
     * ```
     */
    timeout(request: Request, seconds: number): void;
    /**
     * Undo a call to {@link Server.unref}
     *
     * If the Server has already been stopped, this does nothing.
     *
     * If {@link Server.ref} is called multiple times, this does nothing. Think of it as a boolean toggle.
     */
    ref(): void;

    /**
     * Don't keep the process alive if this server is the only thing left.
     * Active connections may continue to keep the process alive.
     *
     * By default, the server is ref'd.
     *
     * To prevent new connections from being accepted, use {@link Server.stop}
     */
    unref(): void;

    /**
     * How many requests are in-flight right now?
     */
    readonly pendingRequests: number;

    /**
     * How many {@link ServerWebSocket}s are in-flight right now?
     */
    readonly pendingWebSockets: number;

    readonly url: URL;

    /**
     * The port the server is listening on.
     *
     * This will be undefined when the server is listening on a unix socket.
     *
     * @example
     * ```js
     * 3000
     * ```
     */
    readonly port: number | undefined;

    /**
     * The hostname the server is listening on. Does not include the port.
     *
     * This will be `undefined` when the server is listening on a unix socket.
     *
     * @example
     * ```js
     * "localhost"
     * ```
     */
    readonly hostname: string | undefined;

    /**
     * Is the server running in development mode?
     *
     * In development mode, `Bun.serve()` returns rendered error messages with
     * stack traces instead of a generic 500 error. This makes debugging easier,
     * but development mode shouldn't be used in production or you will risk
     * leaking sensitive information.
     */
    readonly development: boolean;

    /**
     * An identifier of the server instance
     *
     * When bun is started with the `--hot` flag, this ID is used to hot reload the server without interrupting pending requests or websockets.
     *
     * When bun is not started with the `--hot` flag, this ID is currently unused.
     */
    readonly id: string;
  }

  /**
   * The type of options that can be passed to {@link serve}
   */
  type Serve<WebSocketDataType = undefined> =
    | ServeOptions
    | TLSServeOptions
    | UnixServeOptions
    | UnixTLSServeOptions
    | WebSocketServeOptions<WebSocketDataType>
    | TLSWebSocketServeOptions<WebSocketDataType>
    | UnixWebSocketServeOptions<WebSocketDataType>
    | UnixTLSWebSocketServeOptions<WebSocketDataType>;

  /**
   * The type of options that can be passed to {@link serve}, with support for `routes` and a safer requirement for `fetch`
   */
  type ServeFunctionOptions<T, R extends { [K in keyof R]: RouterTypes.RouteValue<Extract<K, string>> }> =
    | (DistributedOmit<Exclude<Serve<T>, WebSocketServeOptions<T>>, "fetch"> & {
        routes: R;
        fetch?: (this: Server, request: Request, server: Server) => Response | Promise<Response>;
      })
    | (DistributedOmit<Exclude<Serve<T>, WebSocketServeOptions<T>>, "routes"> & {
        routes?: never;
        fetch: (this: Server, request: Request, server: Server) => Response | Promise<Response>;
      })
    | (Omit<WebSocketServeOptions<T>, "fetch"> & {
        routes: {
          [K in keyof R]: RouterTypes.RouteValueWithWebSocketUpgrade<Extract<K, string>>;
        };
        fetch?: (
          this: Server,
          request: Request,
          server: Server,
        ) => Response | Promise<Response | void | undefined> | void | undefined;
      })
    | (Omit<WebSocketServeOptions<T>, "fetch"> & {
        routes?: never;
        fetch: (
          this: Server,
          request: Request,
          server: Server,
        ) => Response | Promise<Response | void | undefined> | void | undefined;
      });

  /**
   * Bun.serve provides a high-performance HTTP server with built-in routing support.
   * It enables both function-based and object-based route handlers with type-safe
   * parameters and method-specific handling.
   *
   * @param options - Server configuration options
   *
   * @category HTTP & Networking
   *
   * @example Basic Usage
   * ```ts
   * Bun.serve({
   *   port: 3000,
   *   fetch(req) {
   *     return new Response("Hello World");
   *   }
   * });
   * ```
   *
   * @example Route-based Handlers
   * ```ts
   * Bun.serve({
   *   routes: {
   *     // Static responses
   *     "/": new Response("Home page"),
   *
   *     // Function handlers with type-safe parameters
   *     "/users/:id": (req) => {
   *       // req.params.id is typed as string
   *       return new Response(`User ${req.params.id}`);
   *     },
   *
   *     // Method-specific handlers
   *     "/api/posts": {
   *       GET: () => new Response("Get posts"),
   *       POST: async (req) => {
   *         const body = await req.json();
   *         return new Response("Created post");
   *       },
   *       DELETE: (req) => new Response("Deleted post")
   *     },
   *
   *     // Wildcard routes
   *     "/static/*": (req) => {
   *       // Handle any path under /static/
   *       return new Response("Static file");
   *     },
   *
   *     // Disable route (fall through to fetch handler)
   *     "/api/legacy": false
   *   },
   *
   *   // Fallback handler for unmatched routes
   *   fetch(req) {
   *     return new Response("Not Found", { status: 404 });
   *   }
   * });
   * ```
   *
   * @example Path Parameters
   * ```ts
   * Bun.serve({
   *   routes: {
   *     // Single parameter
   *     "/users/:id": (req: BunRequest<"/users/:id">) => {
   *       return new Response(`User ID: ${req.params.id}`);
   *     },
   *
   *     // Multiple parameters
   *     "/posts/:postId/comments/:commentId": (
   *       req: BunRequest<"/posts/:postId/comments/:commentId">
   *     ) => {
   *       return new Response(JSON.stringify(req.params));
   *       // Output: {"postId": "123", "commentId": "456"}
   *     }
   *   }
   * });
   * ```
   *
   * @example Route Precedence
   * ```ts
   * // Routes are matched in the following order:
   * // 1. Exact static routes ("/about")
   * // 2. Parameter routes ("/users/:id")
   * // 3. Wildcard routes ("/api/*")
   *
   * Bun.serve({
   *   routes: {
   *     "/api/users": () => new Response("Users list"),
   *     "/api/users/:id": (req) => new Response(`User ${req.params.id}`),
   *     "/api/*": () => new Response("API catchall"),
   *     "/*": () => new Response("Root catchall")
   *   }
   * });
   * ```
   *
   * @example Error Handling
   * ```ts
   * Bun.serve({
   *   routes: {
   *     "/error": () => {
   *       throw new Error("Something went wrong");
   *     }
   *   },
   *   error(error) {
   *     // Custom error handler
   *     console.error(error);
   *     return new Response(`Error: ${error.message}`, {
   *       status: 500
   *     });
   *   }
   * });
   * ```
   *
   * @example Server Lifecycle
   * ```ts
   * const server = Bun.serve({
   *   // Server config...
   * });
   *
   * // Update routes at runtime
   * server.reload({
   *   routes: {
   *     "/": () => new Response("Updated route")
   *   }
   * });
   *
   * // Stop the server
   * server.stop();
   * ```
   *
   * @example Development Mode
   * ```ts
   * Bun.serve({
   *   development: true, // Enable hot reloading
   *   routes: {
   *     // Routes will auto-reload on changes
   *   }
   * });
   * ```
   *
   * @example Type-Safe Request Handling
   * ```ts
   * type Post = {
   *   id: string;
   *   title: string;
   * };
   *
   * Bun.serve({
   *   routes: {
   *     "/api/posts/:id": async (
   *       req: BunRequest<"/api/posts/:id">
   *     ) => {
   *       if (req.method === "POST") {
   *         const body: Post = await req.json();
   *         return Response.json(body);
   *       }
   *       return new Response("Method not allowed", {
   *         status: 405
   *       });
   *     }
   *   }
   * });
   * ```
   */
  function serve<T, R extends { [K in keyof R]: RouterTypes.RouteValue<K & string> }>(
    options: ServeFunctionOptions<T, R> & {
      /**
       * @deprecated Use `routes` instead in new code. This will continue to work for a while though.
       */
      static?: R;
    },
  ): Server;

  /**
   * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) powered by the fastest system calls available for operating on files.
   *
   * This Blob is lazy. That means it won't do any work until you read from it.
   *
   * - `size` will not be valid until the contents of the file are read at least once.
   * - `type` is auto-set based on the file extension when possible
   *
   * @example
   * ```js
   * const file = Bun.file("./hello.json");
   * console.log(file.type); // "application/json"
   * console.log(await file.json()); // { hello: "world" }
   * ```
   *
   * @example
   * ```js
   * await Bun.write(
   *   Bun.file("./hello.txt"),
   *   "Hello, world!"
   * );
   * ```
   * @param path The path to the file (lazily loaded) if the path starts with `s3://` it will behave like {@link S3File}
   */
  function file(path: string | URL, options?: BlobPropertyBag): BunFile;

  /**
   * A list of files embedded into the standalone executable. Lexigraphically sorted by name.
   *
   * If the process is not a standalone executable, this returns an empty array.
   */
  const embeddedFiles: ReadonlyArray<Blob>;

  /**
   * `Blob` that leverages the fastest system calls available to operate on files.
   *
   * This Blob is lazy. It won't do any work until you read from it. Errors propagate as promise rejections.
   *
   * `Blob.size` will not be valid until the contents of the file are read at least once.
   * `Blob.type` will have a default set based on the file extension
   *
   * @example
   * ```js
   * const file = Bun.file(new TextEncoder.encode("./hello.json"));
   * console.log(file.type); // "application/json"
   * ```
   *
   * @param path The path to the file as a byte buffer (the buffer is copied) if the path starts with `s3://` it will behave like {@link S3File}
   */
  function file(path: ArrayBufferLike | Uint8Array, options?: BlobPropertyBag): BunFile;

  /**
   * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) powered by the fastest system calls available for operating on files.
   *
   * This Blob is lazy. That means it won't do any work until you read from it.
   *
   * - `size` will not be valid until the contents of the file are read at least once.
   *
   * @example
   * ```js
   * const file = Bun.file(fd);
   * ```
   *
   * @param fileDescriptor The file descriptor of the file
   */
  function file(fileDescriptor: number, options?: BlobPropertyBag): BunFile;

  /**
   * Allocate a new [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) without zeroing the bytes.
   *
   * This can be 3.5x faster than `new Uint8Array(size)`, but if you send uninitialized memory to your users (even unintentionally), it can potentially leak anything recently in memory.
   */
  function allocUnsafe(size: number): Uint8Array;

  /**
   * Options for `Bun.inspect`
   */
  interface BunInspectOptions {
    /**
     * Whether to colorize the output
     */
    colors?: boolean;
    /**
     * The depth of the inspection
     */
    depth?: number;
    /**
     * Whether to sort the properties of the object
     */
    sorted?: boolean;
    /**
     * Whether to compact the output
     */
    compact?: boolean;
  }

  type WebSocketOptionsProtocolsOrProtocol =
    | {
        /**
         * Protocols to use for the WebSocket connection
         */
        protocols?: string | string[];
      }
    | {
        /**
         * Protocol to use for the WebSocket connection
         */
        protocol?: string;
      };

  type WebSocketOptionsTLS = {
    /**
     * Options for the TLS connection
     */
    tls?: {
      /**
       * Whether to reject the connection if the certificate is not valid
       *
       * @default true
       */
      rejectUnauthorized?: boolean;
    };
  };

  type WebSocketOptionsHeaders = {
    /**
     * Headers to send to the server
     */
    headers?: import("node:http").OutgoingHttpHeaders;
  };

  /**
   * Constructor options for the `Bun.WebSocket` client
   */
  type WebSocketOptions = WebSocketOptionsProtocolsOrProtocol & WebSocketOptionsTLS & WebSocketOptionsHeaders;

  interface WebSocketEventMap {
    close: CloseEvent;
    error: Event;
    message: MessageEvent;
    open: Event;
  }

  /**
   * A WebSocket client implementation
   *
   * @example
   * ```ts
   * const ws = new WebSocket("ws://localhost:8080", {
   *  headers: {
   *    "x-custom-header": "hello",
   *  },
   * });
   *
   * ws.addEventListener("open", () => {
   *   console.log("Connected to server");
   * });
   *
   * ws.addEventListener("message", (event) => {
   *   console.log("Received message:", event.data);
   * });
   *
   * ws.send("Hello, server!");
   * ws.terminate();
   * ```
   */
  interface WebSocket extends EventTarget {
    /**
     * The URL of the WebSocket connection
     */
    readonly url: string;

    /**
     * Legacy URL property (same as url)
     * @deprecated Use url instead
     */
    readonly URL: string;

    /**
     * The current state of the connection
     */
    readonly readyState:
      | typeof WebSocket.CONNECTING
      | typeof WebSocket.OPEN
      | typeof WebSocket.CLOSING
      | typeof WebSocket.CLOSED;

    /**
     * The number of bytes of data that have been queued using send() but not yet transmitted to the network
     */
    readonly bufferedAmount: number;

    /**
     * The protocol selected by the server
     */
    readonly protocol: string;

    /**
     * The extensions selected by the server
     */
    readonly extensions: string;

    /**
     * The type of binary data being received.
     */
    binaryType: "arraybuffer" | "nodebuffer";

    /**
     * Event handler for open event
     */
    onopen: ((this: WebSocket, ev: Event) => any) | null;

    /**
     * Event handler for message event
     */
    onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;

    /**
     * Event handler for error event
     */
    onerror: ((this: WebSocket, ev: Event) => any) | null;

    /**
     * Event handler for close event
     */
    onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;

    /**
     * Transmits data to the server
     * @param data The data to send to the server
     */
    send(data: string | ArrayBufferLike | ArrayBufferView): void;

    /**
     * Closes the WebSocket connection
     * @param code A numeric value indicating the status code
     * @param reason A human-readable string explaining why the connection is closing
     */
    close(code?: number, reason?: string): void;

    /**
     * Sends a ping frame to the server
     * @param data Optional data to include in the ping frame
     */
    ping(data?: string | ArrayBufferLike | ArrayBufferView): void;

    /**
     * Sends a pong frame to the server
     * @param data Optional data to include in the pong frame
     */
    pong(data?: string | ArrayBufferLike | ArrayBufferView): void;

    /**
     * Immediately terminates the connection
     */
    terminate(): void;

    /**
     * Registers an event handler of a specific event type on the WebSocket.
     * @param type A case-sensitive string representing the event type to listen for
     * @param listener The function to be called when the event occurs
     * @param options An options object that specifies characteristics about the event listener
     */
    addEventListener<K extends keyof WebSocketEventMap>(
      type: K,
      listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;

    /**
     * Removes an event listener previously registered with addEventListener()
     * @param type A case-sensitive string representing the event type to remove
     * @param listener The function to remove from the event target
     * @param options An options object that specifies characteristics about the event listener
     */
    removeEventListener<K extends keyof WebSocketEventMap>(
      type: K,
      listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void;

    /** @deprecated Use instance property instead */
    readonly CONNECTING: 0;
    /** @deprecated Use instance property instead */
    readonly OPEN: 1;
    /** @deprecated Use instance property instead */
    readonly CLOSING: 2;
    /** @deprecated Use instance property instead */
    readonly CLOSED: 3;
  }

  /**
   * Pretty-print an object the same as {@link console.log} to a `string`
   *
   * Supports JSX
   *
   * @param arg The value to inspect
   * @param options Options for the inspection
   */
  function inspect(arg: any, options?: BunInspectOptions): string;
  namespace inspect {
    /**
     * That can be used to declare custom inspect functions.
     */
    const custom: typeof import("util").inspect.custom;

    /**
     * Pretty-print an object or array as a table
     *
     * Like {@link console.table}, except it returns a string
     */
    function table(tabularData: object | unknown[], properties?: string[], options?: { colors?: boolean }): string;
    function table(tabularData: object | unknown[], options?: { colors?: boolean }): string;
  }

  interface MMapOptions {
    /**
     * Sets MAP_SYNC flag on Linux. Ignored on macOS due to lack of support.
     */
    sync?: boolean;
    /**
     * Allow other processes to see results instantly?
     * This enables MAP_SHARED. If false, it enables MAP_PRIVATE.
     * @default true
     */
    shared?: boolean;
  }
  /**
   * Open a file as a live-updating `Uint8Array` without copying memory
   * - Writing to the array writes to the file.
   * - Reading from the array reads from the file.
   *
   * This uses the [`mmap()`](https://man7.org/linux/man-pages/man2/mmap.2.html) syscall under the hood.
   *
   * ---
   *
   * This API inherently has some rough edges:
   * - It does not support empty files. It will throw a `SystemError` with `EINVAL`
   * - Usage on shared/networked filesystems is discouraged. It will be very slow.
   * - If you delete or truncate the file, that will crash bun. This is called a segmentation fault.
   *
   * ---
   *
   * To close the file, set the array to `null` and it will be garbage collected eventually.
   */
  function mmap(path: PathLike, opts?: MMapOptions): Uint8Array;

  /**
   * Write to stdout
   */
  const stdout: BunFile;

  /**
   * Write to stderr
   */
  const stderr: BunFile;

  /**
   * Read from stdin
   *
   * This is a read-only BunFile
   */
  const stdin: BunFile;

  type StringLike = string | { toString(): string };

  /**
   * Valid inputs for {@link color}
   *
   * @category Utilities
   */
  type ColorInput =
    | { r: number; g: number; b: number; a?: number }
    | [number, number, number]
    | [number, number, number, number]
    | Uint8Array
    | Uint8ClampedArray
    | Float32Array
    | Float64Array
    | string
    | number
    | { toString(): string };

  /**
   * Converts formats of colors
   *
   * @category Utilities
   *
   * @param input A value that could possibly be a color
   * @param outputFormat An optional output format
   */
  function color(
    input: ColorInput,
    outputFormat?: /**
     * True color ANSI color string, for use in terminals
     * @example \x1b[38;2;100;200;200m
     */
    | "ansi"
      | "ansi-16"
      | "ansi-16m"
      /**
       * 256 color ANSI color string, for use in terminals which don't support true color
       *
       * Tries to match closest 24-bit color to 256 color palette
       */
      | "ansi-256"
      /**
       * Picks the format that produces the shortest output
       */
      | "css"
      /**
       * Lowercase hex color string without alpha
       * @example #ff9800
       */
      | "hex"
      /**
       * Uppercase hex color string without alpha
       * @example #FF9800
       */
      | "HEX"
      /**
       * @example hsl(35.764706, 1, 0.5)
       */
      | "hsl"
      /**
       * @example lab(0.72732764, 33.938198, -25.311619)
       */
      | "lab"
      /**
       * @example 16750592
       */
      | "number"
      /**
       * RGB color string without alpha
       * @example rgb(255, 152, 0)
       */
      | "rgb"
      /**
       * RGB color string with alpha
       * @example rgba(255, 152, 0, 1)
       */
      | "rgba",
  ): string | null;

  /**
   * Convert any color input to rgb
   * @param input Any color input
   * @param outputFormat Specify `[rgb]` to output as an array with `r`, `g`, and `b` properties
   */
  function color(input: ColorInput, outputFormat: "[rgb]"): [number, number, number] | null;
  /**
   * Convert any color input to rgba
   * @param input Any color input
   * @param outputFormat Specify `[rgba]` to output as an array with `r`, `g`, `b`, and `a` properties
   */
  function color(input: ColorInput, outputFormat: "[rgba]"): [number, number, number, number] | null;
  /**
   * Convert any color input to a number
   * @param input Any color input
   * @param outputFormat Specify `{rgb}` to output as an object with `r`, `g`, and `b` properties
   */
  function color(input: ColorInput, outputFormat: "{rgb}"): { r: number; g: number; b: number } | null;
  /**
   * Convert any color input to rgba
   * @param input Any color input
   * @param outputFormat Specify {rgba} to output as an object with `r`, `g`, `b`, and `a` properties
   */
  function color(input: ColorInput, outputFormat: "{rgba}"): { r: number; g: number; b: number; a: number } | null;
  /**
   * Convert any color input to a number
   * @param input Any color input
   * @param outputFormat Specify `number` to output as a number
   */
  function color(input: ColorInput, outputFormat: "number"): number | null;

  /**
   * Bun.semver provides a fast way to parse and compare version numbers.
   */
  namespace semver {
    /**
     * Test if the version satisfies the range. Stringifies both arguments. Returns `true` or `false`.
     */
    function satisfies(version: StringLike, range: StringLike): boolean;

    /**
     * Returns 0 if the versions are equal, 1 if `v1` is greater, or -1 if `v2` is greater.
     * Throws an error if either version is invalid.
     */
    function order(v1: StringLike, v2: StringLike): -1 | 0 | 1;
  }

  namespace unsafe {
    /**
     * Cast bytes to a `String` without copying. This is the fastest way to get a `String` from a `Uint8Array` or `ArrayBuffer`.
     *
     * **Only use this for ASCII strings**. If there are non-ascii characters, your application may crash and/or very confusing bugs will happen such as `"foo" !== "foo"`.
     *
     * **The input buffer must not be garbage collected**. That means you will need to hold on to it for the duration of the string's lifetime.
     */
    function arrayBufferToString(buffer: Uint8Array | ArrayBufferLike): string;

    /**
     * Cast bytes to a `String` without copying. This is the fastest way to get a `String` from a `Uint16Array`
     *
     * **The input must be a UTF-16 encoded string**. This API does no validation whatsoever.
     *
     * **The input buffer must not be garbage collected**. That means you will need to hold on to it for the duration of the string's lifetime.
     */

    function arrayBufferToString(buffer: Uint16Array): string;

    /**
     * Force the garbage collector to run extremely often,
     * especially inside `bun:test`.
     *
     * - `0`: default, disable
     * - `1`: asynchronously call the garbage collector more often
     * - `2`: synchronously call the garbage collector more often.
     *
     * This is a global setting. It's useful for debugging seemingly random crashes.
     *
     * `BUN_GARBAGE_COLLECTOR_LEVEL` environment variable is also supported.
     *
     * @param level
     * @returns The previous level
     */
    function gcAggressionLevel(level?: 0 | 1 | 2): 0 | 1 | 2;

    /**
     * Dump the mimalloc heap to the console
     */
    function mimallocDump(): void;
  }

  type DigestEncoding = "utf8" | "ucs2" | "utf16le" | "latin1" | "ascii" | "base64" | "base64url" | "hex";

  /**
   * Are ANSI colors enabled for stdin and stdout?
   *
   * Used for {@link console.log}
   */
  const enableANSIColors: boolean;

  /**
   * What script launched Bun?
   *
   * Absolute file path
   *
   * @example "/never-gonna-give-you-up.js"
   */
  const main: string;

  /**
   * Manually trigger the garbage collector
   *
   * This does two things:
   * 1. It tells JavaScriptCore to run the garbage collector
   * 2. It tells [mimalloc](https://github.com/microsoft/mimalloc) to clean up fragmented memory. Mimalloc manages the heap not used in JavaScriptCore.
   *
   * @param force Synchronously run the garbage collector
   */
  function gc(force?: boolean): void;

  /**
   * JavaScriptCore engine's internal heap snapshot
   *
   * I don't know how to make this something Chrome or Safari can read.
   *
   * If you have any ideas, please file an issue https://github.com/oven-sh/bun
   */
  interface HeapSnapshot {
    /** 2 */
    version: number;

    /** "Inspector" */
    type: string;

    nodes: number[];

    nodeClassNames: string[];
    edges: number[];
    edgeTypes: string[];
    edgeNames: string[];
  }

  /**
   * Returns the number of nanoseconds since the process was started.
   *
   * This function uses a high-resolution monotonic system timer to provide precise time measurements.
   * In JavaScript, numbers are represented as double-precision floating-point values (IEEE 754),
   * which can safely represent integers up to 2^53 - 1 (Number.MAX_SAFE_INTEGER).
   *
   * Due to this limitation, while the internal counter may continue beyond this point,
   * the precision of the returned value will degrade after 14.8 weeks of uptime (when the nanosecond
   * count exceeds Number.MAX_SAFE_INTEGER). Beyond this point, the function will continue to count but
   * with reduced precision, which might affect time calculations and comparisons in long-running applications.
   *
   * @returns {number} The number of nanoseconds since the process was started, with precise values up to
   * Number.MAX_SAFE_INTEGER.
   */
  function nanoseconds(): number;

  /**
   * Show precise statistics about memory usage of your application
   *
   * Generate a heap snapshot in JavaScriptCore's format that can be viewed with `bun --inspect` or Safari's Web Inspector
   */
  function generateHeapSnapshot(format?: "jsc"): HeapSnapshot;

  /**
   * Show precise statistics about memory usage of your application
   *
   * Generate a V8 Heap Snapshot that can be used with Chrome DevTools & Visual Studio Code
   *
   * This is a JSON string that can be saved to a file.
   * ```ts
   * const snapshot = Bun.generateHeapSnapshot("v8");
   * await Bun.write("heap.heapsnapshot", snapshot);
   * ```
   */
  function generateHeapSnapshot(format: "v8"): string;

  /**
   * The next time JavaScriptCore is idle, clear unused memory and attempt to reduce the heap size.
   *
   * @deprecated
   */
  function shrink(): void;

  /**
   * Open a file in your local editor. Auto-detects via `$VISUAL` || `$EDITOR`
   *
   * @param path path to open
   */
  function openInEditor(path: string, options?: EditorOptions): void;

  var fetch: typeof globalThis.fetch;

  interface EditorOptions {
    editor?: "vscode" | "subl";
    line?: number;
    column?: number;
  }

  /**
   * This class only exists in types
   */
  abstract class CryptoHashInterface<T> {
    /**
     * Update the hash with data
     *
     * @param data
     */
    update(data: Bun.BlobOrStringOrBuffer): T;

    /**
     * Finalize the hash
     *
     * @param encoding `DigestEncoding` to return the hash in. If none is provided, it will return a `Uint8Array`.
     */
    digest(encoding: DigestEncoding): string;

    /**
     * Finalize the hash
     *
     * @param hashInto `TypedArray` to write the hash into. Faster than creating a new one each time
     */
    digest(hashInto?: NodeJS.TypedArray): NodeJS.TypedArray;

    /**
     * Run the hash over the given data
     *
     * @param input `string`, `Uint8Array`, or `ArrayBuffer` to hash. `Uint8Array` or `ArrayBuffer` is faster.
     *
     * @param hashInto `TypedArray` to write the hash into. Faster than creating a new one each time
     */
    static hash(input: Bun.BlobOrStringOrBuffer, hashInto?: NodeJS.TypedArray): NodeJS.TypedArray;

    /**
     * Run the hash over the given data
     *
     * @param input `string`, `Uint8Array`, or `ArrayBuffer` to hash. `Uint8Array` or `ArrayBuffer` is faster.
     *
     * @param encoding `DigestEncoding` to return the hash in
     */
    static hash(input: Bun.BlobOrStringOrBuffer, encoding: DigestEncoding): string;
  }

  type SupportedCryptoAlgorithms =
    | "blake2b256"
    | "blake2b512"
    | "md4"
    | "md5"
    | "ripemd160"
    | "sha1"
    | "sha224"
    | "sha256"
    | "sha384"
    | "sha512"
    | "sha512-224"
    | "sha512-256"
    | "sha3-224"
    | "sha3-256"
    | "sha3-384"
    | "sha3-512"
    | "shake128"
    | "shake256";

  /**
   * Hardware-accelerated cryptographic hash functions
   *
   * Used for `crypto.createHash()`
   */
  class CryptoHasher {
    /**
     * The algorithm chosen to hash the data
     */
    readonly algorithm: SupportedCryptoAlgorithms;

    /**
     * The length of the output hash in bytes
     */
    readonly byteLength: number;

    /**
     * Create a new hasher
     *
     * @param algorithm The algorithm to use. See {@link algorithms} for a list of supported algorithms
     * @param hmacKey Optional key for HMAC. Must be a string or `TypedArray`. If not provided, the hasher will be a non-HMAC hasher.
     */
    constructor(algorithm: SupportedCryptoAlgorithms, hmacKey?: string | NodeJS.TypedArray);

    /**
     * Update the hash with data
     *
     * @param input
     */
    update(input: Bun.BlobOrStringOrBuffer, inputEncoding?: import("crypto").Encoding): CryptoHasher;

    /**
     * Perform a deep copy of the hasher
     */
    copy(): CryptoHasher;

    /**
     * Finalize the hash. Resets the CryptoHasher so it can be reused.
     *
     * @param encoding `DigestEncoding` to return the hash in. If none is provided, it will return a `Uint8Array`.
     */
    digest(encoding: DigestEncoding): string;

    /**
     * Finalize the hash and return a `Buffer`
     */
    digest(): Buffer;

    /**
     * Finalize the hash
     *
     * @param hashInto `TypedArray` to write the hash into. Faster than creating a new one each time
     */
    digest(hashInto: NodeJS.TypedArray): NodeJS.TypedArray;

    /**
     * Run the hash over the given data
     *
     * @param input `string`, `Uint8Array`, or `ArrayBuffer` to hash. `Uint8Array` or `ArrayBuffer` is faster.
     */
    static hash(algorithm: SupportedCryptoAlgorithms, input: Bun.BlobOrStringOrBuffer): Buffer;

    /**
     * Run the hash over the given data
     *
     * @param input `string`, `Uint8Array`, or `ArrayBuffer` to hash. `Uint8Array` or `ArrayBuffer` is faster.
     *
     * @param hashInto `TypedArray` to write the hash into. Faster than creating a new one each time
     */
    static hash(
      algorithm: SupportedCryptoAlgorithms,
      input: Bun.BlobOrStringOrBuffer,
      hashInto: NodeJS.TypedArray,
    ): NodeJS.TypedArray;

    /**
     * Run the hash over the given data
     *
     * @param input `string`, `Uint8Array`, or `ArrayBuffer` to hash. `Uint8Array` or `ArrayBuffer` is faster.
     *
     * @param encoding `DigestEncoding` to return the hash in
     */
    static hash(
      algorithm: SupportedCryptoAlgorithms,
      input: Bun.BlobOrStringOrBuffer,
      encoding: DigestEncoding,
    ): string;

    /**
     * List of supported hash algorithms
     *
     * These are hardware accelerated with BoringSSL
     */
    static readonly algorithms: SupportedCryptoAlgorithms[];
  }

  /**
   * Resolve a `Promise` after milliseconds. This is like
   * {@link setTimeout} except it returns a `Promise`.
   *
   * @category Utilities
   *
   * @param ms milliseconds to delay resolving the promise. This is a minimum
   * number. It may take longer. If a {@link Date} is passed, it will sleep until the
   * {@link Date} is reached.
   *
   * @example
   * ## Sleep for 1 second
   * ```ts
   * import { sleep } from "bun";
   *
   * await sleep(1000);
   * ```
   * ## Sleep for 10 milliseconds
   * ```ts
   * await Bun.sleep(10);
   * ```
   * ## Sleep until `Date`
   *
   * ```ts
   * const target = new Date();
   * target.setSeconds(target.getSeconds() + 1);
   * await Bun.sleep(target);
   * ```
   * Internally, `Bun.sleep` is the equivalent of
   * ```ts
   * await new Promise((resolve) => setTimeout(resolve, ms));
   * ```
   * As always, you can use `Bun.sleep` or the imported `sleep` function interchangeably.
   */
  function sleep(ms: number | Date): Promise<void>;

  /**
   * Sleep the thread for a given number of milliseconds
   *
   * This is a blocking function.
   *
   * Internally, it calls [nanosleep(2)](https://man7.org/linux/man-pages/man2/nanosleep.2.html)
   */
  function sleepSync(ms: number): void;

  /**
   * Hash `input` using [SHA-2 512/256](https://en.wikipedia.org/wiki/SHA-2#Comparison_of_SHA_functions)
   *
   * @category Utilities
   *
   * @param input `string`, `Uint8Array`, or `ArrayBuffer` to hash. `Uint8Array` or `ArrayBuffer` will be faster
   * @param hashInto optional `Uint8Array` to write the hash to. 32 bytes minimum.
   *
   * This hashing function balances speed with cryptographic strength. This does not encrypt or decrypt data.
   *
   * The implementation uses [BoringSSL](https://boringssl.googlesource.com/boringssl) (used in Chromium & Go)
   *
   * The equivalent `openssl` command is:
   *
   * ```bash
   * # You will need OpenSSL 3 or later
   * openssl sha512-256 /path/to/file
   * ```
   */
  function sha(input: Bun.StringOrBuffer, hashInto?: NodeJS.TypedArray): NodeJS.TypedArray;

  /**
   * Hash `input` using [SHA-2 512/256](https://en.wikipedia.org/wiki/SHA-2#Comparison_of_SHA_functions)
   *
   * @category Utilities
   *
   * @param input `string`, `Uint8Array`, or `ArrayBuffer` to hash. `Uint8Array` or `ArrayBuffer` will be faster
   * @param encoding `DigestEncoding` to return the hash in
   *
   * This hashing function balances speed with cryptographic strength. This does not encrypt or decrypt data.
   *
   * The implementation uses [BoringSSL](https://boringssl.googlesource.com/boringssl) (used in Chromium & Go)
   *
   * The equivalent `openssl` command is:
   *
   * ```bash
   * # You will need OpenSSL 3 or later
   * openssl sha512-256 /path/to/file
   * ```
   */
  function sha(input: Bun.StringOrBuffer, encoding: DigestEncoding): string;

  /**
   * This is not the default because it's not cryptographically secure and it's slower than {@link SHA512}
   *
   * Consider using the ugly-named {@link SHA512_256} instead
   */
  class SHA1 extends CryptoHashInterface<SHA1> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 20;
  }
  class MD5 extends CryptoHashInterface<MD5> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 16;
  }
  class MD4 extends CryptoHashInterface<MD4> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 16;
  }
  class SHA224 extends CryptoHashInterface<SHA224> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 28;
  }
  class SHA512 extends CryptoHashInterface<SHA512> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 64;
  }
  class SHA384 extends CryptoHashInterface<SHA384> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 48;
  }
  class SHA256 extends CryptoHashInterface<SHA256> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 32;
  }
  /**
   * See also {@link sha}
   */
  class SHA512_256 extends CryptoHashInterface<SHA512_256> {
    constructor();

    /**
     * The number of bytes the hash will produce
     */
    static readonly byteLength: 32;
  }

  /** Compression options for `Bun.deflateSync` and `Bun.gzipSync` */
  interface ZlibCompressionOptions {
    /**
     * The compression level to use. Must be between `-1` and `9`.
     * - A value of `-1` uses the default compression level (Currently `6`)
     * - A value of `0` gives no compression
     * - A value of `1` gives least compression, fastest speed
     * - A value of `9` gives best compression, slowest speed
     */
    level?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    /**
     * How much memory should be allocated for the internal compression state.
     *
     * A value of `1` uses minimum memory but is slow and reduces compression ratio.
     *
     * A value of `9` uses maximum memory for optimal speed. The default is `8`.
     */
    memLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    /**
     * The base 2 logarithm of the window size (the size of the history buffer).
     *
     * Larger values of this parameter result in better compression at the expense of memory usage.
     *
     * The following value ranges are supported:
     * - `9..15`: The output will have a zlib header and footer (Deflate)
     * - `-9..-15`: The output will **not** have a zlib header or footer (Raw Deflate)
     * - `25..31` (16+`9..15`): The output will have a gzip header and footer (gzip)
     *
     * The gzip header will have no file name, no extra data, no comment, no modification time (set to zero) and no header CRC.
     */
    windowBits?:
      | -9
      | -10
      | -11
      | -12
      | -13
      | -14
      | -15
      | 9
      | 10
      | 11
      | 12
      | 13
      | 14
      | 15
      | 25
      | 26
      | 27
      | 28
      | 29
      | 30
      | 31;
    /**
     * Tunes the compression algorithm.
     *
     * - `Z_DEFAULT_STRATEGY`: For normal data **(Default)**
     * - `Z_FILTERED`: For data produced by a filter or predictor
     * - `Z_HUFFMAN_ONLY`: Force Huffman encoding only (no string match)
     * - `Z_RLE`: Limit match distances to one (run-length encoding)
     * - `Z_FIXED` prevents the use of dynamic Huffman codes
     *
     * `Z_RLE` is designed to be almost as fast as `Z_HUFFMAN_ONLY`, but give better compression for PNG image data.
     *
     * `Z_FILTERED` forces more Huffman coding and less string matching, it is
     * somewhat intermediate between `Z_DEFAULT_STRATEGY` and `Z_HUFFMAN_ONLY`.
     * Filtered data consists mostly of small values with a somewhat random distribution.
     */
    strategy?: number;

    library?: "zlib";
  }

  interface LibdeflateCompressionOptions {
    level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    library?: "libdeflate";
  }

  /**
   * Compresses a chunk of data with `zlib` DEFLATE algorithm.
   * @param data The buffer of data to compress
   * @param options Compression options to use
   * @returns The output buffer with the compressed data
   */
  function deflateSync(
    data: Uint8Array | string | ArrayBuffer,
    options?: ZlibCompressionOptions | LibdeflateCompressionOptions,
  ): Uint8Array;
  /**
   * Compresses a chunk of data with `zlib` GZIP algorithm.
   * @param data The buffer of data to compress
   * @param options Compression options to use
   * @returns The output buffer with the compressed data
   */
  function gzipSync(
    data: Uint8Array | string | ArrayBuffer,
    options?: ZlibCompressionOptions | LibdeflateCompressionOptions,
  ): Uint8Array;
  /**
   * Decompresses a chunk of data with `zlib` INFLATE algorithm.
   * @param data The buffer of data to decompress
   * @returns The output buffer with the decompressed data
   */
  function inflateSync(
    data: Uint8Array | string | ArrayBuffer,
    options?: ZlibCompressionOptions | LibdeflateCompressionOptions,
  ): Uint8Array;
  /**
   * Decompresses a chunk of data with `zlib` GUNZIP algorithm.
   * @param data The buffer of data to decompress
   * @returns The output buffer with the decompressed data
   */
  function gunzipSync(
    data: Uint8Array | string | ArrayBuffer,
    options?: ZlibCompressionOptions | LibdeflateCompressionOptions,
  ): Uint8Array;

  /**
   * Compresses a chunk of data with the Zstandard (zstd) compression algorithm.
   * @param data The buffer of data to compress
   * @param options Compression options to use
   * @returns The output buffer with the compressed data
   */
  function zstdCompressSync(
    data: NodeJS.TypedArray | Buffer | string | ArrayBuffer,
    options?: { level?: number },
  ): Buffer;

  /**
   * Compresses a chunk of data with the Zstandard (zstd) compression algorithm.
   * @param data The buffer of data to compress
   * @param options Compression options to use
   * @returns A promise that resolves to the output buffer with the compressed data
   */
  function zstdCompress(
    data: NodeJS.TypedArray | Buffer | string | ArrayBuffer,
    options?: { level?: number },
  ): Promise<Buffer>;

  /**
   * Decompresses a chunk of data with the Zstandard (zstd) decompression algorithm.
   * @param data The buffer of data to decompress
   * @returns The output buffer with the decompressed data
   */
  function zstdDecompressSync(data: NodeJS.TypedArray | Buffer | string | ArrayBuffer): Buffer;

  /**
   * Decompresses a chunk of data with the Zstandard (zstd) decompression algorithm.
   * @param data The buffer of data to decompress
   * @returns A promise that resolves to the output buffer with the decompressed data
   */
  function zstdDecompress(data: NodeJS.TypedArray | Buffer | string | ArrayBuffer): Promise<Buffer>;

  type Target =
    /**
     * For generating bundles that are intended to be run by the Bun runtime. In many cases,
     * it isn't necessary to bundle server-side code; you can directly execute the source code
     * without modification. However, bundling your server code can reduce startup times and
     * improve running performance.
     *
     * All bundles generated with `target: "bun"` are marked with a special `// @bun` pragma, which
     * indicates to the Bun runtime that there's no need to re-transpile the file before execution.
     */
    | "bun"
    /**
     * The plugin will be applied to Node.js builds
     */
    | "node"
    /**
     * The plugin will be applied to browser builds
     */
    | "browser";

  /** https://bun.sh/docs/bundler/loaders */
  type Loader = "js" | "jsx" | "ts" | "tsx" | "json" | "toml" | "file" | "napi" | "wasm" | "text" | "css" | "html";

  interface PluginConstraints {
    /**
     * Only apply the plugin when the import specifier matches this regular expression
     *
     * @example
     * ```ts
     * // Only apply the plugin when the import specifier matches the regex
     * Bun.plugin({
     *  setup(builder) {
     *     builder.onLoad({ filter: /node_modules\/underscore/ }, (args) => {
     *      return { contents: "throw new Error('Please use lodash instead of underscore.')" };
     *     });
     *  }
     * })
     * ```
     */
    filter: RegExp;

    /**
     * Only apply the plugin when the import specifier has a namespace matching
     * this string
     *
     * Namespaces are prefixes in import specifiers. For example, `"bun:ffi"`
     * has the namespace `"bun"`.
     *
     * The default namespace is `"file"` and it can be omitted from import
     * specifiers.
     */
    namespace?: string;
  }

  interface OnLoadResultSourceCode {
    /**
     * The source code of the module
     */
    contents: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer;
    /**
     * The loader to use for this file
     *
     * "css" will be added in a future version of Bun.
     */
    loader?: Loader;
  }

  interface OnLoadResultObject {
    /**
     * The object to use as the module
     * @example
     * ```ts
     * // In your loader
     * builder.onLoad({ filter: /^hello:world$/ }, (args) => {
     *    return { exports: { foo: "bar" }, loader: "object" };
     * });
     *
     * // In your script
     * import {foo} from "hello:world";
     * console.log(foo); // "bar"
     * ```
     */
    exports: Record<string, unknown>;
    /**
     * The loader to use for this file
     */
    loader: "object";
  }

  interface OnLoadArgs {
    /**
     * The resolved import specifier of the module being loaded
     * @example
     * ```ts
     * builder.onLoad({ filter: /^hello:world$/ }, (args) => {
     *   console.log(args.path); // "hello:world"
     *   return { exports: { foo: "bar" }, loader: "object" };
     * });
     * ```
     */
    path: string;
    /**
     * The namespace of the module being loaded
     */
    namespace: string;
    /**
     * The default loader for this file extension
     */
    loader: Loader;
    /**
     * Defer the execution of this callback until all other modules have been parsed.
     *
     * @returns Promise which will be resolved when all modules have been parsed
     */
    defer: () => Promise<void>;
  }

  type OnLoadResult = OnLoadResultSourceCode | OnLoadResultObject | undefined | void;
  type OnLoadCallback = (args: OnLoadArgs) => OnLoadResult | Promise<OnLoadResult>;
  type OnStartCallback = () => void | Promise<void>;

  interface OnResolveArgs {
    /**
     * The import specifier of the module being loaded
     */
    path: string;
    /**
     * The module that imported the module being resolved
     */
    importer: string;
    /**
     * The namespace of the importer.
     */
    namespace: string;
    /**
     * The directory to perform file-based resolutions in.
     */
    resolveDir: string;
    /**
     * The kind of import this resolve is for.
     */
    kind: ImportKind;
    // resolveDir: string;
    // pluginData: any;
  }

  interface OnResolveResult {
    /**
     * The destination of the import
     */
    path: string;
    /**
     * The namespace of the destination
     * It will be concatenated with `path` to form the final import specifier
     * @example
     * ```ts
     * "foo" // "foo:bar"
     * ```
     */
    namespace?: string;
    external?: boolean;
  }

  type OnResolveCallback = (
    args: OnResolveArgs,
  ) => OnResolveResult | Promise<OnResolveResult | undefined | null> | undefined | null;

  type FFIFunctionCallable = Function & {
    // Making a nominally typed function so that the user must get it from dlopen
    readonly __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
  };

  /**
   * The builder object passed to `Bun.plugin`
   *
   * @category Bundler
   */
  interface PluginBuilder {
    /**
     * Register a callback which will be invoked when bundling starts. When
     * using hot module reloading, this is called at the start of each
     * incremental rebuild.
     *
     * @example
     * ```ts
     * Bun.plugin({
     *   setup(builder) {
     *     builder.onStart(() => {
     *       console.log("bundle just started!!")
     *     });
     *   },
     * });
     * ```
     *
     * @returns `this` for method chaining
     */
    onStart(callback: OnStartCallback): this;
    onBeforeParse(
      constraints: PluginConstraints,
      callback: {
        napiModule: unknown;
        symbol: string;
        external?: unknown | undefined;
      },
    ): this;
    /**
     * Register a callback to load imports with a specific import specifier
     * @param constraints The constraints to apply the plugin to
     * @param callback The callback to handle the import
     * @example
     * ```ts
     * Bun.plugin({
     *   setup(builder) {
     *     builder.onLoad({ filter: /^hello:world$/ }, (args) => {
     *       return { exports: { foo: "bar" }, loader: "object" };
     *     });
     *   },
     * });
     * ```
     *
     * @returns `this` for method chaining
     */
    onLoad(constraints: PluginConstraints, callback: OnLoadCallback): this;
    /**
     * Register a callback to resolve imports matching a filter and/or namespace
     * @param constraints The constraints to apply the plugin to
     * @param callback The callback to handle the import
     * @example
     * ```ts
     * Bun.plugin({
     *   setup(builder) {
     *     builder.onResolve({ filter: /^wat$/ }, (args) => {
     *       return { path: "/tmp/woah.js" };
     *     });
     *   },
     * });
     * ```
     *
     * @returns `this` for method chaining
     */
    onResolve(constraints: PluginConstraints, callback: OnResolveCallback): this;
    /**
     * The config object passed to `Bun.build` as is. Can be mutated.
     */
    config: BuildConfig & { plugins: BunPlugin[] };

    /**
     * Create a lazy-loaded virtual module that can be `import`ed or `require`d from other modules
     *
     * @param specifier The module specifier to register the callback for
     * @param callback The function to run when the module is imported or required
     *
     * @example
     * ```ts
     * Bun.plugin({
     *   setup(builder) {
     *     builder.module("hello:world", () => {
     *       return { exports: { foo: "bar" }, loader: "object" };
     *     });
     *   },
     * });
     *
     * // sometime later
     * const { foo } = await import("hello:world");
     * console.log(foo); // "bar"
     *
     * // or
     * const { foo } = require("hello:world");
     * console.log(foo); // "bar"
     * ```
     *
     * @returns `this` for method chaining
     */
    module(specifier: string, callback: () => OnLoadResult | Promise<OnLoadResult>): this;
  }

  /**
   * A Bun plugin. Used for extending Bun's behavior at runtime, or with {@link Bun.build}
   *
   * @category Bundler
   */
  interface BunPlugin {
    /**
     * Human-readable name of the plugin
     *
     * In a future version of Bun, this will be used in error messages.
     */
    name: string;

    /**
     * The target JavaScript environment the plugin should be applied to.
     * - `bun`: The default environment when using `bun run` or `bun` to load a script
     * - `browser`: The plugin will be applied to browser builds
     * - `node`: The plugin will be applied to Node.js builds
     *
     * If unspecified, it is assumed that the plugin is compatible with all targets.
     *
     * This field is not read by {@link Bun.plugin}, only {@link Bun.build} and `bun build`
     */
    target?: Target;

    /**
     * A function that will be called when the plugin is loaded.
     *
     * This function may be called in the same tick that it is registered, or it
     * may be called later. It could potentially be called multiple times for
     * different targets.
     */
    setup(
      /**
       * A builder object that can be used to register plugin hooks
       * @example
       * ```ts
       * builder.onLoad({ filter: /\.yaml$/ }, ({ path }) => ({
       *   loader: "object",
       *   exports: require("js-yaml").load(fs.readFileSync(path, "utf8")),
       * }));
       * ```
       */
      build: PluginBuilder,
    ): void | Promise<void>;
  }

  /**
   * Extend Bun's module resolution and loading behavior
   *
   * Plugins are applied in the order they are defined.
   *
   * Today, there are two kinds of hooks:
   * - `onLoad` lets you return source code or an object that will become the module's exports
   * - `onResolve` lets you redirect a module specifier to another module specifier. It does not chain.
   *
   * Plugin hooks must define a `filter` RegExp and will only be matched if the
   * import specifier contains a "." or a ":".
   *
   * ES Module resolution semantics mean that plugins may be initialized _after_
   * a module is resolved. You might need to load plugins at the very beginning
   * of the application and then use a dynamic import to load the rest of the
   * application. A future version of Bun may also support specifying plugins
   * via `bunfig.toml`.
   *
   * @example
   * A YAML loader plugin
   *
   * ```js
   * Bun.plugin({
   *  setup(builder) {
   *   builder.onLoad({ filter: /\.yaml$/ }, ({path}) => ({
   *     loader: "object",
   *     exports: require("js-yaml").load(fs.readFileSync(path, "utf8"))
   *   }));
   * });
   *
   * // You can use require()
   * const {foo} = require("./file.yaml");
   *
   * // Or import
   * await import("./file.yaml");
   *
   * ```
   */
  interface BunRegisterPlugin {
    <T extends BunPlugin>(options: T): ReturnType<T["setup"]>;

    /**
     * Deactivate all plugins
     *
     * This prevents registered plugins from being applied to future builds.
     */
    clearAll(): void;
  }

  const plugin: BunRegisterPlugin;

  /**
   * Is the current global scope the main thread?
   */
  const isMainThread: boolean;

  /**
   * Used when importing an HTML file at runtime or at build time.
   *
   * @example
   *
   * ```ts
   * import app from "./index.html";
   * ```
   *
   */

  interface HTMLBundle {
    index: string;

    /** Array of generated output files with metadata. This only exists when built ahead of time with `Bun.build` or `bun build` */
    files?: Array<{
      /** Original source file path. */
      input?: string;
      /** Generated output file path (with content hash, if included in naming) */
      path: string;
      /** File type/loader used (js, css, html, file, etc.) */
      loader: Loader;
      /** Whether this file is an entry point */
      isEntry: boolean;
      /** HTTP headers including ETag and Content-Type */
      headers: {
        /** ETag for caching */
        etag: string;
        /** MIME type with charset */
        "content-type": string;

        /**
         * Additional headers may be added in the future.
         */
        [key: string]: string;
      };
    }>;
  }

  /**
   * Represents a TCP or TLS socket connection used for network communication.
   * This interface provides methods for reading, writing, managing the connection state,
   * and handling TLS-specific features if applicable.
   *
   * Sockets are created using `Bun.connect()` or accepted by a `Bun.listen()` server.
   *
   * @category HTTP & Networking
   */
  interface Socket<Data = undefined> extends Disposable {
    /**
     * Writes `data` to the socket. This method is unbuffered and non-blocking. This uses the `sendto(2)` syscall internally.
     *
     * For optimal performance with multiple small writes, consider batching multiple
     * writes together into a single `socket.write()` call.
     *
     * @param data The data to write. Can be a string (encoded as UTF-8), `ArrayBuffer`, `TypedArray`, or `DataView`.
     * @param byteOffset The offset in bytes within the buffer to start writing from. Defaults to 0. Ignored for strings.
     * @param byteLength The number of bytes to write from the buffer. Defaults to the remaining length of the buffer from the offset. Ignored for strings.
     * @returns The number of bytes written. Returns `-1` if the socket is closed or shutting down. Can return less than the input size if the socket's buffer is full (backpressure).
     * @example
     * ```ts
     * // Send a string
     * const bytesWritten = socket.write("Hello, world!\n");
     *
     * // Send binary data
     * const buffer = new Uint8Array([0x01, 0x02, 0x03]);
     * socket.write(buffer);
     *
     * // Send part of a buffer
     * const largeBuffer = new Uint8Array(1024);
     * // ... fill largeBuffer ...
     * socket.write(largeBuffer, 100, 50); // Write 50 bytes starting from index 100
     * ```
     */
    write(data: string | BufferSource, byteOffset?: number, byteLength?: number): number;

    /**
     * The user-defined data associated with this socket instance.
     * This can be set when the socket is created via `Bun.connect({ data: ... })`.
     * It can be read or updated at any time.
     *
     * @example
     * ```ts
     * // In a socket handler
     * function open(socket: Socket<{ userId: string }>) {
     *   console.log(`Socket opened for user: ${socket.data.userId}`);
     *   socket.data.lastActivity = Date.now(); // Update data
     * }
     * ```
     */
    data: Data;

    /**
     * Sends the final data chunk and initiates a graceful shutdown of the socket's write side.
     * After calling `end()`, no more data can be written using `write()` or `end()`.
     * The socket remains readable until the remote end also closes its write side or the connection is terminated.
     * This sends a TCP FIN packet after writing the data.
     *
     * @param data Optional final data to write before closing. Same types as `write()`.
     * @param byteOffset Optional offset for buffer data.
     * @param byteLength Optional length for buffer data.
     * @returns The number of bytes written for the final chunk. Returns `-1` if the socket was already closed or shutting down.
     * @example
     * ```ts
     * // send some data and close the write side
     * socket.end("Goodbye!");
     * // or close write side without sending final data
     * socket.end();
     * ```
     */
    end(data?: string | BufferSource, byteOffset?: number, byteLength?: number): number;

    /**
     * Close the socket immediately
     */
    end(): void;

    /**
     * Keep Bun's process alive at least until this socket is closed
     *
     * After the socket has closed, the socket is unref'd, the process may exit,
     * and this becomes a no-op
     */
    ref(): void;

    /**
     * Set a timeout until the socket automatically closes.
     *
     * To reset the timeout, call this function again.
     *
     * When a timeout happens, the `timeout` callback is called and the socket is closed.
     */
    timeout(seconds: number): void;

    /**
     * Forcefully closes the socket connection immediately. This is an abrupt termination, unlike the graceful shutdown initiated by `end()`.
     * It uses `SO_LINGER` with `l_onoff=1` and `l_linger=0` before calling `close(2)`.
     * Consider using {@link close close()} or {@link end end()} for graceful shutdowns.
     *
     * @example
     * ```ts
     * socket.terminate();
     * ```
     */
    terminate(): void;

    /**
     * Shuts down the write-half or both halves of the connection.
     * This allows the socket to enter a half-closed state where it can still receive data
     * but can no longer send data (`halfClose = true`), or close both read and write
     * (`halfClose = false`, similar to `end()` but potentially more immediate depending on OS).
     * Calls `shutdown(2)` syscall internally.
     *
     * @param halfClose If `true`, only shuts down the write side (allows receiving). If `false` or omitted, shuts down both read and write. Defaults to `false`.
     * @example
     * ```ts
     * // Stop sending data, but allow receiving
     * socket.shutdown(true);
     *
     * // Shutdown both reading and writing
     * socket.shutdown();
     * ```
     */
    shutdown(halfClose?: boolean): void;

    /**
     * The ready state of the socket.
     *
     * You can assume that a positive value means the socket is open and usable
     *
     * - `-2` = Shutdown
     * - `-1` = Detached
     * - `0` = Closed
     * - `1` = Established
     * - `2` = Else
     */
    readonly readyState: -2 | -1 | 0 | 1 | 2;

    /**
     * Allow Bun's process to exit even if this socket is still open
     *
     * After the socket has closed, this function does nothing.
     */
    unref(): void;

    /**
     * Flush any buffered data to the socket
     * This attempts to send the data immediately, but success depends on the network conditions
     * and the receiving end.
     * It might be necessary after several `write` calls if immediate sending is critical,
     * though often the OS handles flushing efficiently. Note that `write` calls outside
     * `open`/`data`/`drain` might benefit from manual `cork`/`flush`.
     */
    flush(): void;

    /**
     * Reset the socket's callbacks. This is useful with `bun --hot` to facilitate hot reloading.
     *
     * This will apply to all sockets from the same {@link Listener}. it is per socket only for {@link Bun.connect}.
     */
    reload(handler: SocketHandler): void;

    /**
     * Get the server that created this socket
     *
     * This will return undefined if the socket was created by {@link Bun.connect} or if the listener has already closed.
     */
    readonly listener?: SocketListener;

    readonly remoteFamily: "IPv4" | "IPv6";

    /**
     * Remote IP address connected to the socket
     * @example "192.168.1.100" | "2001:db8::1"
     */
    readonly remoteAddress: string;

    /**
     * Remote port connected to the socket
     * @example 8080
     */
    readonly remotePort: number;

    /**
     * IP protocol family used for the local endpoint of the socket
     * @example "IPv4" | "IPv6"
     */
    readonly localFamily: "IPv4" | "IPv6";

    /**
     * Local IP address connected to the socket
     * @example "192.168.1.100" | "2001:db8::1"
     */
    readonly localAddress: string;

    /**
     * local port connected to the socket
     * @example 8080
     */
    readonly localPort: number;

    /**
     * This property is `true` if the peer certificate was signed by one of the CAs
     * specified when creating the `Socket` instance, otherwise `false`.
     */
    readonly authorized: boolean;

    /**
     * String containing the selected ALPN protocol.
     * Before a handshake has completed, this value is always null.
     * When a handshake is completed but not ALPN protocol was selected, socket.alpnProtocol equals false.
     */
    readonly alpnProtocol: string | false | null;

    /**
     * Disables TLS renegotiation for this `Socket` instance. Once called, attempts
     * to renegotiate will trigger an `error` handler on the `Socket`.
     *
     * There is no support for renegotiation as a server. (Attempts by clients will result in a fatal alert so that ClientHello messages cannot be used to flood a server and escape higher-level limits.)
     */
    disableRenegotiation(): void;

    /**
     * Keying material is used for validations to prevent different kind of attacks in
     * network protocols, for example in the specifications of IEEE 802.1X.
     *
     * Example
     *
     * ```js
     * const keyingMaterial = socket.exportKeyingMaterial(
     *   128,
     *   'client finished');
     *
     * /*
     *  Example return value of keyingMaterial:
     *  <Buffer 76 26 af 99 c5 56 8e 42 09 91 ef 9f 93 cb ad 6c 7b 65 f8 53 f1 d8 d9
     *     12 5a 33 b8 b5 25 df 7b 37 9f e0 e2 4f b8 67 83 a3 2f cd 5d 41 42 4c 91
     *     74 ef 2c ... 78 more bytes>
     *
     * ```
     *
     * @param length number of bytes to retrieve from keying material
     * @param label an application specific label, typically this will be a value from the [IANA Exporter Label
     * Registry](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#exporter-labels).
     * @param context Optionally provide a context.
     * @return requested bytes of the keying material
     */
    exportKeyingMaterial(length: number, label: string, context: Buffer): Buffer;

    /**
     * Returns the reason why the peer's certificate was not been verified. This
     * property is set only when `socket.authorized === false`.
     */
    getAuthorizationError(): Error | null;

    /**
     * Returns an object representing the local certificate. The returned object has
     * some properties corresponding to the fields of the certificate.
     *
     * If there is no local certificate, an empty object will be returned. If the
     * socket has been destroyed, `null` will be returned.
     */
    getCertificate(): import("tls").PeerCertificate | object | null;
    getX509Certificate(): import("node:crypto").X509Certificate | undefined;

    /**
     * Returns an object containing information on the negotiated cipher suite.
     *
     * For example, a TLSv1.2 protocol with AES256-SHA cipher:
     *
     * ```json
     * {
     *     "name": "AES256-SHA",
     *     "standardName": "TLS_RSA_WITH_AES_256_CBC_SHA",
     *     "version": "SSLv3"
     * }
     * ```
     *
     */
    getCipher(): import("tls").CipherNameAndProtocol;

    /**
     * Returns an object representing the type, name, and size of parameter of
     * an ephemeral key exchange in `perfect forward secrecy` on a client
     * connection. It returns an empty object when the key exchange is not
     * ephemeral. As this is only supported on a client socket; `null` is returned
     * if called on a server socket. The supported types are `'DH'` and `'ECDH'`. The`name` property is available only when type is `'ECDH'`.
     *
     * For example: `{ type: 'ECDH', name: 'prime256v1', size: 256 }`.
     */
    getEphemeralKeyInfo(): import("tls").EphemeralKeyInfo | object | null;

    /**
     * Returns an object representing the peer's certificate. If the peer does not
     * provide a certificate, an empty object will be returned. If the socket has been
     * destroyed, `null` will be returned.
     *
     * If the full certificate chain was requested, each certificate will include an`issuerCertificate` property containing an object representing its issuer's
     * certificate.
     * @return A certificate object.
     */
    getPeerCertificate(): import("node:tls").PeerCertificate;
    getPeerX509Certificate(): import("node:crypto").X509Certificate;

    /**
     * See [SSL\_get\_shared\_sigalgs](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_shared_sigalgs.html) for more information.
     * @since v12.11.0
     * @return List of signature algorithms shared between the server and the client in the order of decreasing preference.
     */
    getSharedSigalgs(): string[];

    /**
     * As the `Finished` messages are message digests of the complete handshake
     * (with a total of 192 bits for TLS 1.0 and more for SSL 3.0), they can
     * be used for external authentication procedures when the authentication
     * provided by SSL/TLS is not desired or is not enough.
     *
     * @return The latest `Finished` message that has been sent to the socket as part of a SSL/TLS handshake, or `undefined` if no `Finished` message has been sent yet.
     */
    getTLSFinishedMessage(): Buffer | undefined;

    /**
     * As the `Finished` messages are message digests of the complete handshake
     * (with a total of 192 bits for TLS 1.0 and more for SSL 3.0), they can
     * be used for external authentication procedures when the authentication
     * provided by SSL/TLS is not desired or is not enough.
     *
     * @return The latest `Finished` message that is expected or has actually been received from the socket as part of a SSL/TLS handshake, or `undefined` if there is no `Finished` message so
     * far.
     */
    getTLSPeerFinishedMessage(): Buffer | undefined;

    /**
     * For a client, returns the TLS session ticket if one is available, or`undefined`. For a server, always returns `undefined`.
     *
     * It may be useful for debugging.
     *
     * See `Session Resumption` for more information.
     */
    getTLSTicket(): Buffer | undefined;

    /**
     * Returns a string containing the negotiated SSL/TLS protocol version of the
     * current connection. The value `'unknown'` will be returned for connected
     * sockets that have not completed the handshaking process. The value `null` will
     * be returned for server sockets or disconnected client sockets.
     *
     * Protocol versions are:
     *
     * * `'SSLv3'`
     * * `'TLSv1'`
     * * `'TLSv1.1'`
     * * `'TLSv1.2'`
     * * `'TLSv1.3'`
     *
     */
    getTLSVersion(): string;

    /**
     * See `Session Resumption` for more information.
     * @return `true` if the session was reused, `false` otherwise.
     * **TLS Only:** Checks if the current TLS session was resumed from a previous session.
     * Returns `true` if the session was resumed, `false` otherwise.
     */
    isSessionReused(): boolean;

    /**
     * The `socket.setMaxSendFragment()` method sets the maximum TLS fragment size.
     * Returns `true` if setting the limit succeeded; `false` otherwise.
     *
     * Smaller fragment sizes decrease the buffering latency on the client: larger
     * fragments are buffered by the TLS layer until the entire fragment is received
     * and its integrity is verified; large fragments can span multiple roundtrips
     * and their processing can be delayed due to packet loss or reordering. However,
     * smaller fragments add extra TLS framing bytes and CPU overhead, which may
     * decrease overall server throughput.
     * @param [size=16384] The maximum TLS fragment size. The maximum value is `16384`.
     */
    setMaxSendFragment(size: number): boolean;

    /**
     * Enable/disable the use of Nagle's algorithm.
     * Only available for already connected sockets, will return false otherwise
     * @param noDelay Default: `true`
     * @returns true if is able to setNoDelay and false if it fails.
     */
    setNoDelay(noDelay?: boolean): boolean;

    /**
     * Enable/disable keep-alive functionality, and optionally set the initial delay before the first keepalive probe is sent on an idle socket.
     * Set `initialDelay` (in milliseconds) to set the delay between the last data packet received and the first keepalive probe.
     * Only available for already connected sockets, will return false otherwise.
     *
     * Enabling the keep-alive functionality will set the following socket options:
     * SO_KEEPALIVE=1
     * TCP_KEEPIDLE=initialDelay
     * TCP_KEEPCNT=10
     * TCP_KEEPINTVL=1
     * @param enable Default: `false`
     * @param initialDelay Default: `0`
     * @returns true if is able to setNoDelay and false if it fails.
     */
    setKeepAlive(enable?: boolean, initialDelay?: number): boolean;

    /**
     * The total number of bytes successfully written to the socket since it was established.
     * This includes data currently buffered by the OS but not yet acknowledged by the remote peer.
     */
    readonly bytesWritten: number;

    /**
     * Alias for `socket.end()`. Allows the socket to be used with `using` declarations
     * for automatic resource management.
     * @example
     * ```ts
     * async function processSocket() {
     *   using socket = await Bun.connect({ ... });
     *   socket.write("Data");
     *   // socket.end() is called automatically when exiting the scope
     * }
     * ```
     */
    [Symbol.dispose](): void;

    resume(): void;

    pause(): void;

    /**
     * If this is a TLS Socket
     */
    renegotiate(): void;

    /**
     * Sets the verify mode of the socket.
     *
     * @param requestCert Whether to request a certificate.
     * @param rejectUnauthorized Whether to reject unauthorized certificates.
     */
    setVerifyMode(requestCert: boolean, rejectUnauthorized: boolean): void;

    getSession(): void;

    /**
     * Sets the session of the socket.
     *
     * @param session The session to set.
     */
    setSession(session: string | Buffer | BufferSource): void;

    /**
     * Exports the keying material of the socket.
     *
     * @param length The length of the keying material to export.
     * @param label The label of the keying material to export.
     * @param context The context of the keying material to export.
     */
    exportKeyingMaterial(length: number, label: string, context?: string | BufferSource): void;

    /**
     * Upgrades the socket to a TLS socket.
     *
     * @param options The options for the upgrade.
     * @returns A tuple containing the raw socket and the TLS socket.
     * @see {@link TLSUpgradeOptions}
     */
    upgradeTLS<Data>(options: TLSUpgradeOptions<Data>): [raw: Socket<Data>, tls: Socket<Data>];

    /**
     * Closes the socket.
     *
     * This is a wrapper around `end()` and `shutdown()`.
     *
     * @see {@link end}
     * @see {@link shutdown}
     */
    close(): void;

    /**
     * Returns the servername of the socket.
     *
     * @see {@link setServername}
     */
    getServername(): string;

    /**
     * Sets the servername of the socket.
     *
     * @see {@link getServername}
     */
    setServername(name: string): void;
  }

  interface TLSUpgradeOptions<Data> {
    data?: Data;
    tls: TLSOptions | boolean;
    socket: SocketHandler<Data>;
  }

  interface SocketListener<Data = undefined> extends Disposable {
    stop(closeActiveConnections?: boolean): void;
    ref(): void;
    unref(): void;
    reload(options: Pick<Partial<SocketOptions>, "socket">): void;
    data: Data;
  }
  interface TCPSocketListener<Data = unknown> extends SocketListener<Data> {
    readonly port: number;
    readonly hostname: string;
  }
  interface UnixSocketListener<Data> extends SocketListener<Data> {
    readonly unix: string;
  }

  interface TCPSocket extends Socket {}
  interface TLSSocket extends Socket {}

  interface BinaryTypeList {
    arraybuffer: ArrayBuffer;
    buffer: Buffer;
    uint8array: Uint8Array;
    // TODO: DataView
    // dataview: DataView;
  }
  type BinaryType = keyof BinaryTypeList;

  interface SocketHandler<Data = unknown, DataBinaryType extends BinaryType = "buffer"> {
    /**
     * Is called when the socket connects, or in case of TLS if no handshake is provided
     * this will be called only after handshake
     * @param socket
     */
    open?(socket: Socket<Data>): void | Promise<void>;
    close?(socket: Socket<Data>, error?: Error): void | Promise<void>;
    error?(socket: Socket<Data>, error: Error): void | Promise<void>;
    data?(socket: Socket<Data>, data: BinaryTypeList[DataBinaryType]): void | Promise<void>;
    drain?(socket: Socket<Data>): void | Promise<void>;

    /**
     * When handshake is completed, this functions is called.
     * @param socket
     * @param success Indicates if the server authorized despite the authorizationError.
     * @param authorizationError Certificate Authorization Error or null.
     */
    handshake?(socket: Socket<Data>, success: boolean, authorizationError: Error | null): void;

    /**
     * When the socket has been shutdown from the other end, this function is
     * called. This is a TCP FIN packet.
     */
    end?(socket: Socket<Data>): void | Promise<void>;

    /**
     * When the socket fails to be created, this function is called.
     *
     * The promise returned by `Bun.connect` rejects **after** this function is
     * called.
     *
     * When `connectError` is specified, the rejected promise will not be
     * added to the promise rejection queue (so it won't be reported as an
     * unhandled promise rejection, since connectError handles it).
     *
     * When `connectError` is not specified, the rejected promise will be added
     * to the promise rejection queue.
     */
    connectError?(socket: Socket<Data>, error: Error): void | Promise<void>;

    /**
     * Called when a message times out.
     */
    timeout?(socket: Socket<Data>): void | Promise<void>;
    /**
     * Choose what `ArrayBufferView` is returned in the {@link SocketHandler.data} callback.
     *
     * @default "buffer"
     *
     * @remarks
     * This lets you select the desired binary type for the `data` callback.
     * It's a small performance optimization to let you avoid creating extra
     * ArrayBufferView objects when possible.
     *
     * Bun originally defaulted to `Uint8Array` but when dealing with network
     * data, it's more useful to be able to directly read from the bytes which
     * `Buffer` allows.
     */
    binaryType?: BinaryType;
  }

  interface SocketOptions<Data = unknown> {
    /**
     * Handlers for socket events
     */
    socket: SocketHandler<Data>;
    /**
     * The per-instance data context
     */
    data?: Data;
    /**
     * Whether to allow half-open connections.
     *
     * A half-open connection occurs when one end of the connection has called `close()`
     * or sent a FIN packet, while the other end remains open. When set to `true`:
     *
     * - The socket won't automatically send FIN when the remote side closes its end
     * - The local side can continue sending data even after the remote side has closed
     * - The application must explicitly call `end()` to fully close the connection
     *
     * When `false`, the socket automatically closes both ends of the connection when
     * either side closes.
     *
     * @default false
     */
    allowHalfOpen?: boolean;
  }

  interface TCPSocketListenOptions<Data = undefined> extends SocketOptions<Data> {
    /**
     * The hostname to listen on
     */
    hostname: string;
    /**
     * The port to listen on
     */
    port: number;
    /**
     * The TLS configuration object with which to create the server
     */
    tls?: TLSOptions | boolean;
    /**
     * Whether to use exclusive mode.
     *
     * When set to `true`, the socket binds exclusively to the specified address:port
     * combination, preventing other processes from binding to the same port.
     *
     * When `false` (default), other sockets may be able to bind to the same port
     * depending on the operating system's socket sharing capabilities and settings.
     *
     * Exclusive mode is useful in scenarios where you want to ensure only one
     * instance of your server can bind to a specific port at a time.
     *
     * @default false
     */
    exclusive?: boolean;
    /**
     * Whether to allow half-open connections.
     *
     * A half-open connection occurs when one end of the connection has called `close()`
     * or sent a FIN packet, while the other end remains open. When set to `true`:
     *
     * - The socket won't automatically send FIN when the remote side closes its end
     * - The local side can continue sending data even after the remote side has closed
     * - The application must explicitly call `end()` to fully close the connection
     *
     * When `false` (default), the socket automatically closes both ends of the connection
     * when either side closes.
     *
     * @default false
     */
    allowHalfOpen?: boolean;
  }

  interface TCPSocketConnectOptions<Data = undefined> extends SocketOptions<Data> {
    /**
     * The hostname to connect to
     */
    hostname: string;
    /**
     * The port to connect to
     */
    port: number;
    /**
     * TLS Configuration with which to create the socket
     */
    tls?: TLSOptions | boolean;
    /**
     * Whether to use exclusive mode.
     *
     * When set to `true`, the socket binds exclusively to the specified address:port
     * combination, preventing other processes from binding to the same port.
     *
     * When `false` (default), other sockets may be able to bind to the same port
     * depending on the operating system's socket sharing capabilities and settings.
     *
     * Exclusive mode is useful in scenarios where you want to ensure only one
     * instance of your server can bind to a specific port at a time.
     *
     * @default false
     */
    exclusive?: boolean;
    reusePort?: boolean;
    ipv6Only?: boolean;
  }

  interface UnixSocketOptions<Data = undefined> extends SocketOptions<Data> {
    /**
     * The unix socket to listen on or connect to
     */
    unix: string;
    /**
     * TLS Configuration with which to create the socket
     */
    tls?: TLSOptions | boolean;
  }

  interface FdSocketOptions<Data = undefined> extends SocketOptions<Data> {
    /**
     * TLS Configuration with which to create the socket
     */
    tls?: TLSOptions | boolean;
    /**
     * The file descriptor to connect to
     */
    fd: number;
  }

  /**
   * Create a TCP client that connects to a server via a TCP socket
   *
   * @category HTTP & Networking
   */
  function connect<Data = undefined>(options: TCPSocketConnectOptions<Data>): Promise<Socket<Data>>;
  /**
   * Create a TCP client that connects to a server via a unix socket
   *
   * @category HTTP & Networking
   */
  function connect<Data = undefined>(options: UnixSocketOptions<Data>): Promise<Socket<Data>>;

  /**
   * Create a TCP server that listens on a port
   *
   * @category HTTP & Networking
   */
  function listen<Data = undefined>(options: TCPSocketListenOptions<Data>): TCPSocketListener<Data>;
  /**
   * Create a TCP server that listens on a unix socket
   *
   * @category HTTP & Networking
   */
  function listen<Data = undefined>(options: UnixSocketOptions<Data>): UnixSocketListener<Data>;

  /**
   * @category HTTP & Networking
   */
  namespace udp {
    type Data = string | ArrayBufferView | ArrayBufferLike;

    export interface SocketHandler<DataBinaryType extends BinaryType> {
      data?(
        socket: Socket<DataBinaryType>,
        data: BinaryTypeList[DataBinaryType],
        port: number,
        address: string,
      ): void | Promise<void>;
      drain?(socket: Socket<DataBinaryType>): void | Promise<void>;
      error?(socket: Socket<DataBinaryType>, error: Error): void | Promise<void>;
    }

    export interface ConnectedSocketHandler<DataBinaryType extends BinaryType> {
      data?(
        socket: ConnectedSocket<DataBinaryType>,
        data: BinaryTypeList[DataBinaryType],
        port: number,
        address: string,
      ): void | Promise<void>;
      drain?(socket: ConnectedSocket<DataBinaryType>): void | Promise<void>;
      error?(socket: ConnectedSocket<DataBinaryType>, error: Error): void | Promise<void>;
    }

    export interface SocketOptions<DataBinaryType extends BinaryType> {
      hostname?: string;
      port?: number;
      binaryType?: DataBinaryType;
      socket?: SocketHandler<DataBinaryType>;
    }

    export interface ConnectSocketOptions<DataBinaryType extends BinaryType> {
      hostname?: string;
      port?: number;
      binaryType?: DataBinaryType;
      socket?: ConnectedSocketHandler<DataBinaryType>;
      connect: {
        hostname: string;
        port: number;
      };
    }

    export interface BaseUDPSocket {
      readonly hostname: string;
      readonly port: number;
      readonly address: SocketAddress;
      readonly binaryType: BinaryType;
      readonly closed: boolean;
      ref(): void;
      unref(): void;
      close(): void;
    }

    export interface ConnectedSocket<DataBinaryType extends BinaryType> extends BaseUDPSocket {
      readonly remoteAddress: SocketAddress;
      sendMany(packets: readonly Data[]): number;
      send(data: Data): boolean;
      reload(handler: ConnectedSocketHandler<DataBinaryType>): void;
    }

    export interface Socket<DataBinaryType extends BinaryType> extends BaseUDPSocket {
      sendMany(packets: readonly (Data | string | number)[]): number;
      send(data: Data, port: number, address: string): boolean;
      reload(handler: SocketHandler<DataBinaryType>): void;
    }
  }

  /**
   * Create a UDP socket
   *
   * @param options The options to use when creating the server
   * @param options.socket The socket handler to use
   * @param options.hostname The hostname to listen on
   * @param options.port The port to listen on
   * @param options.binaryType The binary type to use for the socket
   * @param options.connect The hostname and port to connect to
   *
   * @category HTTP & Networking
   */
  export function udpSocket<DataBinaryType extends BinaryType = "buffer">(
    options: udp.SocketOptions<DataBinaryType>,
  ): Promise<udp.Socket<DataBinaryType>>;
  export function udpSocket<DataBinaryType extends BinaryType = "buffer">(
    options: udp.ConnectSocketOptions<DataBinaryType>,
  ): Promise<udp.ConnectedSocket<DataBinaryType>>;

  namespace SpawnOptions {
    /**
     * Option for stdout/stderr
     */
    type Readable =
      | "pipe"
      | "inherit"
      | "ignore"
      | null // equivalent to "ignore"
      | undefined // to use default
      | BunFile
      | ArrayBufferView
      | number;

    /**
     * Option for stdin
     */
    type Writable =
      | "pipe"
      | "inherit"
      | "ignore"
      | null // equivalent to "ignore"
      | undefined // to use default
      | BunFile
      | ArrayBufferView
      | number
      | ReadableStream
      | Blob
      | Response
      | Request;

    interface OptionsObject<In extends Writable, Out extends Readable, Err extends Readable> {
      /**
       * The current working directory of the process
       *
       * Defaults to `process.cwd()`
       */
      cwd?: string;

      /**
       * The environment variables of the process
       *
       * Defaults to `process.env` as it was when the current Bun process launched.
       *
       * Changes to `process.env` at runtime won't automatically be reflected in the default value. For that, you can pass `process.env` explicitly.
       */
      env?: Record<string, string | undefined>;

      /**
       * The standard file descriptors of the process, in the form [stdin, stdout, stderr].
       * This overrides the `stdin`, `stdout`, and `stderr` properties.
       *
       * For stdin you may pass:
       *
       * - `"ignore"`, `null`, `undefined`: The process will have no standard input (default)
       * - `"pipe"`: The process will have a new {@link FileSink} for standard input
       * - `"inherit"`: The process will inherit the standard input of the current process
       * - `ArrayBufferView`, `Blob`, `Bun.file()`, `Response`, `Request`: The process will read from buffer/stream.
       * - `number`: The process will read from the file descriptor
       *
       * For stdout and stdin you may pass:
       *
       * - `"pipe"`, `undefined`: The process will have a {@link BunReadableStream} for standard output/error
       * - `"ignore"`, `null`: The process will have no standard output/error
       * - `"inherit"`: The process will inherit the standard output/error of the current process
       * - `ArrayBufferView`: The process write to the preallocated buffer. Not implemented.
       * - `number`: The process will write to the file descriptor
       *
       * @default ["ignore", "pipe", "inherit"] for `spawn`
       * ["ignore", "pipe", "pipe"] for `spawnSync`
       */
      stdio?: [In, Out, Err, ...Readable[]];

      /**
       * The file descriptor for the standard input. It may be:
       *
       * - `"ignore"`, `null`, `undefined`: The process will have no standard input
       * - `"pipe"`: The process will have a new {@link FileSink} for standard input
       * - `"inherit"`: The process will inherit the standard input of the current process
       * - `ArrayBufferView`, `Blob`: The process will read from the buffer
       * - `number`: The process will read from the file descriptor
       *
       * @default "ignore"
       */
      stdin?: In;
      /**
       * The file descriptor for the standard output. It may be:
       *
       * - `"pipe"`, `undefined`: The process will have a {@link BunReadableStream} for standard output/error
       * - `"ignore"`, `null`: The process will have no standard output/error
       * - `"inherit"`: The process will inherit the standard output/error of the current process
       * - `ArrayBufferView`: The process write to the preallocated buffer. Not implemented.
       * - `number`: The process will write to the file descriptor
       *
       * @default "pipe"
       */
      stdout?: Out;
      /**
       * The file descriptor for the standard error. It may be:
       *
       * - `"pipe"`, `undefined`: The process will have a {@link BunReadableStream} for standard output/error
       * - `"ignore"`, `null`: The process will have no standard output/error
       * - `"inherit"`: The process will inherit the standard output/error of the current process
       * - `ArrayBufferView`: The process write to the preallocated buffer. Not implemented.
       * - `number`: The process will write to the file descriptor
       *
       * @default "inherit" for `spawn`
       * "pipe" for `spawnSync`
       */
      stderr?: Err;

      /**
       * Callback that runs when the {@link Subprocess} exits
       *
       * This is called even if the process exits with a non-zero exit code.
       *
       * Warning: this may run before the `Bun.spawn` function returns.
       *
       * A simple alternative is `await subprocess.exited`.
       *
       * @example
       *
       * ```ts
       * const subprocess = spawn({
       *  cmd: ["echo", "hello"],
       *  onExit: (subprocess, code) => {
       *    console.log(`Process exited with code ${code}`);
       *   },
       * });
       * ```
       */
      onExit?(
        subprocess: Subprocess<In, Out, Err>,
        exitCode: number | null,
        signalCode: number | null,
        /**
         * If an error occurred in the call to waitpid2, this will be the error.
         */
        error?: ErrorLike,
      ): void | Promise<void>;

      /**
       * When specified, Bun will open an IPC channel to the subprocess. The passed callback is called for
       * incoming messages, and `subprocess.send` can send messages to the subprocess. Messages are serialized
       * using the JSC serialize API, which allows for the same types that `postMessage`/`structuredClone` supports.
       *
       * The subprocess can send and receive messages by using `process.send` and `process.on("message")`,
       * respectively. This is the same API as what Node.js exposes when `child_process.fork()` is used.
       *
       * Currently, this is only compatible with processes that are other `bun` instances.
       */
      ipc?(
        message: any,
        /**
         * The {@link Subprocess} that received the message
         */
        subprocess: Subprocess<In, Out, Err>,
        handle?: unknown,
      ): void;

      /**
       * The serialization format to use for IPC messages. Defaults to `"advanced"`.
       *
       * To communicate with Node.js processes, use `"json"`.
       *
       * When `ipc` is not specified, this is ignored.
       */
      serialization?: "json" | "advanced";

      /**
       * If true, the subprocess will have a hidden window.
       */
      windowsHide?: boolean;

      /**
       * If true, no quoting or escaping of arguments is done on Windows.
       */
      windowsVerbatimArguments?: boolean;

      /**
       * Path to the executable to run in the subprocess. This defaults to `cmds[0]`.
       *
       * One use-case for this is for applications which wrap other applications or to simulate a symlink.
       *
       * @default cmds[0]
       */
      argv0?: string;

      /**
       * An {@link AbortSignal} that can be used to abort the subprocess.
       *
       * This is useful for aborting a subprocess when some other part of the
       * program is aborted, such as a `fetch` response.
       *
       * If the signal is aborted, the process will be killed with the signal
       * specified by `killSignal` (defaults to SIGTERM).
       *
       * @example
       * ```ts
       * const controller = new AbortController();
       * const { signal } = controller;
       * const start = performance.now();
       * const subprocess = Bun.spawn({
       *  cmd: ["sleep", "100"],
       *  signal,
       * });
       * await Bun.sleep(1);
       * controller.abort();
       * await subprocess.exited;
       * const end = performance.now();
       * console.log(end - start); // 1ms instead of 101ms
       * ```
       */
      signal?: AbortSignal;

      /**
       * The maximum amount of time the process is allowed to run in milliseconds.
       *
       * If the timeout is reached, the process will be killed with the signal
       * specified by `killSignal` (defaults to SIGTERM).
       *
       * @example
       * ```ts
       * // Kill the process after 5 seconds
       * const subprocess = Bun.spawn({
       *   cmd: ["sleep", "10"],
       *   timeout: 5000,
       * });
       * await subprocess.exited; // Will resolve after 5 seconds
       * ```
       */
      timeout?: number;

      /**
       * The signal to use when killing the process after a timeout, when the AbortSignal is aborted,
       * or when the process goes over the `maxBuffer` limit.
       *
       * @default "SIGTERM" (signal 15)
       *
       * @example
       * ```ts
       * // Kill the process with SIGKILL after 5 seconds
       * const subprocess = Bun.spawn({
       *   cmd: ["sleep", "10"],
       *   timeout: 5000,
       *   killSignal: "SIGKILL",
       * });
       * ```
       */
      killSignal?: string | number;

      /**
       * The maximum number of bytes the process may output. If the process goes over this limit,
       * it is killed with signal `killSignal` (defaults to SIGTERM).
       *
       * @default undefined (no limit)
       */
      maxBuffer?: number;
    }

    type ReadableIO = ReadableStream<Uint8Array> | number | undefined;

    type ReadableToIO<X extends Readable> = X extends "pipe" | undefined
      ? BunReadableStream
      : X extends BunFile | ArrayBufferView | number
        ? number
        : undefined;

    type ReadableToSyncIO<X extends Readable> = X extends "pipe" | undefined ? Buffer : undefined;

    type WritableIO = FileSink | number | undefined;

    type WritableToIO<X extends Writable> = X extends "pipe"
      ? FileSink
      : X extends BunFile | ArrayBufferView | Blob | Request | Response | number
        ? number
        : undefined;
  }

  interface ResourceUsage {
    /**
     * The number of voluntary and involuntary context switches that the process made.
     */
    contextSwitches: {
      /**
       * Voluntary context switches (context switches that the process initiated).
       */
      voluntary: number;
      /**
       * Involuntary context switches (context switches initiated by the system scheduler).
       */
      involuntary: number;
    };

    /**
     * The amount of CPU time used by the process, in microseconds.
     */
    cpuTime: {
      /**
       * User CPU time used by the process, in microseconds.
       */
      user: number;
      /**
       * System CPU time used by the process, in microseconds.
       */
      system: number;
      /**
       * Total CPU time used by the process, in microseconds.
       */
      total: number;
    };
    /**
     * The maximum amount of resident set size (in bytes) used by the process during its lifetime.
     */
    maxRSS: number;

    /**
     * IPC messages sent and received by the process.
     */
    messages: {
      /**
       * The number of IPC messages sent.
       */
      sent: number;
      /**
       * The number of IPC messages received.
       */
      received: number;
    };
    /**
     * The number of IO operations done by the process.
     */
    ops: {
      /**
       * The number of input operations via the file system.
       */
      in: number;
      /**
       * The number of output operations via the file system.
       */
      out: number;
    };
    /**
     * The amount of shared memory that the process used.
     */
    shmSize: number;
    /**
     * The number of signals delivered to the process.
     */
    signalCount: number;
    /**
     *  The number of times the process was swapped out of main memory.
     */
    swapCount: number;
  }

  /**
   * A process created by {@link Bun.spawn}.
   *
   * This type accepts 3 optional type parameters which correspond to the `stdio` array from the options object. Instead of specifying these, you should use one of the following utility types instead:
   * - {@link ReadableSubprocess} (any, pipe, pipe)
   * - {@link WritableSubprocess} (pipe, any, any)
   * - {@link PipedSubprocess} (pipe, pipe, pipe)
   * - {@link NullSubprocess} (ignore, ignore, ignore)
   */
  interface Subprocess<
    In extends SpawnOptions.Writable = SpawnOptions.Writable,
    Out extends SpawnOptions.Readable = SpawnOptions.Readable,
    Err extends SpawnOptions.Readable = SpawnOptions.Readable,
  > extends AsyncDisposable {
    readonly stdin: SpawnOptions.WritableToIO<In>;
    readonly stdout: SpawnOptions.ReadableToIO<Out>;
    readonly stderr: SpawnOptions.ReadableToIO<Err>;

    /**
     * Access extra file descriptors passed to the `stdio` option in the options object.
     */
    readonly stdio: [null, null, null, ...number[]];

    /**
     * This returns the same value as {@link Subprocess.stdout}
     *
     * It exists for compatibility with {@link ReadableStream.pipeThrough}
     */
    readonly readable: SpawnOptions.ReadableToIO<Out>;

    /**
     * The process ID of the child process
     * @example
     * ```ts
     * const { pid } = Bun.spawn({ cmd: ["echo", "hello"] });
     * console.log(pid); // 1234
     * ```
     */
    readonly pid: number;

    /**
     * The exit code of the process
     *
     * The promise will resolve when the process exits
     */
    readonly exited: Promise<number>;

    /**
     * Synchronously get the exit code of the process
     *
     * If the process hasn't exited yet, this will return `null`
     */
    readonly exitCode: number | null;

    /**
     * Synchronously get the signal code of the process
     *
     * If the process never sent a signal code, this will return `null`
     *
     * To receive signal code changes, use the `onExit` callback.
     *
     * If the signal code is unknown, it will return the original signal code
     * number, but that case should essentially never happen.
     */
    readonly signalCode: NodeJS.Signals | null;

    /**
     * Has the process exited?
     */
    readonly killed: boolean;

    /**
     * Kill the process
     * @param exitCode The exitCode to send to the process
     */
    kill(exitCode?: number | NodeJS.Signals): void;

    /**
     * This method will tell Bun to wait for this process to exit after you already
     * called `unref()`.
     *
     * Before shutting down, Bun will wait for all subprocesses to exit by default
     */
    ref(): void;

    /**
     * Before shutting down, Bun will wait for all subprocesses to exit by default
     *
     * This method will tell Bun to not wait for this process to exit before shutting down.
     */
    unref(): void;

    /**
     * Send a message to the subprocess. This is only supported if the subprocess
     * was created with the `ipc` option, and is another instance of `bun`.
     *
     * Messages are serialized using the JSC serialize API, which allows for the same types that `postMessage`/`structuredClone` supports.
     */
    send(message: any): void;

    /**
     * Disconnect the IPC channel to the subprocess. This is only supported if the subprocess
     * was created with the `ipc` option.
     */
    disconnect(): void;

    /**
     * Get the resource usage information of the process (max RSS, CPU time, etc)
     *
     * Only available after the process has exited
     *
     * If the process hasn't exited yet, this will return `undefined`
     */
    resourceUsage(): ResourceUsage | undefined;
  }

  /**
   * A process created by {@link Bun.spawnSync}.
   *
   * This type accepts 2 optional type parameters which correspond to the `stdout` and `stderr` options. Instead of specifying these, you should use one of the following utility types instead:
   * - {@link ReadableSyncSubprocess} (pipe, pipe)
   * - {@link NullSyncSubprocess} (ignore, ignore)
   */
  interface SyncSubprocess<
    Out extends SpawnOptions.Readable = SpawnOptions.Readable,
    Err extends SpawnOptions.Readable = SpawnOptions.Readable,
  > {
    stdout: SpawnOptions.ReadableToSyncIO<Out>;
    stderr: SpawnOptions.ReadableToSyncIO<Err>;
    exitCode: number;
    success: boolean;
    /**
     * Get the resource usage information of the process (max RSS, CPU time, etc)
     */
    resourceUsage: ResourceUsage;

    signalCode?: string;
    exitedDueToTimeout?: boolean;
    exitedDueToMaxBuffer?: boolean;
    pid: number;
  }

  /**
   * Spawn a new process
   *
   * @category Process Management
   *
   * ```js
   * const subprocess = Bun.spawn({
   *  cmd: ["echo", "hello"],
   *  stdout: "pipe",
   * });
   * const text = await readableStreamToText(subprocess.stdout);
   * console.log(text); // "hello\n"
   * ```
   *
   * Internally, this uses [posix_spawn(2)](https://developer.apple.com/library/archive/documentation/System/Conceptual/ManPages_iPhoneOS/man2/posix_spawn.2.html)
   */
  function spawn<
    const In extends SpawnOptions.Writable = "ignore",
    const Out extends SpawnOptions.Readable = "pipe",
    const Err extends SpawnOptions.Readable = "inherit",
  >(
    options: SpawnOptions.OptionsObject<In, Out, Err> & {
      /**
       * The command to run
       *
       * The first argument will be resolved to an absolute executable path. It must be a file, not a directory.
       *
       * If you explicitly set `PATH` in `env`, that `PATH` will be used to resolve the executable instead of the default `PATH`.
       *
       * To check if the command exists before running it, use `Bun.which(bin)`.
       *
       * @example
       * ```ts
       * const subprocess = Bun.spawn(["echo", "hello"]);
       * ```
       */
      cmd: string[]; // to support dynamically constructed commands
    },
  ): Subprocess<In, Out, Err>;

  /**
   * Spawn a new process
   *
   * ```js
   * const {stdout} = Bun.spawn(["echo", "hello"]);
   * const text = await readableStreamToText(stdout);
   * console.log(text); // "hello\n"
   * ```
   *
   * Internally, this uses [posix_spawn(2)](https://developer.apple.com/library/archive/documentation/System/Conceptual/ManPages_iPhoneOS/man2/posix_spawn.2.html)
   */
  function spawn<
    const In extends SpawnOptions.Writable = "ignore",
    const Out extends SpawnOptions.Readable = "pipe",
    const Err extends SpawnOptions.Readable = "inherit",
  >(
    /**
     * The command to run
     *
     * The first argument will be resolved to an absolute executable path. It must be a file, not a directory.
     *
     * If you explicitly set `PATH` in `env`, that `PATH` will be used to resolve the executable instead of the default `PATH`.
     *
     * To check if the command exists before running it, use `Bun.which(bin)`.
     *
     * @example
     * ```ts
     * const subprocess = Bun.spawn(["echo", "hello"]);
     * ```
     */
    cmds: string[],
    options?: SpawnOptions.OptionsObject<In, Out, Err>,
  ): Subprocess<In, Out, Err>;

  /**
   * Spawn a new process
   *
   * @category Process Management
   *
   * ```js
   * const {stdout} = Bun.spawnSync({
   *  cmd: ["echo", "hello"],
   * });
   * console.log(stdout.toString()); // "hello\n"
   * ```
   *
   * Internally, this uses [posix_spawn(2)](https://developer.apple.com/library/archive/documentation/System/Conceptual/ManPages_iPhoneOS/man2/posix_spawn.2.html)
   */
  function spawnSync<
    const Out extends SpawnOptions.Readable = "pipe",
    const Err extends SpawnOptions.Readable = "inherit",
  >(
    options: SpawnOptions.OptionsObject<"ignore", Out, Err> & {
      /**
       * The command to run
       *
       * The first argument will be resolved to an absolute executable path. It must be a file, not a directory.
       *
       * If you explicitly set `PATH` in `env`, that `PATH` will be used to resolve the executable instead of the default `PATH`.
       *
       * To check if the command exists before running it, use `Bun.which(bin)`.
       *
       * @example
       * ```ts
       * const subprocess = Bun.spawnSync({ cmd: ["echo", "hello"] });
       * ```
       */
      cmd: string[];

      onExit?: never;
    },
  ): SyncSubprocess<Out, Err>;

  /**
   * Synchronously spawn a new process
   *
   * ```js
   * const {stdout} = Bun.spawnSync(["echo", "hello"]);
   * console.log(stdout.toString()); // "hello\n"
   * ```
   *
   * Internally, this uses [posix_spawn(2)](https://developer.apple.com/library/archive/documentation/System/Conceptual/ManPages_iPhoneOS/man2/posix_spawn.2.html)
   */
  function spawnSync<
    const Out extends SpawnOptions.Readable = "pipe",
    const Err extends SpawnOptions.Readable = "inherit",
  >(
    /**
     * The command to run
     *
     * The first argument will be resolved to an absolute executable path. It must be a file, not a directory.
     *
     * If you explicitly set `PATH` in `env`, that `PATH` will be used to resolve the executable instead of the default `PATH`.
     *
     * To check if the command exists before running it, use `Bun.which(bin)`.
     *
     * @example
     * ```ts
     * const subprocess = Bun.spawnSync(["echo", "hello"]);
     * ```
     */
    cmds: string[],
    options?: SpawnOptions.OptionsObject<"ignore", Out, Err>,
  ): SyncSubprocess<Out, Err>;

  /** Utility type for any process from {@link Bun.spawn()} with both stdout and stderr set to `"pipe"` */
  type ReadableSubprocess = Subprocess<any, "pipe", "pipe">;
  /** Utility type for any process from {@link Bun.spawn()} with stdin set to `"pipe"` */
  type WritableSubprocess = Subprocess<"pipe", any, any>;
  /** Utility type for any process from {@link Bun.spawn()} with stdin, stdout, stderr all set to `"pipe"`. A combination of {@link ReadableSubprocess} and {@link WritableSubprocess} */
  type PipedSubprocess = Subprocess<"pipe", "pipe", "pipe">;
  /** Utility type for any process from {@link Bun.spawn()} with stdin, stdout, stderr all set to `null` or similar. */
  type NullSubprocess = Subprocess<
    "ignore" | "inherit" | null | undefined,
    "ignore" | "inherit" | null | undefined,
    "ignore" | "inherit" | null | undefined
  >;
  /** Utility type for any process from {@link Bun.spawnSync()} with both stdout and stderr set to `"pipe"` */
  type ReadableSyncSubprocess = SyncSubprocess<"pipe", "pipe">;
  /** Utility type for any process from {@link Bun.spawnSync()} with both stdout and stderr set to `null` or similar */
  type NullSyncSubprocess = SyncSubprocess<
    "ignore" | "inherit" | null | undefined,
    "ignore" | "inherit" | null | undefined
  >;

  // Blocked on https://github.com/oven-sh/bun/issues/8329
  // /**
  //  *
  //  * Count the visible width of a string, as it would be displayed in a terminal.
  //  *
  //  * By default, strips ANSI escape codes before measuring the string. This is
  //  * because ANSI escape codes are not visible characters. If passed a non-string,
  //  * it will return 0.
  //  *
  //  * @param str The string to measure
  //  * @param options
  //  */
  // function stringWidth(
  //   str: string,
  //   options?: {
  //     /**
  //      * Whether to include ANSI escape codes in the width calculation
  //      *
  //      * Slightly faster if set to `false`, but less accurate if the string contains ANSI escape codes.
  //      * @default false
  //      */
  //     countAnsiEscapeCodes?: boolean;
  //   },
  // ): number;

  class FileSystemRouter {
    /**
     * Create a new {@link FileSystemRouter}.
     *
     * @example
     * ```ts
     * const router = new FileSystemRouter({
     *   dir: process.cwd() + "/pages",
     *   style: "nextjs",
     * });
     *
     * const {params} = router.match("/blog/2020/01/01/hello-world");
     * console.log(params); // {year: "2020", month: "01", day: "01", slug: "hello-world"}
     * ```
     * @param options The options to use when creating the router
     * @param options.dir The root directory containing the files to route
     * @param options.style The style of router to use (only "nextjs" supported
     * for now)
     */
    constructor(options: {
      /**
       * The root directory containing the files to route
       *
       * There is no default value for this option.
       *
       * @example
       *   ```ts
       *   const router = new FileSystemRouter({
       *   dir:
       */
      dir: string;
      style: "nextjs";

      /** The base path to use when routing */
      assetPrefix?: string;
      origin?: string;
      /** Limit the pages to those with particular file extensions. */
      fileExtensions?: string[];
    });

    // todo: URL
    match(input: string | Request | Response): MatchedRoute | null;

    readonly assetPrefix: string;
    readonly origin: string;
    readonly style: string;
    readonly routes: Record<string, string>;

    reload(): void;
  }

  interface MatchedRoute {
    /**
     * A map of the parameters from the route
     *
     * @example
     * ```ts
     * const router = new FileSystemRouter({
     *   dir: "/path/to/files",
     *   style: "nextjs",
     * });
     * const {params} = router.match("/blog/2020/01/01/hello-world");
     * console.log(params.year); // "2020"
     * console.log(params.month); // "01"
     * console.log(params.day); // "01"
     * console.log(params.slug); // "hello-world"
     * ```
     */
    readonly params: Record<string, string>;
    readonly filePath: string;
    readonly pathname: string;
    readonly query: Record<string, string>;
    readonly name: string;
    readonly kind: "exact" | "catch-all" | "optional-catch-all" | "dynamic";
    readonly src: string;
  }

  /**
   * The current version of Bun
   * @example
   * "1.2.0"
   */
  const version: string;

  /**
   * The current version of Bun with the shortened commit sha of the build
   * @example "v1.2.0 (a1b2c3d4)"
   */
  const version_with_sha: string;

  /**
   * The git sha at the time the currently-running version of Bun was compiled
   * @example
   * "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2"
   */
  const revision: string;

  /**
   * Find the index of a newline character in potentially ill-formed UTF-8 text.
   *
   * This is sort of like readline() except without the IO.
   */
  function indexOfLine(buffer: ArrayBufferView | ArrayBufferLike, offset?: number): number;

  interface GlobScanOptions {
    /**
     * The root directory to start matching from. Defaults to `process.cwd()`
     */
    cwd?: string;

    /**
     * Allow patterns to match entries that begin with a period (`.`).
     *
     * @default false
     */
    dot?: boolean;

    /**
     * Return the absolute path for entries.
     *
     * @default false
     */
    absolute?: boolean;

    /**
     * Indicates whether to traverse descendants of symbolic link directories.
     *
     * @default false
     */
    followSymlinks?: boolean;

    /**
     * Throw an error when symbolic link is broken
     *
     * @default false
     */
    throwErrorOnBrokenSymlink?: boolean;

    /**
     * Return only files.
     *
     * @default true
     */
    onlyFiles?: boolean;
  }

  /**
   * Match files using [glob patterns](https://en.wikipedia.org/wiki/Glob_(programming)).
   *
   * The supported pattern syntax for is:
   *
   * - `?`
   *     Matches any single character.
   * - `*`
   *     Matches zero or more characters, except for path separators ('/' or '\').
   * - `**`
   *     Matches zero or more characters, including path separators.
   *     Must match a complete path segment, i.e. followed by a path separator or
   *     at the end of the pattern.
   * - `[ab]`
   *     Matches one of the characters contained in the brackets.
   *     Character ranges (e.g. "[a-z]") are also supported.
   *     Use "[!ab]" or "[^ab]" to match any character *except* those contained
   *     in the brackets.
   * - `{a,b}`
   *     Match one of the patterns contained in the braces.
   *     Any of the wildcards listed above can be used in the sub patterns.
   *     Braces may be nested up to 10 levels deep.
   * - `!`
   *     Negates the result when at the start of the pattern.
   *     Multiple "!" characters negate the pattern multiple times.
   * - `\`
   *     Used to escape any of the special characters above.
   *
   * @example
   * ```js
   * const glob = new Glob("*.{ts,tsx}");
   * const scannedFiles = await Array.fromAsync(glob.scan({ cwd: './src' }))
   * ```
   */
  export class Glob {
    constructor(pattern: string);

    /**
     * Scan a root directory recursively for files that match this glob pattern. Returns an async iterator.
     *
     * @throws {ENOTDIR} Given root cwd path must be a directory
     *
     * @example
     * ```js
     * const glob = new Glob("*.{ts,tsx}");
     * const scannedFiles = await Array.fromAsync(glob.scan({ cwd: './src' }))
     * ```
     *
     * @example
     * ```js
     * const glob = new Glob("*.{ts,tsx}");
     * for await (const path of glob.scan()) {
     *   // do something
     * }
     * ```
     */
    scan(optionsOrCwd?: string | GlobScanOptions): AsyncIterableIterator<string>;

    /**
     * Synchronously scan a root directory recursively for files that match this glob pattern. Returns an iterator.
     *
     * @throws {ENOTDIR} Given root cwd path must be a directory
     *
     * @example
     * ```js
     * const glob = new Glob("*.{ts,tsx}");
     * const scannedFiles = Array.from(glob.scan({ cwd: './src' }))
     * ```
     *
     * @example
     * ```js
     * const glob = new Glob("*.{ts,tsx}");
     * for (const path of glob.scan()) {
     *   // do something
     * }
     * ```
     */
    scanSync(optionsOrCwd?: string | GlobScanOptions): IterableIterator<string>;

    /**
     * Match the glob against a string
     *
     * @example
     * ```js
     * const glob = new Glob("*.{ts,tsx}");
     * expect(glob.match('foo.ts')).toBeTrue();
     * ```
     */
    match(str: string): boolean;
  }

  /**
   * Generate a UUIDv7, which is a sequential ID based on the current timestamp with a random component.
   *
   * When the same timestamp is used multiple times, a monotonically increasing
   * counter is appended to allow sorting. The final 8 bytes are
   * cryptographically random. When the timestamp changes, the counter resets to
   * a psuedo-random integer.
   *
   * @param encoding "hex" | "base64" | "base64url"
   * @param timestamp Unix timestamp in milliseconds, defaults to `Date.now()`
   *
   * @example
   * ```js
   * import { randomUUIDv7 } from "bun";
   * const array = [
   *   randomUUIDv7(),
   *   randomUUIDv7(),
   *   randomUUIDv7(),
   * ]
   * [
   *   "0192ce07-8c4f-7d66-afec-2482b5c9b03c",
   *   "0192ce07-8c4f-7d67-805f-0f71581b5622",
   *   "0192ce07-8c4f-7d68-8170-6816e4451a58"
   * ]
   * ```
   */
  function randomUUIDv7(
    /**
     * @default "hex"
     */
    encoding?: "hex" | "base64" | "base64url",
    /**
     * @default Date.now()
     */
    timestamp?: number | Date,
  ): string;

  /**
   * Generate a UUIDv7 as a Buffer
   *
   * @param encoding "buffer"
   * @param timestamp Unix timestamp in milliseconds, defaults to `Date.now()`
   */
  function randomUUIDv7(
    encoding: "buffer",
    /**
     * @default Date.now()
     */
    timestamp?: number | Date,
  ): Buffer;

  /**
   * Generate a UUIDv5, which is a name-based UUID based on the SHA-1 hash of a namespace UUID and a name.
   *
   * @param name The name to use for the UUID
   * @param namespace The namespace to use for the UUID
   * @param encoding The encoding to use for the UUID
   *
   *
   * @example
   * ```js
   * import { randomUUIDv5 } from "bun";
   * const uuid = randomUUIDv5("www.example.com", "dns");
   * console.log(uuid); // "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
   * ```
   *
   * ```js
   * import { randomUUIDv5 } from "bun";
   * const uuid = randomUUIDv5("www.example.com", "url");
   * console.log(uuid); // "6ba7b811-9dad-11d1-80b4-00c04fd430c8"
   * ```
   */
  function randomUUIDv5(
    name: string | BufferSource,
    namespace: string | BufferSource | "dns" | "url" | "oid" | "x500",
    /**
     * @default "hex"
     */
    encoding?: "hex" | "base64" | "base64url",
  ): string;

  /**
   * Generate a UUIDv5 as a Buffer
   *
   * @param name The name to use for the UUID
   * @param namespace The namespace to use for the UUID
   * @param encoding The encoding to use for the UUID
   *
   * @example
   * ```js
   * import { randomUUIDv5 } from "bun";
   * const uuid = randomUUIDv5("www.example.com", "url", "buffer");
   * console.log(uuid); // <Buffer 6b a7 b8 11 9d ad 11 d1 80 b4 00 c0 4f d4 30 c8>
   * ```
   */
  function randomUUIDv5(
    name: string | BufferSource,
    namespace: string | BufferSource | "dns" | "url" | "oid" | "x500",
    encoding: "buffer",
  ): Buffer;

  /**
   * Types for `bun.lock`
   */
  type BunLockFile = {
    lockfileVersion: 0 | 1;
    workspaces: {
      [workspace: string]: BunLockFileWorkspacePackage;
    };
    /** @see https://bun.sh/docs/install/overrides */
    overrides?: Record<string, string>;
    /** @see https://bun.sh/docs/install/patch */
    patchedDependencies?: Record<string, string>;
    /** @see https://bun.sh/docs/install/lifecycle#trusteddependencies */
    trustedDependencies?: string[];
    /** @see https://bun.sh/docs/install/catalogs */
    catalog?: Record<string, string>;
    /** @see https://bun.sh/docs/install/catalogs */
    catalogs?: Record<string, Record<string, string>>;

    /**
     * ```
     * INFO = { prod/dev/optional/peer dependencies, os, cpu, libc (TODO), bin, binDir }
     *
     * // first index is resolution for each type of package
     * npm         -> [ "name@version", registry (TODO: remove if default), INFO, integrity]
     * symlink     -> [ "name@link:path", INFO ]
     * folder      -> [ "name@file:path", INFO ]
     * workspace   -> [ "name@workspace:path" ] // workspace is only path
     * tarball     -> [ "name@tarball", INFO ]
     * root        -> [ "name@root:", { bin, binDir } ]
     * git         -> [ "name@git+repo", INFO, .bun-tag string (TODO: remove this) ]
     * github      -> [ "name@github:user/repo", INFO, .bun-tag string (TODO: remove this) ]
     * ```
     * */
    packages: {
      [pkg: string]: BunLockFilePackageArray;
    };
  };

  type BunLockFileBasePackageInfo = {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalPeers?: string[];
    bin?: string | Record<string, string>;
    binDir?: string;
  };

  type BunLockFileWorkspacePackage = BunLockFileBasePackageInfo & {
    name?: string;
    version?: string;
  };

  type BunLockFilePackageInfo = BunLockFileBasePackageInfo & {
    os?: string | string[];
    cpu?: string | string[];
    bundled?: true;
  };

  /** @see {@link BunLockFile.packages} for more info */
  type BunLockFilePackageArray =
    /** npm */
    | [pkg: string, registry: string, info: BunLockFilePackageInfo, integrity: string]
    /** symlink, folder, tarball */
    | [pkg: string, info: BunLockFilePackageInfo]
    /** workspace */
    | [pkg: string]
    /** git, github */
    | [pkg: string, info: BunLockFilePackageInfo, bunTag: string]
    /** root */
    | [pkg: string, info: Pick<BunLockFileBasePackageInfo, "bin" | "binDir">];

  interface CookieInit {
    name?: string;
    value?: string;
    domain?: string;
    /** Defaults to '/'. To allow the browser to set the path, use an empty string. */
    path?: string;
    expires?: number | Date | string;
    secure?: boolean;
    /** Defaults to `lax`. */
    sameSite?: CookieSameSite;
    httpOnly?: boolean;
    partitioned?: boolean;
    maxAge?: number;
  }

  interface CookieStoreDeleteOptions {
    name: string;
    domain?: string | null;
    path?: string;
  }

  interface CookieStoreGetOptions {
    name?: string;
    url?: string;
  }

  type CookieSameSite = "strict" | "lax" | "none";

  /**
   * A class for working with a single cookie
   *
   * @example
   * ```js
   * const cookie = new Bun.Cookie("name", "value");
   * console.log(cookie.toString()); // "name=value; Path=/; SameSite=Lax"
   * ```
   */
  class Cookie {
    /**
     * Create a new cookie
     * @param name - The name of the cookie
     * @param value - The value of the cookie
     * @param options - Optional cookie attributes
     */
    constructor(name: string, value: string, options?: CookieInit);

    /**
     * Create a new cookie from a cookie string
     * @param cookieString - The cookie string
     */
    constructor(cookieString: string);

    /**
     * Create a new cookie from a cookie object
     * @param cookieObject - The cookie object
     */
    constructor(cookieObject?: CookieInit);

    /**
     * The name of the cookie
     */
    readonly name: string;

    /**
     * The value of the cookie
     */
    value: string;

    /**
     * The domain of the cookie
     */
    domain?: string;

    /**
     * The path of the cookie
     */
    path: string;

    /**
     * The expiration date of the cookie
     */
    expires?: Date;

    /**
     * Whether the cookie is secure
     */
    secure: boolean;

    /**
     * The same-site attribute of the cookie
     */
    sameSite: CookieSameSite;

    /**
     * Whether the cookie is partitioned
     */
    partitioned: boolean;

    /**
     * The maximum age of the cookie in seconds
     */
    maxAge?: number;

    /**
     * Whether the cookie is HTTP-only
     */
    httpOnly: boolean;

    /**
     * Whether the cookie is expired
     */
    isExpired(): boolean;

    /**
     * Serialize the cookie to a string
     *
     * @example
     * ```ts
     * const cookie = Bun.Cookie.from("session", "abc123", {
     *   domain: "example.com",
     *   path: "/",
     *   secure: true,
     *   httpOnly: true
     * }).serialize(); // "session=abc123; Domain=example.com; Path=/; Secure; HttpOnly; SameSite=Lax"
     * ```
     */
    serialize(): string;

    /**
     * Serialize the cookie to a string
     *
     * Alias of {@link Cookie.serialize}
     */
    toString(): string;

    /**
     * Serialize the cookie to a JSON object
     */
    toJSON(): CookieInit;

    /**
     * Parse a cookie string into a Cookie object
     * @param cookieString - The cookie string
     */
    static parse(cookieString: string): Cookie;

    /**
     * Create a new cookie from a name and value and optional options
     */
    static from(name: string, value: string, options?: CookieInit): Cookie;
  }

  /**
   * A Map-like interface for working with collections of cookies.
   *
   * Implements the `Iterable` interface, allowing use with `for...of` loops.
   */
  class CookieMap implements Iterable<[string, string]> {
    /**
     * Creates a new CookieMap instance.
     *
     * @param init - Optional initial data for the cookie map:
     *   - string: A cookie header string (e.g., "name=value; foo=bar")
     *   - string[][]: An array of name/value pairs (e.g., [["name", "value"], ["foo", "bar"]])
     *   - Record<string, string>: An object with cookie names as keys (e.g., { name: "value", foo: "bar" })
     */
    constructor(init?: string[][] | Record<string, string> | string);

    /**
     * Gets the value of a cookie with the specified name.
     *
     * @param name - The name of the cookie to retrieve
     * @returns The cookie value as a string, or null if the cookie doesn't exist
     */
    get(name: string): string | null;

    /**
     * Gets an array of values for Set-Cookie headers in order to apply all changes to cookies.
     *
     * @returns An array of values for Set-Cookie headers
     */
    toSetCookieHeaders(): string[];

    /**
     * Checks if a cookie with the given name exists.
     *
     * @param name - The name of the cookie to check
     * @returns true if the cookie exists, false otherwise
     */
    has(name: string): boolean;

    /**
     * Adds or updates a cookie in the map.
     *
     * @param name - The name of the cookie
     * @param value - The value of the cookie
     * @param options - Optional cookie attributes
     */
    set(name: string, value: string, options?: CookieInit): void;

    /**
     * Adds or updates a cookie in the map using a cookie options object.
     *
     * @param options - Cookie options including name and value
     */
    set(options: CookieInit): void;

    /**
     * Removes a cookie from the map.
     *
     * @param name - The name of the cookie to delete
     */
    delete(name: string): void;

    /**
     * Removes a cookie from the map.
     *
     * @param options - The options for the cookie to delete
     */
    delete(options: CookieStoreDeleteOptions): void;

    /**
     * Removes a cookie from the map.
     *
     * @param name - The name of the cookie to delete
     * @param options - The options for the cookie to delete
     */
    delete(name: string, options: Omit<CookieStoreDeleteOptions, "name">): void;

    /**
     * Converts the cookie map to a serializable format.
     *
     * @returns An array of name/value pairs
     */
    toJSON(): Record<string, string>;

    /**
     * The number of cookies in the map.
     */
    readonly size: number;

    /**
     * Returns an iterator of [name, value] pairs for every cookie in the map.
     *
     * @returns An iterator for the entries in the map
     */
    entries(): IterableIterator<[string, string]>;

    /**
     * Returns an iterator of all cookie names in the map.
     *
     * @returns An iterator for the cookie names
     */
    keys(): IterableIterator<string>;

    /**
     * Returns an iterator of all cookie values in the map.
     *
     * @returns An iterator for the cookie values
     */
    values(): IterableIterator<string>;

    /**
     * Executes a provided function once for each cookie in the map.
     *
     * @param callback - Function to execute for each entry
     */
    forEach(callback: (value: string, key: string, map: CookieMap) => void): void;

    /**
     * Returns the default iterator for the CookieMap.
     * Used by for...of loops to iterate over all entries.
     *
     * @returns An iterator for the entries in the map
     */
    [Symbol.iterator](): IterableIterator<[string, string]>;
  }
}

declare module "*.txt" {
  var text: string;
  export = text;
}

declare module "*.toml" {
  var contents: any;
  export = contents;
}

declare module "*.jsonc" {
  var contents: any;
  export = contents;
}

declare module "*/bun.lock" {
  var contents: import("bun").BunLockFile;
  export = contents;
}

declare module "*.html" {
  var contents: import("bun").HTMLBundle;

  export = contents;
}

declare module "bun" {
  type HMREventNames =
    | "beforeUpdate"
    | "afterUpdate"
    | "beforeFullReload"
    | "beforePrune"
    | "invalidate"
    | "error"
    | "ws:disconnect"
    | "ws:connect";

  /**
   * The event names for the dev server
   */
  type HMREvent = `bun:${HMREventNames}` | (string & {});
}

interface ImportMeta {
  /**
   * Hot module replacement APIs. This value is `undefined` in production and
   * can be used in an `if` statement to check if HMR APIs are available
   *
   * ```ts
   * if (import.meta.hot) {
   *   // HMR APIs are available
   * }
   * ```
   *
   * However, this check is usually not needed as Bun will dead-code-eliminate
   * calls to all of the HMR APIs in production builds.
   *
   * https://bun.sh/docs/bundler/hmr
   */
  hot: {
    /**
     * `import.meta.hot.data` maintains state between module instances during
     * hot replacement, enabling data transfer from previous to new versions.
     * When `import.meta.hot.data` is written to, Bun will mark this module as
     * capable of self-accepting (equivalent of calling `accept()`).
     *
     * @example
     * ```ts
     * const root = import.meta.hot.data.root ??= createRoot(elem);
     * root.render(<App />); // re-use an existing root
     * ```
     *
     * In production, `data` is inlined to be `{}`. This is handy because Bun
     * knows it can minify `{}.prop ??= value` into `value` in production.
     */
    data: any;

    /**
     * Indicate that this module can be replaced simply by re-evaluating the
     * file. After a hot update, importers of this module will be
     * automatically patched.
     *
     * When `import.meta.hot.accept` is not used, the page will reload when
     * the file updates, and a console message shows which files were checked.
     *
     * @example
     * ```ts
     * import { getCount } from "./foo";
     *
     * console.log("count is ", getCount());
     *
     * import.meta.hot.accept();
     * ```
     */
    accept(): void;

    /**
     * Indicate that this module can be replaced by evaluating the new module,
     * and then calling the callback with the new module. In this mode, the
     * importers do not get patched. This is to match Vite, which is unable
     * to patch their import statements. Prefer using `import.meta.hot.accept()`
     * without an argument as it usually makes your code easier to understand.
     *
     * When `import.meta.hot.accept` is not used, the page will reload when
     * the file updates, and a console message shows which files were checked.
     *
     * @example
     * ```ts
     * export const count = 0;
     *
     * import.meta.hot.accept((newModule) => {
     *   if (newModule) {
     *     // newModule is undefined when SyntaxError happened
     *     console.log('updated: count is now ', newModule.count)
     *   }
     * });
     * ```
     *
     * In production, calls to this are dead-code-eliminated.
     */
    accept(cb: (newModule: any | undefined) => void): void;

    /**
     * Indicate that a dependency's module can be accepted. When the dependency
     * is updated, the callback will be called with the new module.
     *
     * When `import.meta.hot.accept` is not used, the page will reload when
     * the file updates, and a console message shows which files were checked.
     *
     * @example
     * ```ts
     * import.meta.hot.accept('./foo', (newModule) => {
     *   if (newModule) {
     *     // newModule is undefined when SyntaxError happened
     *     console.log('updated: count is now ', newModule.count)
     *   }
     * });
     * ```
     */
    accept(specifier: string, callback: (newModule: any) => void): void;

    /**
     * Indicate that a dependency's module can be accepted. This variant
     * accepts an array of dependencies, where the callback will receive
     * the one updated module, and `undefined` for the rest.
     *
     * When `import.meta.hot.accept` is not used, the page will reload when
     * the file updates, and a console message shows which files were checked.
     */
    accept(specifiers: string[], callback: (newModules: (any | undefined)[]) => void): void;

    /**
     * Attach an on-dispose callback. This is called:
     * - Just before the module is replaced with another copy (before the next is loaded)
     * - After the module is detached (removing all imports to this module)
     *
     * This callback is not called on route navigation or when the browser tab closes.
     *
     * Returning a promise will delay module replacement until the module is
     * disposed. All dispose callbacks are called in parallel.
     */
    dispose(cb: (data: any) => void | Promise<void>): void;

    /**
     * No-op
     * @deprecated
     */
    decline(): void;

    // NOTE TO CONTRIBUTORS ////////////////////////////////////////
    //     Callback is currently never called for `.prune()`      //
    //     so the types are commented out until we support it.    //
    ////////////////////////////////////////////////////////////////
    // /**
    //  * Attach a callback that is called when the module is removed from the module graph.
    //  *
    //  * This can be used to clean up resources that were created when the module was loaded.
    //  * Unlike `import.meta.hot.dispose()`, this pairs much better with `accept` and `data` to manage stateful resources.
    //  *
    //  * @example
    //  * ```ts
    //  * export const ws = (import.meta.hot.data.ws ??= new WebSocket(location.origin));
    //  *
    //  * import.meta.hot.prune(() => {
    //  *   ws.close();
    //  * });
    //  * ```
    //  */
    // prune(callback: () => void): void;

    /**
     * Listen for an event from the dev server
     *
     * For compatibility with Vite, event names are also available via vite:* prefix instead of bun:*.
     *
     * https://bun.sh/docs/bundler/hmr#import-meta-hot-on-and-off
     * @param event The event to listen to
     * @param callback The callback to call when the event is emitted
     */
    on(event: Bun.HMREvent, callback: () => void): void;

    /**
     * Stop listening for an event from the dev server
     *
     * For compatibility with Vite, event names are also available via vite:* prefix instead of bun:*.
     *
     * https://bun.sh/docs/bundler/hmr#import-meta-hot-on-and-off
     * @param event The event to stop listening to
     * @param callback The callback to stop listening to
     */
    off(event: Bun.HMREvent, callback: () => void): void;
  };
}

/**
 * `bun:ffi` lets you efficiently call C functions & FFI functions from JavaScript
 *  without writing bindings yourself.
 *
 * ```js
 * import {dlopen, CString, ptr} from 'bun:ffi';
 *
 * const lib = dlopen('libsqlite3', {
 * });
 * ```
 *
 * This is powered by just-in-time compiling C wrappers
 * that convert JavaScript types to C types and back. Internally,
 * bun uses [tinycc](https://github.com/TinyCC/tinycc), so a big thanks
 * goes to Fabrice Bellard and TinyCC maintainers for making this possible.
 *
 * @category FFI
 */
declare module "bun:ffi" {
  enum FFIType {
    char = 0,
    /**
     * 8-bit signed integer
     *
     * Must be a value between -127 and 127
     *
     * When passing to a FFI function (C ABI), type coercion is not performed.
     *
     * In C:
     * ```c
     * signed char
     * char // on x64 & aarch64 macOS
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    int8_t = 1,
    /**
     * 8-bit signed integer
     *
     * Must be a value between -127 and 127
     *
     * When passing to a FFI function (C ABI), type coercion is not performed.
     *
     * In C:
     * ```c
     * signed char
     * char // on x64 & aarch64 macOS
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    i8 = 1,

    /**
     * 8-bit unsigned integer
     *
     * Must be a value between 0 and 255
     *
     * When passing to a FFI function (C ABI), type coercion is not performed.
     *
     * In C:
     * ```c
     * unsigned char
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    uint8_t = 2,
    /**
     * 8-bit unsigned integer
     *
     * Must be a value between 0 and 255
     *
     * When passing to a FFI function (C ABI), type coercion is not performed.
     *
     * In C:
     * ```c
     * unsigned char
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    u8 = 2,

    /**
     * 16-bit signed integer
     *
     * Must be a value between -32768 and 32767
     *
     * When passing to a FFI function (C ABI), type coercion is not performed.
     *
     * In C:
     * ```c
     * in16_t
     * short // on arm64 & x64
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    int16_t = 3,
    /**
     * 16-bit signed integer
     *
     * Must be a value between -32768 and 32767
     *
     * When passing to a FFI function (C ABI), type coercion is not performed.
     *
     * In C:
     * ```c
     * in16_t
     * short // on arm64 & x64
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    i16 = 3,

    /**
     * 16-bit unsigned integer
     *
     * Must be a value between 0 and 65535, inclusive.
     *
     * When passing to a FFI function (C ABI), type coercion is not performed.
     *
     * In C:
     * ```c
     * uint16_t
     * unsigned short // on arm64 & x64
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    uint16_t = 4,
    /**
     * 16-bit unsigned integer
     *
     * Must be a value between 0 and 65535, inclusive.
     *
     * When passing to a FFI function (C ABI), type coercion is not performed.
     *
     * In C:
     * ```c
     * uint16_t
     * unsigned short // on arm64 & x64
     * ```
     *
     * In JavaScript:
     * ```js
     * var num = 0;
     * ```
     */
    u16 = 4,

    /**
     * 32-bit signed integer
     */
    int32_t = 5,

    /**
     * 32-bit signed integer
     *
     * Alias of {@link FFIType.int32_t}
     */
    i32 = 5,
    /**
     * 32-bit signed integer
     *
     * The same as `int` in C
     *
     * ```c
     * int
     * ```
     */
    int = 5,

    /**
     * 32-bit unsigned integer
     *
     * The same as `unsigned int` in C (on x64 & arm64)
     *
     * C:
     * ```c
     * unsigned int
     * ```
     * JavaScript:
     * ```js
     * ptr(new Uint32Array(1))
     * ```
     */
    uint32_t = 6,
    /**
     * 32-bit unsigned integer
     *
     * Alias of {@link FFIType.uint32_t}
     */
    u32 = 6,

    /**
     * int64 is a 64-bit signed integer
     *
     * This is not implemented yet!
     */
    int64_t = 7,
    /**
     * i64 is a 64-bit signed integer
     *
     * This is not implemented yet!
     */
    i64 = 7,

    /**
     * 64-bit unsigned integer
     *
     * This is not implemented yet!
     */
    uint64_t = 8,
    /**
     * 64-bit unsigned integer
     *
     * This is not implemented yet!
     */
    u64 = 8,

    /**
     * Doubles are not supported yet!
     */
    double = 9,
    /**
     * Doubles are not supported yet!
     */
    f64 = 9,
    /**
     * Floats are not supported yet!
     */
    float = 10,
    /**
     * Floats are not supported yet!
     */
    f32 = 10,

    /**
     * Boolean value
     *
     * Must be `true` or `false`. `0` and `1` type coercion is not supported.
     *
     * In C, this corresponds to:
     * ```c
     * bool
     * _Bool
     * ```
     */
    bool = 11,

    /**
     * Pointer value
     *
     * See {@link Bun.FFI.ptr} for more information
     *
     * In C:
     * ```c
     * void*
     * ```
     *
     * In JavaScript:
     * ```js
     * ptr(new Uint8Array(1))
     * ```
     */
    ptr = 12,
    /**
     * Pointer value
     *
     * alias of {@link FFIType.ptr}
     */
    pointer = 12,

    /**
     * void value
     *
     * void arguments are not supported
     *
     * void return type is the default return type
     *
     * In C:
     * ```c
     * void
     * ```
     */
    void = 13,

    /**
     * When used as a `returns`, this will automatically become a {@link CString}.
     *
     * When used in `args` it is equivalent to {@link FFIType.pointer}
     */
    cstring = 14,

    /**
     * Attempt to coerce `BigInt` into a `Number` if it fits. This improves performance
     * but means you might get a `BigInt` or you might get a `number`.
     *
     * In C, this always becomes `int64_t`
     *
     * In JavaScript, this could be number or it could be BigInt, depending on what
     * value is passed in.
     */
    i64_fast = 15,

    /**
     * Attempt to coerce `BigInt` into a `Number` if it fits. This improves performance
     * but means you might get a `BigInt` or you might get a `number`.
     *
     * In C, this always becomes `uint64_t`
     *
     * In JavaScript, this could be number or it could be BigInt, depending on what
     * value is passed in.
     */
    u64_fast = 16,
    function = 17,

    napi_env = 18,
    napi_value = 19,
    buffer = 20,
  }

  type Pointer = number & { __pointer__: null };

  interface FFITypeToArgsType {
    [FFIType.char]: number;
    [FFIType.int8_t]: number;
    [FFIType.i8]: number;
    [FFIType.uint8_t]: number;
    [FFIType.u8]: number;
    [FFIType.int16_t]: number;
    [FFIType.i16]: number;
    [FFIType.uint16_t]: number;
    [FFIType.u16]: number;
    [FFIType.int32_t]: number;
    [FFIType.i32]: number;
    [FFIType.int]: number;
    [FFIType.uint32_t]: number;
    [FFIType.u32]: number;
    [FFIType.int64_t]: number | bigint;
    [FFIType.i64]: number | bigint;
    [FFIType.uint64_t]: number | bigint;
    [FFIType.u64]: number | bigint;
    [FFIType.double]: number;
    [FFIType.f64]: number;
    [FFIType.float]: number;
    [FFIType.f32]: number;
    [FFIType.bool]: boolean;
    [FFIType.ptr]: NodeJS.TypedArray | Pointer | CString | null;
    [FFIType.pointer]: NodeJS.TypedArray | Pointer | CString | null;
    [FFIType.void]: undefined;
    [FFIType.cstring]: NodeJS.TypedArray | Pointer | CString | null;
    [FFIType.i64_fast]: number | bigint;
    [FFIType.u64_fast]: number | bigint;
    [FFIType.function]: Pointer | JSCallback; // cannot be null
    [FFIType.napi_env]: unknown;
    [FFIType.napi_value]: unknown;
    [FFIType.buffer]: NodeJS.TypedArray | DataView;
  }
  interface FFITypeToReturnsType {
    [FFIType.char]: number;
    [FFIType.int8_t]: number;
    [FFIType.i8]: number;
    [FFIType.uint8_t]: number;
    [FFIType.u8]: number;
    [FFIType.int16_t]: number;
    [FFIType.i16]: number;
    [FFIType.uint16_t]: number;
    [FFIType.u16]: number;
    [FFIType.int32_t]: number;
    [FFIType.i32]: number;
    [FFIType.int]: number;
    [FFIType.uint32_t]: number;
    [FFIType.u32]: number;
    [FFIType.int64_t]: bigint;
    [FFIType.i64]: bigint;
    [FFIType.uint64_t]: bigint;
    [FFIType.u64]: bigint;
    [FFIType.double]: number;
    [FFIType.f64]: number;
    [FFIType.float]: number;
    [FFIType.f32]: number;
    [FFIType.bool]: boolean;
    [FFIType.ptr]: Pointer | null;
    [FFIType.pointer]: Pointer | null;
    [FFIType.void]: undefined;
    [FFIType.cstring]: CString;
    [FFIType.i64_fast]: number | bigint;
    [FFIType.u64_fast]: number | bigint;
    [FFIType.function]: Pointer | null;
    [FFIType.napi_env]: unknown;
    [FFIType.napi_value]: unknown;
    [FFIType.buffer]: NodeJS.TypedArray | DataView;
  }
  interface FFITypeStringToType {
    ["char"]: FFIType.char;
    ["int8_t"]: FFIType.int8_t;
    ["i8"]: FFIType.i8;
    ["uint8_t"]: FFIType.uint8_t;
    ["u8"]: FFIType.u8;
    ["int16_t"]: FFIType.int16_t;
    ["i16"]: FFIType.i16;
    ["uint16_t"]: FFIType.uint16_t;
    ["u16"]: FFIType.u16;
    ["int32_t"]: FFIType.int32_t;
    ["i32"]: FFIType.i32;
    ["int"]: FFIType.int;
    ["uint32_t"]: FFIType.uint32_t;
    ["u32"]: FFIType.u32;
    ["int64_t"]: FFIType.int64_t;
    ["i64"]: FFIType.i64;
    ["uint64_t"]: FFIType.uint64_t;
    ["u64"]: FFIType.u64;
    ["double"]: FFIType.double;
    ["f64"]: FFIType.f64;
    ["float"]: FFIType.float;
    ["f32"]: FFIType.f32;
    ["bool"]: FFIType.bool;
    ["ptr"]: FFIType.ptr;
    ["pointer"]: FFIType.pointer;
    ["void"]: FFIType.void;
    ["cstring"]: FFIType.cstring;
    ["function"]: FFIType.pointer; // for now
    ["usize"]: FFIType.uint64_t; // for now
    ["callback"]: FFIType.pointer; // for now
    ["napi_env"]: FFIType.napi_env;
    ["napi_value"]: FFIType.napi_value;
    ["buffer"]: FFIType.buffer;
  }

  type FFITypeOrString = FFIType | keyof FFITypeStringToType;

  interface FFIFunction {
    /**
     * Arguments to a FFI function (C ABI)
     *
     * Defaults to an empty array, which means no arguments.
     *
     * To pass a pointer, use "ptr" or "pointer" as the type name. To get a pointer, see {@link ptr}.
     *
     * @example
     * From JavaScript:
     * ```ts
     * import { dlopen, FFIType, suffix } from "bun:ffi"
     *
     * const lib = dlopen(`adder.${suffix}`, {
     * 	add: {
     * 		// FFIType can be used or you can pass string labels.
     * 		args: [FFIType.i32, "i32"],
     * 		returns: "i32",
     * 	},
     * })
     * lib.symbols.add(1, 2)
     * ```
     * In C:
     * ```c
     * int add(int a, int b) {
     *   return a + b;
     * }
     * ```
     */
    readonly args?: readonly FFITypeOrString[];
    /**
     * Return type to a FFI function (C ABI)
     *
     * Defaults to {@link FFIType.void}
     *
     * To pass a pointer, use "ptr" or "pointer" as the type name. To get a pointer, see {@link ptr}.
     *
     * @example
     * From JavaScript:
     * ```ts
     * import { dlopen, CString } from "bun:ffi"
     *
     * const lib = dlopen('z', {
     *    version: {
     *      returns: "ptr",
     *   }
     * });
     * console.log(new CString(lib.symbols.version()));
     * ```
     * In C:
     * ```c
     * char* version()
     * {
     *  return "1.0.0";
     * }
     * ```
     */
    readonly returns?: FFITypeOrString;

    /**
     * Function pointer to the native function
     *
     * If provided, instead of using dlsym() to lookup the function, Bun will use this instead.
     * This pointer should not be null (0).
     *
     * This is useful if the library has already been loaded
     * or if the module is also using Node-API.
     */
    readonly ptr?: Pointer | bigint;

    /**
     * Can C/FFI code call this function from a separate thread?
     *
     * Only supported with {@link JSCallback}.
     *
     * This does not make the function run in a separate thread. It is still up to the application/library
     * to run their code in a separate thread.
     *
     * By default, {@link JSCallback} calls are not thread-safe. Turning this on
     * incurs a small performance penalty for every function call. That small
     * performance penalty needs to be less than the performance gain from
     * running the function in a separate thread.
     *
     * @default false
     */
    readonly threadsafe?: boolean;
  }

  type Symbols = Readonly<Record<string, FFIFunction>>;

  interface Library<Fns extends Symbols> {
    symbols: ConvertFns<Fns>;

    /**
     * `dlclose` the library, unloading the symbols and freeing allocated memory.
     *
     * Once called, the library is no longer usable.
     *
     * Calling a function from a library that has been closed is undefined behavior.
     */
    close(): void;
  }

  type ToFFIType<T extends FFITypeOrString> = T extends FFIType ? T : T extends string ? FFITypeStringToType[T] : never;

  const FFIFunctionCallableSymbol: unique symbol;
  type ConvertFns<Fns extends Symbols> = {
    [K in keyof Fns]: {
      (
        ...args: Fns[K]["args"] extends infer A extends readonly FFITypeOrString[]
          ? { [L in keyof A]: FFITypeToArgsType[ToFFIType<A[L]>] }
          : // eslint-disable-next-line @definitelytyped/no-single-element-tuple-type
            [unknown] extends [Fns[K]["args"]]
            ? []
            : never
      ): [unknown] extends [Fns[K]["returns"]] // eslint-disable-next-line @definitelytyped/no-single-element-tuple-type
        ? undefined
        : FFITypeToReturnsType[ToFFIType<NonNullable<Fns[K]["returns"]>>];
      __ffi_function_callable: typeof FFIFunctionCallableSymbol;
    };
  };

  /**
   * Open a library using `"bun:ffi"`
   *
   * @param name The name of the library or file path. This will be passed to `dlopen()`
   * @param symbols Map of symbols to load where the key is the symbol name and the value is the {@link FFIFunction}
   *
   * @example
   *
   * ```js
   * import {dlopen} from 'bun:ffi';
   *
   * const lib = dlopen("duckdb.dylib", {
   *   get_version: {
   *     returns: "cstring",
   *     args: [],
   *   },
   * });
   * lib.symbols.get_version();
   * // "1.0.0"
   * ```
   *
   * This is powered by just-in-time compiling C wrappers
   * that convert JavaScript types to C types and back. Internally,
   * bun uses [tinycc](https://github.com/TinyCC/tinycc), so a big thanks
   * goes to Fabrice Bellard and TinyCC maintainers for making this possible.
   *
   * @category FFI
   */
  function dlopen<Fns extends Record<string, FFIFunction>>(
    name: string | import("bun").BunFile | URL,
    symbols: Fns,
  ): Library<Fns>;

  /**
   * **Experimental:** Compile ISO C11 source code using TinyCC, and make {@link symbols} available as functions to JavaScript.
   *
   * @param options
   * @returns Library<Fns>
   *
   * @example
   * ## Hello, World!
   *
   * JavaScript:
   * ```js
   * import { cc } from "bun:ffi";
   * import source from "./hello.c" with {type: "file"};
   * const {symbols: {hello}} = cc({
   *   source,
   *   symbols: {
   *     hello: {
   *       returns: "cstring",
   *       args: [],
   *     },
   *   },
   * });
   * // "Hello, World!"
   * console.log(hello());
   * ```
   *
   * `./hello.c`:
   * ```c
   * #include <stdio.h>
   * const char* hello() {
   *   return "Hello, World!";
   * }
   * ```
   */
  function cc<Fns extends Record<string, FFIFunction>>(options: {
    /**
     * File path to an ISO C11 source file to compile and link
     */
    source: string | import("bun").BunFile | URL;

    /**
     * Library names to link against
     *
     * Equivalent to `-l` option in gcc/clang.
     */
    library?: string[] | string;

    /**
     * Include directories to pass to the compiler
     *
     * Equivalent to `-I` option in gcc/clang.
     */
    include?: string[] | string;

    /**
     * Map of symbols to load where the key is the symbol name and the value is the {@link FFIFunction}
     */
    symbols: Fns;

    /**
     * Map of symbols to define where the key is the symbol name and the value is the symbol value
     *
     * Equivalent to `-D` option in gcc/clang.
     *
     * @example
     * ```js
     * import { cc } from "bun:ffi";
     * import source from "./hello.c" with {type: "file"};
     * const {symbols: {hello}} = cc({
     *   source,
     *   define: {
     *     "NDEBUG": "1",
     *   },
     *   symbols: {
     *     hello: {
     *       returns: "cstring",
     *       args: [],
     *     },
     *   },
     * });
     * ```
     */
    define?: Record<string, string>;

    /**
     * Flags to pass to the compiler. Note: we do not make gurantees about which specific version of the compiler is used.
     *
     * @default "-std=c11 -Wl,--export-all-symbols -g -O2"
     *
     * This is useful for passing macOS frameworks to link against. Or if there are other options you want to pass to the compiler.
     *
     * @example
     * ```js
     * import { cc } from "bun:ffi";
     * import source from "./hello.c" with {type: "file"};
     * const {symbols: {hello}} = cc({
     *   source,
     *   flags: ["-framework CoreFoundation", "-framework Security"],
     *   symbols: {
     *     hello: {
     *       returns: "cstring",
     *       args: [],
     *     },
     *   },
     * });
     * ```
     */
    flags?: string | string[];
  }): Library<Fns>;

  /**
   * Turn a native library's function pointer into a JavaScript function
   *
   * Libraries using Node-API & bun:ffi in the same module could use this to skip an extra dlopen() step.
   *
   * @param fn {@link FFIFunction} declaration. `ptr` is required
   *
   * @example
   *
   * ```js
   * import {CFunction} from 'bun:ffi';
   *
   * const getVersion = new CFunction({
   *   returns: "cstring",
   *   args: [],
   *   ptr: myNativeLibraryGetVersion,
   * });
   * getVersion();
   * getVersion.close();
   * ```
   *
   * This is powered by just-in-time compiling C wrappers
   * that convert JavaScript types to C types and back. Internally,
   * bun uses [tinycc](https://github.com/TinyCC/tinycc), so a big thanks
   * goes to Fabrice Bellard and TinyCC maintainers for making this possible.
   */
  function CFunction(fn: FFIFunction & { ptr: Pointer }): CallableFunction & {
    /**
     * Free the memory allocated by the wrapping function
     */
    close(): void;
  };

  /**
   * Link a map of symbols to JavaScript functions
   *
   * This lets you use native libraries that were already loaded somehow. You usually will want {@link dlopen} instead.
   *
   * You could use this with Node-API to skip loading a second time.
   *
   * @param symbols Map of symbols to load where the key is the symbol name and the value is the {@link FFIFunction}
   *
   * @example
   *
   * ```js
   * import { linkSymbols } from "bun:ffi";
   *
   * const [majorPtr, minorPtr, patchPtr] = getVersionPtrs();
   *
   * const lib = linkSymbols({
   *   // Unlike with dlopen(), the names here can be whatever you want
   *   getMajor: {
   *     returns: "cstring",
   *     args: [],
   *
   *     // Since this doesn't use dlsym(), you have to provide a valid ptr
   *     // That ptr could be a number or a bigint
   *     // An invalid pointer will crash your program.
   *     ptr: majorPtr,
   *   },
   *   getMinor: {
   *     returns: "cstring",
   *     args: [],
   *     ptr: minorPtr,
   *   },
   *   getPatch: {
   *     returns: "cstring",
   *     args: [],
   *     ptr: patchPtr,
   *   },
   * });
   *
   * const [major, minor, patch] = [
   *   lib.symbols.getMajor(),
   *   lib.symbols.getMinor(),
   *   lib.symbols.getPatch(),
   * ];
   * ```
   *
   * This is powered by just-in-time compiling C wrappers
   * that convert JavaScript types to C types and back. Internally,
   * bun uses [tinycc](https://github.com/TinyCC/tinycc), so a big thanks
   * goes to Fabrice Bellard and TinyCC maintainers for making this possible.
   */
  function linkSymbols<Fns extends Record<string, FFIFunction>>(symbols: Fns): Library<Fns>;

  /**
   * Read a pointer as a {@link Buffer}
   *
   * If `byteLength` is not provided, the pointer is assumed to be 0-terminated.
   *
   * @param ptr The memory address to read
   * @param byteOffset bytes to skip before reading
   * @param byteLength bytes to read
   *
   * While there are some checks to catch invalid pointers, this is a difficult
   * thing to do safely. Passing an invalid pointer can crash the program and
   * reading beyond the bounds of the pointer will crash the program or cause
   * undefined behavior. Use with care!
   */
  function toBuffer(ptr: Pointer, byteOffset?: number, byteLength?: number): Buffer;

  /**
   * Read a pointer as an {@link ArrayBuffer}
   *
   * If `byteLength` is not provided, the pointer is assumed to be 0-terminated.
   *
   * @param ptr The memory address to read
   * @param byteOffset bytes to skip before reading
   * @param byteLength bytes to read
   *
   * While there are some checks to catch invalid pointers, this is a difficult
   * thing to do safely. Passing an invalid pointer can crash the program and
   * reading beyond the bounds of the pointer will crash the program or cause
   * undefined behavior. Use with care!
   */
  function toArrayBuffer(ptr: Pointer, byteOffset?: number, byteLength?: number): ArrayBuffer;

  namespace read {
    /**
     * The read function behaves similarly to DataView,
     * but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.
     *
     * @param ptr The memory address to read
     * @param byteOffset bytes to skip before reading
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    function u8(ptr: Pointer, byteOffset?: number): number;
    /**
     * The read function behaves similarly to DataView,
     * but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.
     *
     * @param ptr The memory address to read
     * @param byteOffset bytes to skip before reading
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    function i8(ptr: Pointer, byteOffset?: number): number;
    /**
     * The read function behaves similarly to DataView,
     * but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.
     *
     * @param ptr The memory address to read
     * @param byteOffset bytes to skip before reading
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    function u16(ptr: Pointer, byteOffset?: number): number;
    /**
     * The read function behaves similarly to DataView,
     * but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.
     *
     * @param ptr The memory address to read
     * @param byteOffset bytes to skip before reading
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    function i16(ptr: Pointer, byteOffset?: number): number;
    /**
     * The read function behaves similarly to DataView,
     * but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.
     *
     * @param ptr The memory address to read
     * @param byteOffset bytes to skip before reading
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    function u32(ptr: Pointer, byteOffset?: number): number;
    /**
     * The read function behaves similarly to DataView,
     * but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.
     *
     * @param ptr The memory address to read
     * @param byteOffset bytes to skip before reading
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    function i32(ptr: Pointer, byteOffset?: number): number;
    /**
     * The read function behaves similarly to DataView,
     * but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.
     *
     * @param ptr The memory address to read
     * @param byteOffset bytes to skip before reading
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    function f32(ptr: Pointer, byteOffset?: number): number;
    /**
     * The read function behaves similarly to DataView,
     * but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.
     *
     * @param ptr The memory address to read
     * @param byteOffset bytes to skip before reading
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    function u64(ptr: Pointer, byteOffset?: number): bigint;
    /**
     * The read function behaves similarly to DataView,
     * but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.
     *
     * @param ptr The memory address to read
     * @param byteOffset bytes to skip before reading
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    function i64(ptr: Pointer, byteOffset?: number): bigint;
    /**
     * The read function behaves similarly to DataView,
     * but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.
     *
     * @param ptr The memory address to read
     * @param byteOffset bytes to skip before reading
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    function f64(ptr: Pointer, byteOffset?: number): number;
    /**
     * The read function behaves similarly to DataView,
     * but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.
     *
     * @param ptr The memory address to read
     * @param byteOffset bytes to skip before reading
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    function ptr(ptr: Pointer, byteOffset?: number): number;
    /**
     * The read function behaves similarly to DataView,
     * but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.
     *
     * @param ptr The memory address to read
     * @param byteOffset bytes to skip before reading
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    function intptr(ptr: Pointer, byteOffset?: number): number;
  }

  /**
   * Get the pointer backing a {@link TypedArray} or {@link ArrayBuffer}
   *
   * Use this to pass {@link TypedArray} or {@link ArrayBuffer} to C functions.
   *
   * This is for use with FFI functions. For performance reasons, FFI will
   * not automatically convert typed arrays to C pointers.
   *
   * @param {TypedArray|ArrayBuffer|DataView} view the typed array or array buffer to get the pointer for
   * @param {number} byteOffset optional offset into the view in bytes
   *
   * @example
   *
   * From JavaScript:
   * ```js
   * const array = new Uint8Array(10);
   * const rawPtr = ptr(array);
   * myFFIFunction(rawPtr);
   * ```
   * To C:
   * ```c
   * void myFFIFunction(char* rawPtr) {
   *  // Do something with rawPtr
   * }
   * ```
   *
   * @category FFI
   */
  function ptr(view: NodeJS.TypedArray | ArrayBufferLike | DataView, byteOffset?: number): Pointer;

  /**
   * Get a string from a UTF-8 encoded C string
   * If `byteLength` is not provided, the string is assumed to be null-terminated.
   *
   * @example
   * ```js
   * var ptr = lib.symbols.getVersion();
   * console.log(new CString(ptr));
   * ```
   *
   * @example
   * ```js
   * var ptr = lib.symbols.getVersion();
   * // print the first 4 characters
   * console.log(new CString(ptr, 0, 4));
   * ```
   *
   * While there are some checks to catch invalid pointers, this is a difficult
   * thing to do safely. Passing an invalid pointer can crash the program and
   * reading beyond the bounds of the pointer will crash the program or cause
   * undefined behavior. Use with care!
   *
   * @category FFI
   */
  class CString extends String {
    /**
     * Get a string from a UTF-8 encoded C string
     * If `byteLength` is not provided, the string is assumed to be null-terminated.
     *
     * @param ptr The pointer to the C string
     * @param byteOffset bytes to skip before reading
     * @param byteLength bytes to read
     *
     * @example
     * ```js
     * var ptr = lib.symbols.getVersion();
     * console.log(new CString(ptr));
     * ```
     *
     * @example
     * ```js
     * var ptr = lib.symbols.getVersion();
     * // print the first 4 characters
     * console.log(new CString(ptr, 0, 4));
     * ```
     *
     * While there are some checks to catch invalid pointers, this is a difficult
     * thing to do safely. Passing an invalid pointer can crash the program and
     * reading beyond the bounds of the pointer will crash the program or cause
     * undefined behavior. Use with care!
     */
    constructor(ptr: Pointer, byteOffset?: number, byteLength?: number);

    /**
     * The ptr to the C string
     *
     * This `CString` instance is a clone of the string, so it
     * is safe to continue using this instance after the `ptr` has been
     * freed.
     */
    ptr: Pointer;
    byteOffset?: number;
    byteLength?: number;

    /**
     * Get the {@link ptr} as an `ArrayBuffer`
     *
     * `null` or empty ptrs returns an `ArrayBuffer` with `byteLength` 0
     */
    get arrayBuffer(): ArrayBuffer;
  }

  /**
   * Pass a JavaScript function to FFI (Foreign Function Interface)
   */
  class JSCallback {
    /**
     * Enable a JavaScript callback function to be passed to C with bun:ffi
     *
     * @param callback The JavaScript function to be called
     * @param definition The C function definition
     */
    constructor(callback: (...args: any[]) => any, definition: FFIFunction);

    /**
     * The pointer to the C function
     *
     * Becomes `null` once {@link JSCallback.prototype.close} is called
     */
    readonly ptr: Pointer | null;

    /**
     * Can the callback be called from a different thread?
     */
    readonly threadsafe: boolean;

    /**
     * Free the memory allocated for the callback
     *
     * If called multiple times, does nothing after the first call.
     */
    close(): void;
  }

  /**
   * View the generated C code for FFI bindings
   *
   * You probably won't need this unless there's a bug in the FFI bindings
   * generator or you're just curious.
   */
  function viewSource(symbols: Symbols, is_callback?: false): string[];
  function viewSource(callback: FFIFunction, is_callback: true): string;

  /**
   * Platform-specific file extension name for dynamic libraries
   *
   * "." is not included
   *
   * @example
   * ```js
   * "dylib" // macOS
   * ```
   *
   * @example
   * ```js
   * "so" // linux
   * ```
   */
  const suffix: string;
}

declare namespace HTMLRewriterTypes {
  interface HTMLRewriterElementContentHandlers {
    element?(element: Element): void | Promise<void>;
    comments?(comment: Comment): void | Promise<void>;
    text?(text: Text): void | Promise<void>;
  }

  interface HTMLRewriterDocumentContentHandlers {
    doctype?(doctype: Doctype): void | Promise<void>;
    comments?(comment: Comment): void | Promise<void>;
    text?(text: Text): void | Promise<void>;
    end?(end: DocumentEnd): void | Promise<void>;
  }

  interface Text {
    /** The text content */
    readonly text: string;
    /** Whether this chunk is the last piece of text in a text node */
    readonly lastInTextNode: boolean;
    /** Whether this chunk was removed */
    readonly removed: boolean;
    /** Insert content before this chunk */
    before(content: Content, options?: ContentOptions): Text;
    /** Insert content after this chunk */
    after(content: Content, options?: ContentOptions): Text;
    /** Replace this chunk with new content */
    replace(content: Content, options?: ContentOptions): Text;
    /** Remove this chunk */
    remove(): Text;
  }

  interface Doctype {
    /** The doctype name (e.g. "html" for <!DOCTYPE html>) */
    readonly name: string | null;
    /** The doctype public identifier */
    readonly publicId: string | null;
    /** The doctype system identifier */
    readonly systemId: string | null;
    /** Whether this doctype was removed */
    readonly removed: boolean;
    /** Remove this doctype */
    remove(): Doctype;
  }

  interface DocumentEnd {
    /** Append content at the end of the document */
    append(content: Content, options?: ContentOptions): DocumentEnd;
  }

  interface ContentOptions {
    /** Whether to parse the content as HTML */
    html?: boolean;
  }

  type Content = string;

  interface Comment {
    /** The comment text */
    text: string;
    /** Whether this comment was removed */
    readonly removed: boolean;
    /** Insert content before this comment */
    before(content: Content, options?: ContentOptions): Comment;
    /** Insert content after this comment */
    after(content: Content, options?: ContentOptions): Comment;
    /** Replace this comment with new content */
    replace(content: Content, options?: ContentOptions): Comment;
    /** Remove this comment */
    remove(): Comment;
  }

  interface Element {
    /** The tag name in lowercase (e.g. "div", "span") */
    tagName: string;
    /** Iterator for the element's attributes */
    readonly attributes: IterableIterator<[string, string]>;
    /** Whether this element was removed */
    readonly removed: boolean;
    /** Whether the element is explicitly self-closing, e.g. <foo /> */
    readonly selfClosing: boolean;
    /**
     * Whether the element can have inner content. Returns `true` unless
     * - the element is an [HTML void element](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)
     * - or it's self-closing in a foreign context (eg. in SVG, MathML).
     */
    readonly canHaveContent: boolean;
    /** The element's namespace URI */
    readonly namespaceURI: string;
    /** Get an attribute value by name */
    getAttribute(name: string): string | null;
    /** Check if an attribute exists */
    hasAttribute(name: string): boolean;
    /** Set an attribute value */
    setAttribute(name: string, value: string): Element;
    /** Remove an attribute */
    removeAttribute(name: string): Element;
    /** Insert content before this element */
    before(content: Content, options?: ContentOptions): Element;
    /** Insert content after this element */
    after(content: Content, options?: ContentOptions): Element;
    /** Insert content at the start of this element */
    prepend(content: Content, options?: ContentOptions): Element;
    /** Insert content at the end of this element */
    append(content: Content, options?: ContentOptions): Element;
    /** Replace this element with new content */
    replace(content: Content, options?: ContentOptions): Element;
    /** Remove this element and its contents */
    remove(): Element;
    /** Remove this element but keep its contents */
    removeAndKeepContent(): Element;
    /** Set the inner content of this element */
    setInnerContent(content: Content, options?: ContentOptions): Element;
    /** Add a handler for the end tag of this element */
    onEndTag(handler: (tag: EndTag) => void | Promise<void>): void;
  }

  interface EndTag {
    /** The tag name in lowercase */
    name: string;
    /** Insert content before this end tag */
    before(content: Content, options?: ContentOptions): EndTag;
    /** Insert content after this end tag */
    after(content: Content, options?: ContentOptions): EndTag;
    /** Remove this end tag */
    remove(): EndTag;
  }
}

/**
 * [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter?bun) is a fast API for transforming HTML.
 *
 * Bun leverages a native implementation powered by [lol-html](https://github.com/cloudflare/lol-html).
 *
 * HTMLRewriter can be used to transform HTML in a variety of ways, including:
 * * Rewriting URLs
 * * Adding meta tags
 * * Removing elements
 * * Adding elements to the head
 *
 * @example
 * ```ts
 * const rewriter = new HTMLRewriter().on('a[href]', {
 *   element(element: Element) {
 *     // Rewrite all the URLs to this youtube video
 *     element.setAttribute('href', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 *   }
 * });
 * rewriter.transform(await fetch("https://remix.run"));
 * ```
 *
 * @category HTML Manipulation
 */
declare class HTMLRewriter {
  constructor();
  /**
   * Add handlers for elements matching a CSS selector
   * @param selector - A CSS selector (e.g. "div", "a[href]", ".class")
   * @param handlers - Object containing handler functions for elements, comments, and text nodes
   */
  on(selector: string, handlers: HTMLRewriterTypes.HTMLRewriterElementContentHandlers): HTMLRewriter;

  /**
   * Add handlers for document-level events
   * @param handlers - Object containing handler functions for doctype, comments, text nodes and document end
   */
  onDocument(handlers: HTMLRewriterTypes.HTMLRewriterDocumentContentHandlers): HTMLRewriter;

  /**
   * Transform HTML content
   * @param input - The HTML to transform
   * @returns A new {@link Response} with the transformed HTML
   */
  transform(input: Response | Blob | Bun.BufferSource): Response;
  /**
   * Transform HTML content
   * @param input - The HTML string to transform
   * @returns A new {@link String} containing the transformed HTML
   */
  transform(input: string): string;
  /**
   * Transform HTML content
   * @param input - The HTML to transform as a {@link ArrayBuffer}
   * @returns A new {@link ArrayBuffer} with the transformed HTML
   */
  transform(input: ArrayBuffer): ArrayBuffer;
}

declare module "bun:jsc" {
  /**
   * This used to be called "describe" but it could be confused with the test runner.
   */
  function jscDescribe(value: any): string;
  function jscDescribeArray(args: any[]): string;
  function gcAndSweep(): number;
  function fullGC(): number;
  function edenGC(): number;
  function heapSize(): number;
  function heapStats(): HeapStats;
  function memoryUsage(): MemoryUsage;
  function getRandomSeed(): number;
  function setRandomSeed(value: number): void;
  function isRope(input: string): boolean;
  function callerSourceOrigin(): string;
  function noFTL(func: (...args: any[]) => any): (...args: any[]) => any;
  function noOSRExitFuzzing(func: (...args: any[]) => any): (...args: any[]) => any;
  function optimizeNextInvocation(func: (...args: any[]) => any): void;
  function numberOfDFGCompiles(func: (...args: any[]) => any): number;
  function releaseWeakRefs(): void;
  function totalCompileTime(func: (...args: any[]) => any): number;
  function reoptimizationRetryCount(func: (...args: any[]) => any): number;
  function drainMicrotasks(): void;

  /**
   * Convert a JavaScript value to a binary representation that can be sent to another Bun instance.
   *
   * Internally, this uses the serialization format from WebKit/Safari.
   *
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @returns A SharedArrayBuffer that can be sent to another Bun instance.
   */
  function serialize(value: any, options?: { binaryType?: "arraybuffer" }): SharedArrayBuffer;

  /**
   * Convert a JavaScript value to a binary representation that can be sent to another Bun instance.
   *
   * Internally, this uses the serialization format from WebKit/Safari.
   *
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @returns A Buffer that can be sent to another Bun instance.
   */
  function serialize(value: any, options?: { binaryType: "nodebuffer" }): Buffer;

  /**
   * Convert an ArrayBuffer or Buffer to a JavaScript value compatible with the HTML Structured Clone Algorithm.
   *
   * @param value A serialized value, usually an ArrayBuffer or Buffer, to be converted.
   */
  function deserialize(value: ArrayBufferLike | NodeJS.TypedArray | Buffer): any;

  /**
   * Set the timezone used by Intl, Date, etc.
   *
   * @param timeZone A string representing the time zone to use, such as "America/Los_Angeles"
   *
   * @returns The normalized time zone string
   *
   * You can also set process.env.TZ to the time zone you want to use.
   * You can also view the current timezone with `Intl.DateTimeFormat().resolvedOptions().timeZone`
   */
  function setTimeZone(timeZone: string): string;

  interface HeapStats {
    heapSize: number;
    heapCapacity: number;
    extraMemorySize: number;
    objectCount: number;
    protectedObjectCount: number;
    globalObjectCount: number;
    protectedGlobalObjectCount: number;
    objectTypeCounts: Record<string, number>;
    protectedObjectTypeCounts: Record<string, number>;
  }

  interface MemoryUsage {
    current: number;
    peak: number;
    currentCommit: number;
    peakCommit: number;
    pageFaults: number;
  }

  interface SamplingProfile {
    /**
     * A formatted summary of the top functions
     *
     * Example output:
     * ```js
     *
     * Sampling rate: 100.000000 microseconds. Total samples: 6858
     * Top functions as <numSamples  'functionName#hash:sourceID'>
     * 2948    '#<nil>:8'
     * 393    'visit#<nil>:8'
     * 263    'push#<nil>:8'
     * 164    'scan_ref_scoped#<nil>:8'
     * 164    'walk#<nil>:8'
     * 144    'pop#<nil>:8'
     * 107    'extract_candidates#<nil>:8'
     *  94    'get#<nil>:8'
     *  82    'Function#<nil>:4294967295'
     *  79    'set#<nil>:8'
     *  67    'forEach#<nil>:5'
     *  58    'collapse#<nil>:8'
     * ```
     */
    functions: string;
    /**
     * A formatted summary of the top bytecodes
     *
     * Example output:
     * ```js
     * Tier breakdown:
     * -----------------------------------
     * LLInt:                   106  (1.545640%)
     * Baseline:               2355  (34.339458%)
     * DFG:                    3290  (47.973170%)
     * FTL:                     833  (12.146398%)
     * js builtin:              132  (1.924759%)
     * Wasm:                      0  (0.000000%)
     * Host:                    111  (1.618548%)
     * RegExp:                   15  (0.218723%)
     * C/C++:                     0  (0.000000%)
     * Unknown Executable:      148  (2.158064%)
     *
     * Hottest bytecodes as <numSamples   'functionName#hash:JITType:bytecodeIndex'>
     * 273    'visit#<nil>:DFG:bc#63'
     * 121    'walk#<nil>:DFG:bc#7'
     * 119    '#<nil>:Baseline:bc#1'
     * 82    'Function#<nil>:None:<nil>'
     * 66    '#<nil>:DFG:bc#11'
     * 65    '#<nil>:DFG:bc#33'
     * 58    '#<nil>:Baseline:bc#7'
     * 53    '#<nil>:Baseline:bc#23'
     * 50    'forEach#<nil>:DFG:bc#83'
     * 49    'pop#<nil>:FTL:bc#65'
     * 47    '#<nil>:DFG:bc#99'
     * 45    '#<nil>:DFG:bc#16'
     * 44    '#<nil>:DFG:bc#7'
     * 44    '#<nil>:Baseline:bc#30'
     * 44    'push#<nil>:FTL:bc#214'
     * 41    '#<nil>:DFG:bc#50'
     * 39    'get#<nil>:DFG:bc#27'
     * 39    '#<nil>:Baseline:bc#0'
     * 36    '#<nil>:DFG:bc#27'
     * 36    'Dictionary#<nil>:DFG:bc#41'
     * 36    'visit#<nil>:DFG:bc#81'
     * 36    'get#<nil>:FTL:bc#11'
     * 32    'push#<nil>:FTL:bc#49'
     * 31    '#<nil>:DFG:bc#76'
     * 31    '#<nil>:DFG:bc#10'
     * 31    '#<nil>:DFG:bc#73'
     * 29    'set#<nil>:DFG:bc#28'
     * 28    'in_boolean_context#<nil>:DFG:bc#104'
     * 28    '#<nil>:Baseline:<nil>'
     * 28    'regExpSplitFast#<nil>:None:<nil>'
     * 26    'visit#<nil>:DFG:bc#95'
     * 26    'pop#<nil>:FTL:bc#120'
     * 25    '#<nil>:DFG:bc#23'
     * 25    'push#<nil>:FTL:bc#152'
     * 24    'push#<nil>:FTL:bc#262'
     * 24    '#<nil>:FTL:bc#10'
     * 23    'is_identifier_char#<nil>:DFG:bc#22'
     * 23    'visit#<nil>:DFG:bc#22'
     * 22    '#<nil>:FTL:bc#27'
     * 22    'indexOf#<nil>:None:<nil>'
     * ```
     */
    bytecodes: string;

    /**
     * Stack traces of the top functions
     */
    stackTraces: string[];
  }

  /**
   * Run JavaScriptCore's sampling profiler for a particular function
   *
   * This is pretty low-level.
   *
   * Things to know:
   * - LLint means "Low Level Interpreter", which is the interpreter that runs before any JIT compilation
   * - Baseline is the first JIT compilation tier. It's the least optimized, but the fastest to compile
   * - DFG means "Data Flow Graph", which is the second JIT compilation tier. It has some optimizations, but is slower to compile
   * - FTL means "Faster Than Light", which is the third JIT compilation tier. It has the most optimizations, but is the slowest to compile
   */
  function profile<T extends (...args: any[]) => any>(
    callback: T,
    sampleInterval?: number,
    ...args: Parameters<T>
  ): ReturnType<T> extends Promise<infer U> ? Promise<SamplingProfile> : SamplingProfile;

  /**
   * This returns objects which native code has explicitly protected from being
   * garbage collected
   *
   * By calling this function you create another reference to the object, which
   * will further prevent it from being garbage collected
   *
   * This function is mostly a debugging tool for bun itself.
   *
   * Warning: not all objects returned are supposed to be observable from JavaScript
   */
  function getProtectedObjects(): any[];

  /**
   * Start a remote debugging socket server on the given port.
   *
   * This exposes JavaScriptCore's built-in debugging server.
   *
   * This is untested. May not be supported yet on macOS
   */
  function startRemoteDebugger(host?: string, port?: number): void;

  /**
   * Run JavaScriptCore's sampling profiler
   */
  function startSamplingProfiler(optionalDirectory?: string): void;

  /**
   * Non-recursively estimate the memory usage of an object, excluding the memory usage of
   * properties or other objects it references. For more accurate per-object
   * memory usage, use {@link Bun.generateHeapSnapshot}.
   *
   * This is a best-effort estimate. It may not be 100% accurate. When it's
   * wrong, it may mean the memory is non-contiguous (such as a large array).
   *
   * Passing a primitive type that isn't heap allocated returns 0.
   */
  function estimateShallowMemoryUsageOf(value: object | CallableFunction | bigint | symbol | string): number;
}

/**
 * Fast SQLite3 driver for Bun.js
 * @since v0.0.83
 *
 * @example
 * ```ts
 * import { Database } from 'bun:sqlite';
 *
 * const db = new Database('app.db');
 * db.query('SELECT * FROM users WHERE name = ?').all('John');
 * // => [{ id: 1, name: 'John' }]
 * ```
 *
 * The following types can be used when binding parameters:
 *
 * | JavaScript type | SQLite type            |
 * | --------------- | ---------------------- |
 * | `string`        | `TEXT`                 |
 * | `number`        | `INTEGER` or `DECIMAL` |
 * | `boolean`       | `INTEGER` (1 or 0)     |
 * | `Uint8Array`    | `BLOB`                 |
 * | `Buffer`        | `BLOB`                 |
 * | `bigint`        | `INTEGER`              |
 * | `null`          | `NULL`                 |
 */
declare module "bun:sqlite" {
  /**
   * A SQLite3 database
   *
   * @example
   * ```ts
   * const db = new Database("mydb.sqlite");
   * db.run("CREATE TABLE foo (bar TEXT)");
   * db.run("INSERT INTO foo VALUES (?)", ["baz"]);
   * console.log(db.query("SELECT * FROM foo").all());
   * ```
   *
   * @example
   *
   * Open an in-memory database
   *
   * ```ts
   * const db = new Database(":memory:");
   * db.run("CREATE TABLE foo (bar TEXT)");
   * db.run("INSERT INTO foo VALUES (?)", ["hiiiiii"]);
   * console.log(db.query("SELECT * FROM foo").all());
   * ```
   *
   * @example
   *
   * Open read-only
   *
   * ```ts
   * const db = new Database("mydb.sqlite", {readonly: true});
   * ```
   *
   * @category Database
   */
  export class Database implements Disposable {
    /**
     * Open or create a SQLite3 database
     *
     * @param filename The filename of the database to open. Pass an empty string (`""`) or `":memory:"` or undefined for an in-memory database.
     * @param options defaults to `{readwrite: true, create: true}`. If a number, then it's treated as `SQLITE_OPEN_*` constant flags.
     */
    constructor(
      filename?: string,
      options?:
        | number
        | {
            /**
             * Open the database as read-only (no write operations, no create).
             *
             * Equivalent to {@link constants.SQLITE_OPEN_READONLY}
             */
            readonly?: boolean;
            /**
             * Allow creating a new database
             *
             * Equivalent to {@link constants.SQLITE_OPEN_CREATE}
             */
            create?: boolean;
            /**
             * Open the database as read-write
             *
             * Equivalent to {@link constants.SQLITE_OPEN_READWRITE}
             */
            readwrite?: boolean;

            /**
             * When set to `true`, integers are returned as `bigint` types.
             *
             * When set to `false`, integers are returned as `number` types and truncated to 52 bits.
             *
             * @default false
             * @since v1.1.14
             */
            safeIntegers?: boolean;

            /**
             * When set to `false` or `undefined`:
             * - Queries missing bound parameters will NOT throw an error
             * - Bound named parameters in JavaScript need to exactly match the SQL query.
             *
             * @example
             * ```ts
             * const db = new Database(":memory:", { strict: false });
             * db.run("INSERT INTO foo (name) VALUES ($name)", { $name: "foo" });
             * ```
             *
             * When set to `true`:
             * - Queries missing bound parameters will throw an error
             * - Bound named parameters in JavaScript no longer need to be `$`, `:`, or `@`. The SQL query will remain prefixed.
             *
             * @example
             * ```ts
             * const db = new Database(":memory:", { strict: true });
             * db.run("INSERT INTO foo (name) VALUES ($name)", { name: "foo" });
             * ```
             * @since v1.1.14
             */
            strict?: boolean;
          },
    );

    /**
     * This is an alias of `new Database()`
     *
     * See {@link Database}
     */
    static open(
      filename: string,
      options?:
        | number
        | {
            /**
             * Open the database as read-only (no write operations, no create).
             *
             * Equivalent to {@link constants.SQLITE_OPEN_READONLY}
             */
            readonly?: boolean;
            /**
             * Allow creating a new database
             *
             * Equivalent to {@link constants.SQLITE_OPEN_CREATE}
             */
            create?: boolean;
            /**
             * Open the database as read-write
             *
             * Equivalent to {@link constants.SQLITE_OPEN_READWRITE}
             */
            readwrite?: boolean;
          },
    ): Database;

    /**
     * Execute a SQL query **without returning any results**.
     *
     * This does not cache the query, so if you want to run a query multiple times, you should use {@link prepare} instead.
     *
     * Under the hood, this calls `sqlite3_prepare_v3` followed by `sqlite3_step` and `sqlite3_finalize`.
     *
     * The following types can be used when binding parameters:
     *
     * | JavaScript type | SQLite type            |
     * | --------------- | ---------------------- |
     * | `string`        | `TEXT`                 |
     * | `number`        | `INTEGER` or `DECIMAL` |
     * | `boolean`       | `INTEGER` (1 or 0)     |
     * | `Uint8Array`    | `BLOB`                 |
     * | `Buffer`        | `BLOB`                 |
     * | `bigint`        | `INTEGER`              |
     * | `null`          | `NULL`                 |
     *
     * @example
     * ```ts
     * db.run("CREATE TABLE foo (bar TEXT)");
     * db.run("INSERT INTO foo VALUES (?)", ["baz"]);
     * ```
     *
     * Useful for queries like:
     * - `CREATE TABLE`
     * - `INSERT INTO`
     * - `UPDATE`
     * - `DELETE FROM`
     * - `DROP TABLE`
     * - `PRAGMA`
     * - `ATTACH DATABASE`
     * - `DETACH DATABASE`
     * - `REINDEX`
     * - `VACUUM`
     * - `EXPLAIN ANALYZE`
     * - `CREATE INDEX`
     * - `CREATE TRIGGER`
     * - `CREATE VIEW`
     * - `CREATE VIRTUAL TABLE`
     * - `CREATE TEMPORARY TABLE`
     *
     * @param sql The SQL query to run
     * @param bindings Optional bindings for the query
     *
     * @returns `Database` instance
     */
    run<ParamsType extends SQLQueryBindings[]>(sql: string, ...bindings: ParamsType[]): Changes;
    /**
     * This is an alias of {@link Database.run}
     */
    exec<ParamsType extends SQLQueryBindings[]>(sql: string, ...bindings: ParamsType[]): Changes;

    /**
     * Compile a SQL query and return a {@link Statement} object. This is the
     * same as {@link prepare} except that it caches the compiled query.
     *
     * This **does not execute** the query, but instead prepares it for later
     * execution and caches the compiled query if possible.
     *
     * Under the hood, this calls `sqlite3_prepare_v3`.
     *
     * @example
     * ```ts
     * // compile the query
     * const stmt = db.query("SELECT * FROM foo WHERE bar = ?");
     * // run the query
     * stmt.all("baz");
     *
     * // run the query again
     * stmt.all();
     * ```
     *
     * @param sql The SQL query to compile
     * @returns `Statment` instance
     */
    query<ReturnType, ParamsType extends SQLQueryBindings | SQLQueryBindings[]>(
      sql: string,
    ): Statement<ReturnType, ParamsType extends any[] ? ParamsType : [ParamsType]>;

    /**
     * Compile a SQL query and return a {@link Statement} object.
     *
     * This does not cache the compiled query and does not execute the query.
     *
     * Under the hood, this calls `sqlite3_prepare_v3`.
     *
     * @example
     * ```ts
     * // compile the query
     * const stmt = db.query("SELECT * FROM foo WHERE bar = ?");
     * // run the query
     * stmt.all("baz");
     * ```
     *
     * @param sql The SQL query to compile
     * @param params Optional bindings for the query
     *
     * @returns A {@link Statement} instance
     */
    prepare<ReturnType, ParamsType extends SQLQueryBindings | SQLQueryBindings[]>(
      sql: string,
      params?: ParamsType,
    ): Statement<ReturnType, ParamsType extends any[] ? ParamsType : [ParamsType]>;

    /**
     * Is the database in a transaction?
     *
     * @returns `true` if the database is in a transaction, `false` otherwise
     *
     * @example
     * ```ts
     * db.run("CREATE TABLE foo (bar TEXT)");
     * db.run("INSERT INTO foo VALUES (?)", ["baz"]);
     * db.run("BEGIN");
     * db.run("INSERT INTO foo VALUES (?)", ["qux"]);
     * console.log(db.inTransaction());
     * ```
     */
    get inTransaction(): boolean;

    /**
     * Close the database connection.
     *
     * It is safe to call this method multiple times. If the database is already
     * closed, this is a no-op. Running queries after the database has been
     * closed will throw an error.
     *
     * @example
     * ```ts
     * db.close();
     * ```
     * This is called automatically when the database instance is garbage collected.
     *
     * Internally, this calls `sqlite3_close_v2`.
     */
    close(
      /**
       * If `true`, then the database will throw an error if it is in use
       * @default false
       *
       * When true, this calls `sqlite3_close` instead of `sqlite3_close_v2`.
       *
       * Learn more about this in the [sqlite3 documentation](https://www.sqlite.org/c3ref/close.html).
       *
       * Bun will automatically call close by default when the database instance is garbage collected.
       * In The future, Bun may default `throwOnError` to be true but for backwards compatibility, it is false by default.
       */
      throwOnError?: boolean,
    ): void;

    /**
     * The filename passed when `new Database()` was called
     * @example
     * ```ts
     * const db = new Database("mydb.sqlite");
     * console.log(db.filename);
     * // => "mydb.sqlite"
     * ```
     */
    readonly filename: string;

    /**
     * The underlying `sqlite3` database handle
     *
     * In native code, this is not a file descriptor, but an index into an array of database handles
     */
    readonly handle: number;

    /**
     * Load a SQLite3 extension
     *
     * macOS requires a custom SQLite3 library to be linked because the Apple build of SQLite for macOS disables loading extensions. See {@link Database.setCustomSQLite}
     *
     * Bun chooses the Apple build of SQLite on macOS because it brings a ~50% performance improvement.
     *
     * @param extension name/path of the extension to load
     * @param entryPoint optional entry point of the extension
     */
    loadExtension(extension: string, entryPoint?: string): void;

    /**
     * Change the dynamic library path to SQLite
     *
     * @note macOS-only
     *
     * This only works before SQLite is loaded, so
     * that's before you call `new Database()`.
     *
     * It can only be run once because this will load
     * the SQLite library into the process.
     *
     * @param path The path to the SQLite library
     */
    static setCustomSQLite(path: string): boolean;

    [Symbol.dispose](): void;

    /**
     * Creates a function that always runs inside a transaction. When the
     * function is invoked, it will begin a new transaction. When the function
     * returns, the transaction will be committed. If an exception is thrown,
     * the transaction will be rolled back (and the exception will propagate as
     * usual).
     *
     * @param insideTransaction The callback which runs inside a transaction
     *
     * @example
     * ```ts
     * // setup
     * import { Database } from "bun:sqlite";
     * const db = Database.open(":memory:");
     * db.exec(
     *   "CREATE TABLE cats (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, age INTEGER)"
     * );
     *
     * const insert = db.prepare("INSERT INTO cats (name, age) VALUES ($name, $age)");
     * const insertMany = db.transaction((cats) => {
     *   for (const cat of cats) insert.run(cat);
     * });
     *
     * insertMany([
     *   { $name: "Joey", $age: 2 },
     *   { $name: "Sally", $age: 4 },
     *   { $name: "Junior", $age: 1 },
     * ]);
     * ```
     */
    transaction(insideTransaction: (...args: any) => void): CallableFunction & {
      /**
       * uses "BEGIN DEFERRED"
       */
      deferred: (...args: any) => void;
      /**
       * uses "BEGIN IMMEDIATE"
       */
      immediate: (...args: any) => void;
      /**
       * uses "BEGIN EXCLUSIVE"
       */
      exclusive: (...args: any) => void;
    };

    /**
     * Save the database to an in-memory {@link Buffer} object.
     *
     * Internally, this calls `sqlite3_serialize`.
     *
     * @param name Name to save the database as @default "main"
     * @returns Buffer containing the serialized database
     */
    serialize(name?: string): Buffer;

    /**
     * Load a serialized SQLite3 database
     *
     * Internally, this calls `sqlite3_deserialize`.
     *
     * @param serialized Data to load
     * @returns `Database` instance
     *
     * @example
     * ```ts
     * test("supports serialize/deserialize", () => {
     *     const db = Database.open(":memory:");
     *     db.exec("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)");
     *     db.exec('INSERT INTO test (name) VALUES ("Hello")');
     *     db.exec('INSERT INTO test (name) VALUES ("World")');
     *
     *     const input = db.serialize();
     *     const db2 = new Database(input);
     *
     *     const stmt = db2.prepare("SELECT * FROM test");
     *     expect(JSON.stringify(stmt.get())).toBe(
     *       JSON.stringify({
     *         id: 1,
     *         name: "Hello",
     *       }),
     *     );
     *
     *     expect(JSON.stringify(stmt.all())).toBe(
     *       JSON.stringify([
     *         {
     *           id: 1,
     *           name: "Hello",
     *         },
     *         {
     *           id: 2,
     *           name: "World",
     *         },
     *       ]),
     *     );
     *     db2.exec("insert into test (name) values ('foo')");
     *     expect(JSON.stringify(stmt.all())).toBe(
     *       JSON.stringify([
     *         {
     *           id: 1,
     *           name: "Hello",
     *         },
     *         {
     *           id: 2,
     *           name: "World",
     *         },
     *         {
     *           id: 3,
     *           name: "foo",
     *         },
     *       ]),
     *     );
     *
     *     const db3 = Database.deserialize(input, true);
     *     try {
     *       db3.exec("insert into test (name) values ('foo')");
     *       throw new Error("Expected error");
     *     } catch (e) {
     *       expect(e.message).toBe("attempt to write a readonly database");
     *     }
     * });
     * ```
     */
    static deserialize(serialized: NodeJS.TypedArray | ArrayBufferLike, isReadOnly?: boolean): Database;

    /**
     * Load a serialized SQLite3 database. This version enables you to specify
     * additional options such as `strict` to put the database into strict mode.
     *
     * Internally, this calls `sqlite3_deserialize`.
     *
     * @param serialized Data to load
     * @returns `Database` instance
     *
     * @example
     * ```ts
     * test("supports serialize/deserialize", () => {
     *     const db = Database.open(":memory:");
     *     db.exec("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)");
     *     db.exec('INSERT INTO test (name) VALUES ("Hello")');
     *     db.exec('INSERT INTO test (name) VALUES ("World")');
     *
     *     const input = db.serialize();
     *     const db2 = Database.deserialize(input, { strict: true });
     *
     *     const stmt = db2.prepare("SELECT * FROM test");
     *     expect(JSON.stringify(stmt.get())).toBe(
     *       JSON.stringify({
     *         id: 1,
     *         name: "Hello",
     *       }),
     *     );
     *
     *     expect(JSON.stringify(stmt.all())).toBe(
     *       JSON.stringify([
     *         {
     *           id: 1,
     *           name: "Hello",
     *         },
     *         {
     *           id: 2,
     *           name: "World",
     *         },
     *       ]),
     *     );
     *     db2.exec("insert into test (name) values ($foo)", { foo: "baz" });
     *     expect(JSON.stringify(stmt.all())).toBe(
     *       JSON.stringify([
     *         {
     *           id: 1,
     *           name: "Hello",
     *         },
     *         {
     *           id: 2,
     *           name: "World",
     *         },
     *         {
     *           id: 3,
     *           name: "baz",
     *         },
     *       ]),
     *     );
     *
     *     const db3 = Database.deserialize(input, { readonly: true, strict: true });
     *     try {
     *       db3.exec("insert into test (name) values ($foo)", { foo: "baz" });
     *       throw new Error("Expected error");
     *     } catch (e) {
     *       expect(e.message).toBe("attempt to write a readonly database");
     *     }
     * });
     * ```
     */
    static deserialize(
      serialized: NodeJS.TypedArray | ArrayBufferLike,
      options?: { readonly?: boolean; strict?: boolean; safeIntegers?: boolean },
    ): Database;

    /**
     * See `sqlite3_file_control` for more information.
     * @link https://www.sqlite.org/c3ref/file_control.html
     */
    fileControl(op: number, arg?: ArrayBufferView | number): number;
    /**
     * See `sqlite3_file_control` for more information.
     * @link https://www.sqlite.org/c3ref/file_control.html
     */
    fileControl(zDbName: string, op: number, arg?: ArrayBufferView | number): number;
  }

  /**
   * A prepared statement.
   *
   * This is returned by {@link Database.prepare} and {@link Database.query}.
   *
   * @category Database
   *
   * @example
   * ```ts
   * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
   * stmt.all("baz");
   * // => [{bar: "baz"}]
   * ```
   *
   * @example
   * ```ts
   * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
   * stmt.get("baz");
   * // => {bar: "baz"}
   * ```
   *
   * @example
   * ```ts
   * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
   * stmt.run("baz");
   * // => undefined
   * ```
   */
  export class Statement<ReturnType = unknown, ParamsType extends SQLQueryBindings[] = any[]> implements Disposable {
    /**
     * Creates a new prepared statement from native code.
     *
     * This is used internally by the {@link Database} class. Probably you don't need to call this yourself.
     */
    constructor(nativeHandle: any);

    /**
     * Execute the prepared statement and return all results as objects.
     *
     * @param params optional values to bind to the statement. If omitted, the statement is run with the last bound values or no parameters if there are none.
     *
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
     *
     * stmt.all("baz");
     * // => [{bar: "baz"}]
     *
     * stmt.all();
     * // => []
     *
     * stmt.all("foo");
     * // => [{bar: "foo"}]
     * ```
     */
    all(...params: ParamsType): ReturnType[];

    /**
     * Execute the prepared statement and return **the first** result.
     *
     * If no result is returned, this returns `null`.
     *
     * @param params optional values to bind to the statement. If omitted, the statement is run with the last bound values or no parameters if there are none.
     *
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
     *
     * stmt.get("baz");
     * // => {bar: "baz"}
     *
     * stmt.get();
     * // => null
     *
     * stmt.get("foo");
     * // => {bar: "foo"}
     * ```
     *
     * The following types can be used when binding parameters:
     *
     * | JavaScript type | SQLite type            |
     * | --------------- | ---------------------- |
     * | `string`        | `TEXT`                 |
     * | `number`        | `INTEGER` or `DECIMAL` |
     * | `boolean`       | `INTEGER` (1 or 0)     |
     * | `Uint8Array`    | `BLOB`                 |
     * | `Buffer`        | `BLOB`                 |
     * | `bigint`        | `INTEGER`              |
     * | `null`          | `NULL`                 |
     */
    get(...params: ParamsType): ReturnType | null;

    /**
     * Execute the prepared statement and return an
     *
     * @param params optional values to bind to the statement. If omitted, the statement is run with the last bound values or no parameters if there are none.
     *
     */
    iterate(...params: ParamsType): IterableIterator<ReturnType>;
    [Symbol.iterator](): IterableIterator<ReturnType>;

    /**
     * Execute the prepared statement. This returns `undefined`.
     *
     * @param params optional values to bind to the statement. If omitted, the statement is run with the last bound values or no parameters if there are none.
     *
     * @example
     * ```ts
     * const stmt = db.prepare("UPDATE foo SET bar = ?");
     * stmt.run("baz");
     * // => undefined
     *
     * stmt.run();
     * // => undefined
     *
     * stmt.run("foo");
     * // => undefined
     * ```
     *
     * The following types can be used when binding parameters:
     *
     * | JavaScript type | SQLite type            |
     * | --------------- | ---------------------- |
     * | `string`        | `TEXT`                 |
     * | `number`        | `INTEGER` or `DECIMAL` |
     * | `boolean`       | `INTEGER` (1 or 0)     |
     * | `Uint8Array`    | `BLOB`                 |
     * | `Buffer`        | `BLOB`                 |
     * | `bigint`        | `INTEGER`              |
     * | `null`          | `NULL`                 |
     */
    run(...params: ParamsType): Changes;

    /**
     * Execute the prepared statement and return the results as an array of arrays.
     *
     * In Bun v0.6.7 and earlier, this method returned `null` if there were no
     * results instead of `[]`. This was changed in v0.6.8 to align
     * more with what people expect.
     *
     * @param params optional values to bind to the statement. If omitted, the statement is run with the last bound values or no parameters if there are none.
     *
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
     *
     * stmt.values("baz");
     * // => [['baz']]
     *
     * stmt.values();
     * // => [['baz']]
     *
     * stmt.values("foo");
     * // => [['foo']]
     *
     * stmt.values("not-found");
     * // => []
     * ```
     *
     * The following types can be used when binding parameters:
     *
     * | JavaScript type | SQLite type            |
     * | --------------- | ---------------------- |
     * | `string`        | `TEXT`                 |
     * | `number`        | `INTEGER` or `DECIMAL` |
     * | `boolean`       | `INTEGER` (1 or 0)     |
     * | `Uint8Array`    | `BLOB`                 |
     * | `Buffer`        | `BLOB`                 |
     * | `bigint`        | `INTEGER`              |
     * | `null`          | `NULL`                 |
     */
    values(...params: ParamsType): Array<Array<string | bigint | number | boolean | Uint8Array>>;

    /**
     * The names of the columns returned by the prepared statement.
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT bar FROM foo WHERE bar = ?");
     *
     * console.log(stmt.columnNames);
     * // => ["bar"]
     * ```
     */
    readonly columnNames: string[];

    /**
     * The number of parameters expected in the prepared statement.
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?");
     * console.log(stmt.paramsCount);
     * // => 1
     * ```
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ? AND baz = ?");
     * console.log(stmt.paramsCount);
     * // => 2
     * ```
     */
    readonly paramsCount: number;

    /**
     * The actual SQLite column types from the first row of the result set.
     * Useful for expressions and computed columns, which are not covered by `declaredTypes`
     *
     * Returns an array of SQLite type constants as uppercase strings:
     * - `"INTEGER"` for integer values
     * - `"FLOAT"` for floating-point values
     * - `"TEXT"` for text values
     * - `"BLOB"` for binary data
     * - `"NULL"` for null values
     * - `null` for unknown/unsupported types
     *
     * **Requirements:**
     * - Only available for read-only statements (SELECT queries)
     * - For non-read-only statements, throws an error
     *
     * **Behavior:**
     * - Uses `sqlite3_column_type()` to get actual data types from the first row
     * - Returns `null` for columns with unknown SQLite type constants
     *
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT id, name, age FROM users WHERE id = 1");
     *
     * console.log(stmt.columnTypes);
     * // => ["INTEGER", "TEXT", "INTEGER"]
     *
     * // For expressions:
     * const exprStmt = db.prepare("SELECT length('bun') AS str_length");
     * console.log(exprStmt.columnTypes);
     * // => ["INTEGER"]
     * ```
     *
     * @throws Error if statement is not read-only (INSERT, UPDATE, DELETE, etc.)
     * @since Bun v1.2.13
     */
    readonly columnTypes: Array<"INTEGER" | "FLOAT" | "TEXT" | "BLOB" | "NULL" | null>;

    /**
     * The declared column types from the table schema.
     *
     * Returns an array of declared type strings from `sqlite3_column_decltype()`:
     * - Raw type strings as declared in the CREATE TABLE statement
     * - `null` for columns without declared types (e.g., expressions, computed columns)
     *
     * **Requirements:**
     * - Statement must be executed at least once before accessing this property
     * - Available for both read-only and read-write statements
     *
     * **Behavior:**
     * - Uses `sqlite3_column_decltype()` to get schema-declared types
     * - Returns the exact type string from the table definition
     *
     * @example
     * ```ts
     * // For table columns:
     * const stmt = db.prepare("SELECT id, name, weight FROM products");
     * stmt.get();
     * console.log(stmt.declaredTypes);
     * // => ["INTEGER", "TEXT", "REAL"]
     *
     * // For expressions (no declared types):
     * const exprStmt = db.prepare("SELECT length('bun') AS str_length");
     * exprStmt.get();
     * console.log(exprStmt.declaredTypes);
     * // => [null]
     * ```
     *
     * @throws Error if statement hasn't been executed
     * @since Bun v1.2.13
     */
    readonly declaredTypes: Array<string | null>;

    /**
     * Finalize the prepared statement, freeing the resources used by the
     * statement and preventing it from being executed again.
     *
     * This is called automatically when the prepared statement is garbage collected.
     *
     * It is safe to call this multiple times. Calling this on a finalized
     * statement has no effect.
     *
     * Internally, this calls `sqlite3_finalize`.
     */
    finalize(): void;

    /**
     * Calls {@link finalize} if it wasn't already called.
     */
    [Symbol.dispose](): void;

    /**
     * Return the expanded SQL string for the prepared statement.
     *
     * Internally, this calls `sqlite3_expanded_sql()` on the underlying `sqlite3_stmt`.
     *
     * @example
     * ```ts
     * const stmt = db.prepare("SELECT * FROM foo WHERE bar = ?", "baz");
     * console.log(stmt.toString());
     * // => "SELECT * FROM foo WHERE bar = 'baz'"
     * console.log(stmt);
     * // => "SELECT * FROM foo WHERE bar = 'baz'"
     * ```
     */
    toString(): string;

    /**
     *
     * Make {@link get} and {@link all} return an instance of the provided
     * `Class` instead of the default `Object`.
     *
     * @param Class A class to use
     * @returns The same statement instance, modified to return an instance of `Class`
     *
     * This lets you attach methods, getters, and setters to the returned
     * objects.
     *
     * For performance reasons, constructors for classes are not called, which means
     * initializers will not be called and private fields will not be
     * accessible.
     *
     * @example
     *
     * ## Custom class
     * ```ts
     * class User {
     *    rawBirthdate: string;
     *    get birthdate() {
     *      return new Date(this.rawBirthdate);
     *    }
     * }
     *
     * const db = new Database(":memory:");
     * db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, rawBirthdate TEXT)");
     * db.run("INSERT INTO users (rawBirthdate) VALUES ('1995-12-19')");
     * const query = db.query("SELECT * FROM users");
     * query.as(User);
     * const user = query.get();
     * console.log(user.birthdate);
     * // => Date(1995, 12, 19)
     * ```
     */
    as<T = unknown>(Class: new (...args: any[]) => T): Statement<T, ParamsType>;

    /**
     * Native object representing the underlying `sqlite3_stmt`
     *
     * This is left untyped because the ABI of the native bindings may change at any time.
     *
     * For stable, typed access to statement metadata, use the typed properties on the Statement class:
     * - {@link columnNames} for column names
     * - {@link paramsCount} for parameter count
     * - {@link columnTypes} for actual data types from the first row
     * - {@link declaredTypes} for schema-declared column types
     */
    readonly native: any;
  }

  /**
   * Constants from `sqlite3.h`
   *
   * This list isn't exhaustive, but some of the ones which are relevant
   */
  export namespace constants {
    /**
     * Open the database as read-only (no write operations, no create).
     * @constant 0x00000001
     */
    const SQLITE_OPEN_READONLY: number;
    /**
     * Open the database for reading and writing
     * @constant 0x00000002
     */
    const SQLITE_OPEN_READWRITE: number;
    /**
     * Allow creating a new database
     * @constant 0x00000004
     */
    const SQLITE_OPEN_CREATE: number;
    /**
     * @constant 0x00000008
     */
    const SQLITE_OPEN_DELETEONCLOSE: number;
    /**
     * @constant 0x00000010
     */
    const SQLITE_OPEN_EXCLUSIVE: number;
    /**
     * @constant 0x00000020
     */
    const SQLITE_OPEN_AUTOPROXY: number;
    /**
     * @constant 0x00000040
     */
    const SQLITE_OPEN_URI: number;
    /**
     * @constant 0x00000080
     */
    const SQLITE_OPEN_MEMORY: number;
    /**
     * @constant 0x00000100
     */
    const SQLITE_OPEN_MAIN_DB: number;
    /**
     * @constant 0x00000200
     */
    const SQLITE_OPEN_TEMP_DB: number;
    /**
     * @constant 0x00000400
     */
    const SQLITE_OPEN_TRANSIENT_DB: number;
    /**
     * @constant 0x00000800
     */
    const SQLITE_OPEN_MAIN_JOURNAL: number;
    /**
     * @constant 0x00001000
     */
    const SQLITE_OPEN_TEMP_JOURNAL: number;
    /**
     * @constant 0x00002000
     */
    const SQLITE_OPEN_SUBJOURNAL: number;
    /**
     * @constant 0x00004000
     */
    const SQLITE_OPEN_SUPER_JOURNAL: number;
    /**
     * @constant 0x00008000
     */
    const SQLITE_OPEN_NOMUTEX: number;
    /**
     * @constant 0x00010000
     */
    const SQLITE_OPEN_FULLMUTEX: number;
    /**
     * @constant 0x00020000
     */
    const SQLITE_OPEN_SHAREDCACHE: number;
    /**
     * @constant 0x00040000
     */
    const SQLITE_OPEN_PRIVATECACHE: number;
    /**
     * @constant 0x00080000
     */
    const SQLITE_OPEN_WAL: number;
    /**
     * @constant 0x01000000
     */
    const SQLITE_OPEN_NOFOLLOW: number;
    /**
     * @constant 0x02000000
     */
    const SQLITE_OPEN_EXRESCODE: number;
    /**
     * @constant 0x01
     */
    const SQLITE_PREPARE_PERSISTENT: number;
    /**
     * @constant 0x02
     */
    const SQLITE_PREPARE_NORMALIZE: number;
    /**
     * @constant 0x04
     */
    const SQLITE_PREPARE_NO_VTAB: number;
    /**
     * @constant 1
     */
    const SQLITE_FCNTL_LOCKSTATE: number;
    /**
     * @constant 2
     */
    const SQLITE_FCNTL_GET_LOCKPROXYFILE: number;
    /**
     * @constant 3
     */
    const SQLITE_FCNTL_SET_LOCKPROXYFILE: number;
    /**
     * @constant 4
     */
    const SQLITE_FCNTL_LAST_ERRNO: number;
    /**
     * @constant 5
     */
    const SQLITE_FCNTL_SIZE_HINT: number;
    /**
     * @constant 6
     */
    const SQLITE_FCNTL_CHUNK_SIZE: number;
    /**
     * @constant 7
     */
    const SQLITE_FCNTL_FILE_POINTER: number;
    /**
     * @constant 8
     */
    const SQLITE_FCNTL_SYNC_OMITTED: number;
    /**
     * @constant 9
     */
    const SQLITE_FCNTL_WIN32_AV_RETRY: number;
    /**
     * @constant 10
     *
     * Control whether or not the WAL is persisted
     * Some versions of macOS configure WAL to be persistent by default.
     *
     * You can change this with code like the below:
     * ```ts
     * import { Database, constants } from "bun:sqlite";
     *
     * const db = Database.open("mydb.sqlite");
     * db.fileControl(constants.SQLITE_FCNTL_PERSIST_WAL, 0);
     * // enable WAL
     * db.exec("PRAGMA journal_mode = WAL");
     * // .. do some work
     * db.close();
     * ```
     *
     */
    const SQLITE_FCNTL_PERSIST_WAL: number;
    /**
     * @constant 11
     */
    const SQLITE_FCNTL_OVERWRITE: number;
    /**
     * @constant 12
     */
    const SQLITE_FCNTL_VFSNAME: number;
    /**
     * @constant 13
     */
    const SQLITE_FCNTL_POWERSAFE_OVERWRITE: number;
    /**
     * @constant 14
     */
    const SQLITE_FCNTL_PRAGMA: number;
    /**
     * @constant 15
     */
    const SQLITE_FCNTL_BUSYHANDLER: number;
    /**
     * @constant 16
     */
    const SQLITE_FCNTL_TEMPFILENAME: number;
    /**
     * @constant 18
     */
    const SQLITE_FCNTL_MMAP_SIZE: number;
    /**
     * @constant 19
     */
    const SQLITE_FCNTL_TRACE: number;
    /**
     * @constant 20
     */
    const SQLITE_FCNTL_HAS_MOVED: number;
    /**
     * @constant 21
     */
    const SQLITE_FCNTL_SYNC: number;
    /**
     * @constant 22
     */
    const SQLITE_FCNTL_COMMIT_PHASETWO: number;
    /**
     * @constant 23
     */
    const SQLITE_FCNTL_WIN32_SET_HANDLE: number;
    /**
     * @constant 24
     */
    const SQLITE_FCNTL_WAL_BLOCK: number;
    /**
     * @constant 25
     */
    const SQLITE_FCNTL_ZIPVFS: number;
    /**
     * @constant 26
     */
    const SQLITE_FCNTL_RBU: number;
    /**
     * @constant 27
     */
    const SQLITE_FCNTL_VFS_POINTER: number;
    /**
     * @constant 28
     */
    const SQLITE_FCNTL_JOURNAL_POINTER: number;
    /**
     * @constant 29
     */
    const SQLITE_FCNTL_WIN32_GET_HANDLE: number;
    /**
     * @constant 30
     */
    const SQLITE_FCNTL_PDB: number;
    /**
     * @constant 31
     */
    const SQLITE_FCNTL_BEGIN_ATOMIC_WRITE: number;
    /**
     * @constant 32
     */
    const SQLITE_FCNTL_COMMIT_ATOMIC_WRITE: number;
    /**
     * @constant 33
     */
    const SQLITE_FCNTL_ROLLBACK_ATOMIC_WRITE: number;
    /**
     * @constant 34
     */
    const SQLITE_FCNTL_LOCK_TIMEOUT: number;
    /**
     * @constant 35
     */
    const SQLITE_FCNTL_DATA_VERSION: number;
    /**
     * @constant 36
     */
    const SQLITE_FCNTL_SIZE_LIMIT: number;
    /**
     * @constant 37
     */
    const SQLITE_FCNTL_CKPT_DONE: number;
    /**
     * @constant 38
     */
    const SQLITE_FCNTL_RESERVE_BYTES: number;
    /**
     * @constant 39
     */
    const SQLITE_FCNTL_CKPT_START: number;
    /**
     * @constant 40
     */
    const SQLITE_FCNTL_EXTERNAL_READER: number;
    /**
     * @constant 41
     */
    const SQLITE_FCNTL_CKSM_FILE: number;
    /**
     * @constant 42
     */
    const SQLITE_FCNTL_RESET_CACHE: number;
  }

  /**
   * The native module implementing the sqlite3 C bindings
   *
   * It is lazily-initialized, so this will return `undefined` until the first
   * call to new Database().
   *
   * The native module makes no gurantees about ABI stability, so it is left
   * untyped
   *
   * If you need to use it directly for some reason, please let us know because
   * that probably points to a deficiency in this API.
   */
  export var native: any;

  export type SQLQueryBindings =
    | string
    | bigint
    | NodeJS.TypedArray
    | number
    | boolean
    | null
    | Record<string, string | bigint | NodeJS.TypedArray | number | boolean | null>;

  export default Database;

  /**
   * Errors from SQLite have a name `SQLiteError`.
   *
   */
  export class SQLiteError extends Error {
    readonly name: "SQLiteError";

    /**
     * The SQLite3 extended error code
     *
     * This corresponds to `sqlite3_extended_errcode`.
     *
     * @since v1.0.21
     */
    errno: number;

    /**
     * The name of the SQLite3 error code
     *
     * @example
     * "SQLITE_CONSTRAINT_UNIQUE"
     *
     * @since v1.0.21
     */
    code?: string;

    /**
     * The UTF-8 byte offset of the sqlite3 query that failed, if known
     *
     * This corresponds to `sqlite3_error_offset`.
     *
     * @since v1.0.21
     */
    readonly byteOffset: number;
  }

  /**
   * An object representing the changes made to the database since the last `run` or `exec` call.
   *
   * @since Bun v1.1.14
   */
  export interface Changes {
    /**
     * The number of rows changed by the last `run` or `exec` call.
     */
    changes: number;

    /**
     * If `safeIntegers` is `true`, this is a `bigint`. Otherwise, it is a `number`.
     */
    lastInsertRowid: number | bigint;
  }
}

/**
 *
 * To run tests, run `bun test`
 *
 * @example
 *
 * ```bash
 * $ bun test
 * ```
 *
 * @example
 * ```bash
 * $ bun test <filename>
 * ```
 */
declare module "bun:test" {
  /**
   * -- Mocks --
   *
   * @category Testing
   */
  export type Mock<T extends (...args: any[]) => any> = JestMock.Mock<T>;

  export const mock: {
    <T extends (...args: any[]) => any>(Function?: T): Mock<T>;

    /**
     * Replace the module `id` with the return value of `factory`.
     *
     * This is useful for mocking modules.
     *
     * If the module is already loaded, exports are overwritten with the return
     * value of `factory`. If the export didn't exist before, it will not be
     * added to existing import statements. This is due to how ESM works.
     *
     * @param id module ID to mock
     * @param factory a function returning an object that will be used as the exports of the mocked module
     *
     * @example
     * ```ts
     * import { mock } from "bun:test";
     *
     * mock.module("fs/promises", () => {
     *  return {
     *    readFile: () => Promise.resolve("hello world"),
     *  };
     * });
     *
     * import { readFile } from "fs/promises";
     *
     * console.log(await readFile("hello.txt", "utf8")); // hello world
     * ```
     */
    module(id: string, factory: () => any): void | Promise<void>;
    /**
     * Restore the previous value of mocks.
     */
    restore(): void;
  };

  /**
   * Control the system time used by:
   * - `Date.now()`
   * - `new Date()`
   * - `Intl.DateTimeFormat().format()`
   *
   * In the future, we may add support for more functions, but we haven't done that yet.
   *
   * @param now The time to set the system time to. If not provided, the system time will be reset.
   * @returns `this`
   * @since v0.6.13
   *
   * ## Set Date to a specific time
   *
   * ```js
   * import { setSystemTime } from 'bun:test';
   *
   * setSystemTime(new Date('2020-01-01T00:00:00.000Z'));
   * console.log(new Date().toISOString()); // 2020-01-01T00:00:00.000Z
   * ```
   * ## Reset Date to the current time
   *
   * ```js
   * import { setSystemTime } from 'bun:test';
   *
   * setSystemTime();
   * ```
   */
  export function setSystemTime(now?: Date | number): ThisType<void>;

  export namespace jest {
    function restoreAllMocks(): void;
    function clearAllMocks(): void;
    function fn<T extends (...args: any[]) => any>(func?: T): Mock<T>;
    function setSystemTime(now?: number | Date): void;
    function setTimeout(milliseconds: number): void;
    function useFakeTimers(): void;
    function useRealTimers(): void;
    function spyOn<T extends object, K extends keyof T>(
      obj: T,
      methodOrPropertyValue: K,
    ): Mock<Extract<T[K], (...args: any[]) => any>>;

    /**
     * Constructs the type of a mock function, e.g. the return type of `jest.fn()`.
     */
    type Mock<T extends (...args: any[]) => any = (...args: any[]) => any> = JestMock.Mock<T>;
    /**
     * Wraps a class, function or object type with Jest mock type definitions.
     */
    // type Mocked<T extends object> = JestMock.Mocked<T>;
    /**
     * Wraps a class type with Jest mock type definitions.
     */
    // type MockedClass<T extends JestMock.ClassLike> = JestMock.MockedClass<T>;
    /**
     * Wraps a function type with Jest mock type definitions.
     */
    // type MockedFunction<T extends (...args: any[]) => any> = JestMock.MockedFunction<T>;
    /**
     * Wraps an object type with Jest mock type definitions.
     */
    // type MockedObject<T extends object> = JestMock.MockedObject<T>;
    /**
     * Constructs the type of a replaced property.
     */
    type Replaced<T> = JestMock.Replaced<T>;
    /**
     * Constructs the type of a spied class or function.
     */
    type Spied<T extends JestMock.ClassLike | ((...args: any[]) => any)> = JestMock.Spied<T>;
    /**
     * Constructs the type of a spied class.
     */
    type SpiedClass<T extends JestMock.ClassLike> = JestMock.SpiedClass<T>;
    /**
     * Constructs the type of a spied function.
     */
    type SpiedFunction<T extends (...args: any[]) => any> = JestMock.SpiedFunction<T>;
    /**
     * Constructs the type of a spied getter.
     */
    type SpiedGetter<T> = JestMock.SpiedGetter<T>;
    /**
     * Constructs the type of a spied setter.
     */
    type SpiedSetter<T> = JestMock.SpiedSetter<T>;
  }

  export function spyOn<T extends object, K extends keyof T>(
    obj: T,
    methodOrPropertyValue: K,
  ): Mock<Extract<T[K], (...args: any[]) => any>>;

  interface FunctionLike {
    readonly name: string;
  }

  type DescribeLabel = number | string | Function | FunctionLike;

  /**
   * Describes a group of related tests.
   *
   * @example
   * function sum(a, b) {
   *   return a + b;
   * }
   * describe("sum()", () => {
   *   test("can sum two values", () => {
   *     expect(sum(1, 1)).toBe(2);
   *   });
   * });
   *
   * @param label the label for the tests
   * @param fn the function that defines the tests
   *
   * @category Testing
   */
  export interface Describe {
    (fn: () => void): void;

    (label: DescribeLabel, fn: () => void): void;
    /**
     * Skips all other tests, except this group of tests.
     *
     * @param label the label for the tests
     * @param fn the function that defines the tests
     */
    only(label: DescribeLabel, fn: () => void): void;
    /**
     * Skips this group of tests.
     *
     * @param label the label for the tests
     * @param fn the function that defines the tests
     */
    skip(label: DescribeLabel, fn: () => void): void;
    /**
     * Marks this group of tests as to be written or to be fixed.
     *
     * @param label the label for the tests
     * @param fn the function that defines the tests
     */
    todo(label: DescribeLabel, fn?: () => void): void;
    /**
     * Runs this group of tests, only if `condition` is true.
     *
     * This is the opposite of `describe.skipIf()`.
     *
     * @param condition if these tests should run
     */
    if(condition: boolean): (label: DescribeLabel, fn: () => void) => void;
    /**
     * Skips this group of tests, if `condition` is true.
     *
     * @param condition if these tests should be skipped
     */
    skipIf(condition: boolean): (label: DescribeLabel, fn: () => void) => void;
    /**
     * Marks this group of tests as to be written or to be fixed, if `condition` is true.
     *
     * @param condition if these tests should be skipped
     */
    todoIf(condition: boolean): (label: DescribeLabel, fn: () => void) => void;
    /**
     * Returns a function that runs for each item in `table`.
     *
     * @param table Array of Arrays with the arguments that are passed into the test fn for each row.
     */
    each<T extends Readonly<[any, ...any[]]>>(
      table: readonly T[],
    ): (label: DescribeLabel, fn: (...args: [...T]) => void | Promise<unknown>, options?: number | TestOptions) => void;
    each<T extends any[]>(
      table: readonly T[],
    ): (
      label: DescribeLabel,
      fn: (...args: Readonly<T>) => void | Promise<unknown>,
      options?: number | TestOptions,
    ) => void;
    each<T>(
      table: T[],
    ): (label: DescribeLabel, fn: (...args: T[]) => void | Promise<unknown>, options?: number | TestOptions) => void;
  }
  /**
   * Describes a group of related tests.
   *
   * @example
   * function sum(a, b) {
   *   return a + b;
   * }
   * describe("sum()", () => {
   *   test("can sum two values", () => {
   *     expect(sum(1, 1)).toBe(2);
   *   });
   * });
   *
   * @param label the label for the tests
   * @param fn the function that defines the tests
   */
  export const describe: Describe;
  /**
   * Runs a function, once, before all the tests.
   *
   * This is useful for running set up tasks, like initializing
   * a global variable or connecting to a database.
   *
   * If this function throws, tests will not run in this file.
   *
   * @example
   * let database;
   * beforeAll(async () => {
   *   database = await connect("localhost");
   * });
   *
   * @param fn the function to run
   */
  export function beforeAll(fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void)): void;
  /**
   * Runs a function before each test.
   *
   * This is useful for running set up tasks, like initializing
   * a global variable or connecting to a database.
   *
   * If this function throws, the test will not run.
   *
   * @param fn the function to run
   */
  export function beforeEach(fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void)): void;
  /**
   * Runs a function, once, after all the tests.
   *
   * This is useful for running clean up tasks, like closing
   * a socket or deleting temporary files.
   *
   * @example
   * let database;
   * afterAll(async () => {
   *   if (database) {
   *     await database.close();
   *   }
   * });
   *
   * @param fn the function to run
   */
  export function afterAll(fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void)): void;
  /**
   * Runs a function after each test.
   *
   * This is useful for running clean up tasks, like closing
   * a socket or deleting temporary files.
   *
   * @param fn the function to run
   */
  export function afterEach(fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void)): void;
  /**
   * Sets the default timeout for all tests in the current file. If a test specifies a timeout, it will
   * override this value. The default timeout is 5000ms (5 seconds).
   *
   * @param milliseconds the number of milliseconds for the default timeout
   */
  export function setDefaultTimeout(milliseconds: number): void;
  export interface TestOptions {
    /**
     * Sets the timeout for the test in milliseconds.
     *
     * If the test does not complete within this time, the test will fail with:
     * ```ts
     * 'Timeout: test {name} timed out after 5000ms'
     * ```
     *
     * @default 5000 // 5 seconds
     */
    timeout?: number;
    /**
     * Sets the number of times to retry the test if it fails.
     *
     * @default 0
     */
    retry?: number;
    /**
     * Sets the number of times to repeat the test, regardless of whether it passed or failed.
     *
     * @default 0
     */
    repeats?: number;
  }
  /**
   * Runs a test.
   *
   * @example
   * test("can check if using Bun", () => {
   *   expect(Bun).toBeDefined();
   * });
   *
   * test("can make a fetch() request", async () => {
   *   const response = await fetch("https://example.com/");
   *   expect(response.ok).toBe(true);
   * });
   *
   * test("can set a timeout", async () => {
   *   await Bun.sleep(100);
   * }, 50); // or { timeout: 50 }
   *
   * @param label the label for the test
   * @param fn the test function
   * @param options the test timeout or options
   *
   * @category Testing
   */
  export interface Test {
    (
      label: string,
      fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
      /**
       * - If a `number`, sets the timeout for the test in milliseconds.
       * - If an `object`, sets the options for the test.
       *   - `timeout` sets the timeout for the test in milliseconds.
       *   - `retry` sets the number of times to retry the test if it fails.
       *   - `repeats` sets the number of times to repeat the test, regardless of whether it passed or failed.
       */
      options?: number | TestOptions,
    ): void;
    /**
     * Skips all other tests, except this test when run with the `--only` option.
     *
     * @param label the label for the test
     * @param fn the test function
     * @param options the test timeout or options
     */
    only(
      label: string,
      fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
      options?: number | TestOptions,
    ): void;
    /**
     * Skips this test.
     *
     * @param label the label for the test
     * @param fn the test function
     * @param options the test timeout or options
     */
    skip(
      label: string,
      fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
      options?: number | TestOptions,
    ): void;
    /**
     * Marks this test as to be written or to be fixed.
     *
     * These tests will not be executed unless the `--todo` flag is passed. With the flag,
     * if the test passes, the test will be marked as `fail` in the results; you will have to
     * remove the `.todo` or check that your test
     * is implemented correctly.
     *
     * @param label the label for the test
     * @param fn the test function
     * @param options the test timeout or options
     */
    todo(
      label: string,
      fn?: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
      options?: number | TestOptions,
    ): void;
    /**
     * Marks this test as failing.
     *
     * Use `test.failing` when you are writing a test and expecting it to fail.
     * These tests will behave the other way normal tests do. If failing test
     * will throw any errors then it will pass. If it does not throw it will
     * fail.
     *
     * `test.failing` is very similar to {@link test.todo} except that it always
     * runs, regardless of the `--todo` flag.
     *
     * @param label the label for the test
     * @param fn the test function
     * @param options the test timeout or options
     */
    failing(
      label: string,
      fn?: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
      options?: number | TestOptions,
    ): void;
    /**
     * Runs this test, if `condition` is true.
     *
     * This is the opposite of `test.skipIf()`.
     *
     * @param condition if the test should run
     */
    if(
      condition: boolean,
    ): (
      label: string,
      fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
      options?: number | TestOptions,
    ) => void;
    /**
     * Skips this test, if `condition` is true.
     *
     * @param condition if the test should be skipped
     */
    skipIf(
      condition: boolean,
    ): (
      label: string,
      fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
      options?: number | TestOptions,
    ) => void;
    /**
     * Marks this test as to be written or to be fixed, if `condition` is true.
     *
     * @param condition if the test should be marked TODO
     */
    todoIf(
      condition: boolean,
    ): (
      label: string,
      fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
      options?: number | TestOptions,
    ) => void;
    /**
     * Returns a function that runs for each item in `table`.
     *
     * @param table Array of Arrays with the arguments that are passed into the test fn for each row.
     */
    each<T extends Readonly<[any, ...any[]]>>(
      table: readonly T[],
    ): (label: string, fn: (...args: [...T]) => void | Promise<unknown>, options?: number | TestOptions) => void;
    each<T extends any[]>(
      table: readonly T[],
    ): (label: string, fn: (...args: Readonly<T>) => void | Promise<unknown>, options?: number | TestOptions) => void;
    each<T>(
      table: T[],
    ): (label: string, fn: (...args: T[]) => void | Promise<unknown>, options?: number | TestOptions) => void;
  }
  /**
   * Runs a test.
   *
   * @example
   * test("can check if using Bun", () => {
   *   expect(Bun).toBeDefined();
   * });
   *
   * test("can make a fetch() request", async () => {
   *   const response = await fetch("https://example.com/");
   *   expect(response.ok).toBe(true);
   * });
   *
   * @param label the label for the test
   * @param fn the test function
   */
  export const test: Test;
  export { test as it };

  /**
   * Asserts that a value matches some criteria.
   *
   * @link https://jestjs.io/docs/expect#reference
   * @example
   * expect(1 + 1).toBe(2);
   * expect([1,2,3]).toContain(2);
   * expect(null).toBeNull();
   *
   * @param actual The actual (received) value
   */
  export const expect: Expect;

  type ExpectNot = Omit<AsymmetricMatchers, keyof AsymmetricMatchersBuiltin> & AsymmetricMatchersBuiltinNegated;

  export interface Expect extends AsymmetricMatchers {
    // the `expect()` callable signature
    /**
     * @param actual the actual value
     * @param customFailMessage an optional custom message to display if the test fails.
     * */

    <T = unknown>(actual?: T, customFailMessage?: string): Matchers<T>;

    /**
     * Access to negated asymmetric matchers.
     *
     * @example
     * expect("abc").toEqual(expect.stringContaining("abc")); // will pass
     * expect("abc").toEqual(expect.not.stringContaining("abc")); // will fail
     */
    not: ExpectNot;

    /**
     * Create an asymmetric matcher for a promise resolved value.
     *
     * @example
     * expect(Promise.resolve("value")).toEqual(expect.resolvesTo.stringContaining("value")); // will pass
     * expect(Promise.reject("value")).toEqual(expect.resolvesTo.stringContaining("value")); // will fail
     * expect("value").toEqual(expect.resolvesTo.stringContaining("value")); // will fail
     */
    resolvesTo: AsymmetricMatchers;

    /**
     * Create an asymmetric matcher for a promise rejected value.
     *
     * @example
     * expect(Promise.reject("error")).toEqual(expect.rejectsTo.stringContaining("error")); // will pass
     * expect(Promise.resolve("error")).toEqual(expect.rejectsTo.stringContaining("error")); // will fail
     * expect("error").toEqual(expect.rejectsTo.stringContaining("error")); // will fail
     */
    rejectsTo: AsymmetricMatchers;

    /**
     * Register new custom matchers.
     * @param matchers An object containing the matchers to register, where each key is the matcher name, and its value the implementation function.
     * The function must satisfy: `(actualValue, ...matcherInstantiationArguments) => { pass: true|false, message: () => string }`
     *
     * @example
     * expect.extend({
     *     toBeWithinRange(actual, min, max) {
     *         if (typeof actual !== 'number' || typeof min !== 'number' || typeof max !== 'number')
     *             throw new Error('Invalid usage');
     *         const pass = actual >= min && actual <= max;
     *         return {
     *             pass: pass,
     *             message: () => `expected ${this.utils.printReceived(actual)} ` +
     *                 (pass ? `not to be`: `to be`) + ` within range ${this.utils.printExpected(`${min} .. ${max}`)}`,
     *         };
     *     },
     * });
     *
     * test('some test', () => {
     *   expect(50).toBeWithinRange(0, 100); // will pass
     *   expect(50).toBeWithinRange(100, 200); // will fail
     *   expect(50).toBe(expect.toBeWithinRange(0, 100)); // will pass
     *   expect(50).toBe(expect.not.toBeWithinRange(100, 200)); // will pass
     * });
     */
    extend<M>(matchers: ExpectExtendMatchers<M>): void;

    /**
     * Throw an error if this function is called.
     *
     * @param msg Optional message to display if the test fails
     * @returns never
     *
     * @example
     * ```ts
     * import { expect, test } from "bun:test";
     *
     * test("!!abc!! is not a module", () => {
     *  try {
     *     require("!!abc!!");
     *     expect.unreachable();
     *  } catch(e) {
     *     expect(e.name).not.toBe("UnreachableError");
     *  }
     * });
     * ```
     */
    unreachable(msg?: string | Error): never;

    /**
     * Ensures that an assertion is made
     */
    hasAssertions(): void;

    /**
     * Ensures that a specific number of assertions are made
     */
    assertions(neededAssertions: number): void;
  }

  /**
   * You can extend this interface with declaration merging, in order to add type support for custom matchers.
   * @template T Type of the actual value
   *
   * @example
   * // my_modules.d.ts
   * interface MyCustomMatchers {
   *   toBeWithinRange(floor: number, ceiling: number): any;
   * }
   * declare module "bun:test" {
   *   interface Matchers<T> extends MyCustomMatchers {}
   *   interface AsymmetricMatchers extends MyCustomMatchers {}
   * }
   *
   * @example
   * // my_modules.d.ts (alternatively)
   * declare module "bun:test" {
   *   interface Matchers<T> {
   *     toBeWithinRange(floor: number, ceiling: number): any;
   *   }
   *   interface AsymmetricMatchers {
   *     toBeWithinRange(floor: number, ceiling: number): any;
   *   }
   * }
   */
  export interface Matchers<T = unknown> extends MatchersBuiltin<T> {}

  /**
   * You can extend this interface with declaration merging, in order to add type support for custom asymmetric matchers.
   * @example
   * // my_modules.d.ts
   * interface MyCustomMatchers {
   *   toBeWithinRange(floor: number, ceiling: number): any;
   * }
   * declare module "bun:test" {
   *   interface Matchers<T> extends MyCustomMatchers {}
   *   interface AsymmetricMatchers extends MyCustomMatchers {}
   * }
   *
   * @example
   * // my_modules.d.ts (alternatively)
   * declare module "bun:test" {
   *   interface Matchers<T> {
   *     toBeWithinRange(floor: number, ceiling: number): any;
   *   }
   *   interface AsymmetricMatchers {
   *     toBeWithinRange(floor: number, ceiling: number): any;
   *   }
   * }
   */
  export interface AsymmetricMatchers extends AsymmetricMatchersBuiltin {}

  export interface AsymmetricMatchersBuiltin {
    /**
     * Matches anything that was created with the given constructor.
     * You can use it inside `toEqual` or `toBeCalledWith` instead of a literal value.
     *
     * @example
     *
     * function randocall(fn) {
     *   return fn(Math.floor(Math.random() * 6 + 1));
     * }
     *
     * test('randocall calls its callback with a number', () => {
     *   const mock = jest.fn();
     *   randocall(mock);
     *   expect(mock).toBeCalledWith(expect.any(Number));
     * });
     */
    any(constructor: ((...args: any[]) => any) | { new (...args: any[]): any }): AsymmetricMatcher;
    /**
     * Matches anything but null or undefined. You can use it inside `toEqual` or `toBeCalledWith` instead
     * of a literal value. For example, if you want to check that a mock function is called with a
     * non-null argument:
     *
     * @example
     *
     * test('map calls its argument with a non-null argument', () => {
     *   const mock = jest.fn();
     *   [1].map(x => mock(x));
     *   expect(mock).toBeCalledWith(expect.anything());
     * });
     */
    anything(): AsymmetricMatcher;
    /**
     * Matches any array made up entirely of elements in the provided array.
     * You can use it inside `toEqual` or `toBeCalledWith` instead of a literal value.
     *
     * Optionally, you can provide a type for the elements via a generic.
     */
    arrayContaining<E = any>(arr: readonly E[]): AsymmetricMatcher;
    /**
     * Matches any object that recursively matches the provided keys.
     * This is often handy in conjunction with other asymmetric matchers.
     *
     * Optionally, you can provide a type for the object via a generic.
     * This ensures that the object contains the desired structure.
     */
    objectContaining(obj: object): AsymmetricMatcher;
    /**
     * Matches any received string that contains the exact expected string
     */
    stringContaining(str: string | String): AsymmetricMatcher;
    /**
     * Matches any string that contains the exact provided string
     */
    stringMatching(regex: string | String | RegExp): AsymmetricMatcher;
    /**
     * Useful when comparing floating point numbers in object properties or array item.
     * If you need to compare a number, use `.toBeCloseTo` instead.
     *
     * The optional `numDigits` argument limits the number of digits to check after the decimal point.
     * For the default value 2, the test criterion is `Math.abs(expected - received) < 0.005` (that is, `10 ** -2 / 2`).
     */
    closeTo(num: number, numDigits?: number): AsymmetricMatcher;
  }

  interface AsymmetricMatchersBuiltinNegated {
    /**
     * Create an asymmetric matcher that will fail on a promise resolved value that matches the chained matcher.
     *
     * @example
     * expect(Promise.resolve("value")).toEqual(expect.not.resolvesTo.stringContaining("value")); // will fail
     * expect(Promise.reject("value")).toEqual(expect.not.resolvesTo.stringContaining("value")); // will pass
     * expect("value").toEqual(expect.not.resolvesTo.stringContaining("value")); // will pass
     */
    resolvesTo: ExpectNot;

    /**
     * Create an asymmetric matcher that will fail on a promise rejected value that matches the chained matcher.
     *
     * @example
     * expect(Promise.reject("value")).toEqual(expect.not.rejectsTo.stringContaining("value")); // will fail
     * expect(Promise.resolve("value")).toEqual(expect.not.rejectsTo.stringContaining("value")); // will pass
     * expect("value").toEqual(expect.not.rejectsTo.stringContaining("value")); // will pass
     */
    rejectsTo: ExpectNot;

    /**
     * `expect.not.arrayContaining(array)` matches a received array which
     * does not contain all of the elements in the expected array. That is,
     * the expected array is not a subset of the received array. It is the
     * inverse of `expect.arrayContaining`.
     *
     * Optionally, you can provide a type for the elements via a generic.
     */
    arrayContaining<E = any>(arr: readonly E[]): AsymmetricMatcher;

    /**
     * `expect.not.objectContaining(object)` matches any received object
     * that does not recursively match the expected properties. That is, the
     * expected object is not a subset of the received object. Therefore,
     * it matches a received object which contains properties that are not
     * in the expected object. It is the inverse of `expect.objectContaining`.
     *
     * Optionally, you can provide a type for the object via a generic.
     * This ensures that the object contains the desired structure.
     */
    objectContaining(obj: object): AsymmetricMatcher;

    /**
     * `expect.not.stringContaining(string)` matches the received string
     * that does not contain the exact expected string. It is the inverse of
     * `expect.stringContaining`.
     */
    stringContaining(str: string | String): AsymmetricMatcher;

    /**
     * `expect.not.stringMatching(string | regexp)` matches the received
     * string that does not match the expected regexp. It is the inverse of
     * `expect.stringMatching`.
     */
    stringMatching(str: string | String | RegExp): AsymmetricMatcher;

    /**
     * `expect.not.closeTo` matches a number not close to the provided value.
     * Useful when comparing floating point numbers in object properties or array item.
     * It is the inverse of `expect.closeTo`.
     */
    closeTo(num: number, numDigits?: number): AsymmetricMatcher;
  }

  export interface MatchersBuiltin<T = unknown> {
    /**
     * Negates the result of a subsequent assertion.
     * If you know how to test something, `.not` lets you test its opposite.
     *
     * @example
     * expect(1).not.toBe(0);
     * expect(null).not.toBeNull();
     *
     * @example
     * expect(42).toEqual(42); // will pass
     * expect(42).not.toEqual(42); // will fail
     */
    not: Matchers<unknown>;

    /**
     * Expects the value to be a promise that resolves.
     *
     * @example
     * expect(Promise.resolve(1)).resolves.toBe(1);
     */
    resolves: Matchers<Awaited<T>>;

    /**
     * Expects the value to be a promise that rejects.
     *
     * @example
     * expect(Promise.reject("error")).rejects.toBe("error");
     */
    rejects: Matchers<unknown>;

    /**
     * Assertion which passes.
     *
     * @link https://jest-extended.jestcommunity.dev/docs/matchers/pass
     * @example
     * expect().pass();
     * expect().pass("message is optional");
     * expect().not.pass();
     * expect().not.pass("hi");
     *
     * @param message the message to display if the test fails (optional)
     */
    pass: (message?: string) => void;
    /**
     * Assertion which fails.
     *
     * @link https://jest-extended.jestcommunity.dev/docs/matchers/fail
     * @example
     * expect().fail();
     * expect().fail("message is optional");
     * expect().not.fail();
     * expect().not.fail("hi");
     */
    fail: (message?: string) => void;
    /**
     * Asserts that a value equals what is expected.
     *
     * - For non-primitive values, like objects and arrays,
     * use `toEqual()` instead.
     * - For floating-point numbers, use `toBeCloseTo()` instead.
     *
     * @example
     * expect(100 + 23).toBe(123);
     * expect("d" + "og").toBe("dog");
     * expect([123]).toBe([123]); // fail, use toEqual()
     * expect(3 + 0.14).toBe(3.14); // fail, use toBeCloseTo()
     *
     * @param expected the expected value
     */
    toBe(expected: T): void;
    /**
     * Asserts that a number is odd.
     *
     * @link https://jest-extended.jestcommunity.dev/docs/matchers/number/#tobeodd
     * @example
     * expect(1).toBeOdd();
     * expect(2).not.toBeOdd();
     */
    toBeOdd(): void;
    /**
     * Asserts that a number is even.
     *
     * @link https://jest-extended.jestcommunity.dev/docs/matchers/number/#tobeeven
     * @example
     * expect(2).toBeEven();
     * expect(1).not.toBeEven();
     */
    toBeEven(): void;
    /**
     * Asserts that value is close to the expected by floating point precision.
     *
     * For example, the following fails because arithmetic on decimal (base 10)
     * values often have rounding errors in limited precision binary (base 2) representation.
     *
     * @example
     * expect(0.2 + 0.1).toBe(0.3); // fails
     *
     * Use `toBeCloseTo` to compare floating point numbers for approximate equality.
     *
     * @example
     * expect(0.2 + 0.1).toBeCloseTo(0.3, 5); // passes
     *
     * @param expected the expected value
     * @param numDigits the number of digits to check after the decimal point. Default is `2`
     */
    toBeCloseTo(expected: number, numDigits?: number): void;
    /**
     * Asserts that a value is deeply equal to what is expected.
     *
     * @example
     * expect(100 + 23).toBe(123);
     * expect("d" + "og").toBe("dog");
     * expect([456]).toEqual([456]);
     * expect({ value: 1 }).toEqual({ value: 1 });
     *
     * @param expected the expected value
     */
    toEqual(expected: T): void;
    /**
     * Asserts that a value is deeply and strictly equal to
     * what is expected.
     *
     * There are two key differences from `toEqual()`:
     * 1. It checks that the class is the same.
     * 2. It checks that `undefined` values match as well.
     *
     * @example
     * class Dog {
     *   type = "dog";
     * }
     * const actual = new Dog();
     * expect(actual).toStrictEqual(new Dog());
     * expect(actual).toStrictEqual({ type: "dog" }); // fail
     *
     * @example
     * const actual = { value: 1, name: undefined };
     * expect(actual).toEqual({ value: 1 });
     * expect(actual).toStrictEqual({ value: 1 }); // fail
     *
     * @param expected the expected value
     */
    toStrictEqual(expected: T): void;
    /**
     * Asserts that the value is deep equal to an element in the expected array.
     *
     * The value must be an array or iterable, which includes strings.
     *
     * @example
     * expect(1).toBeOneOf([1,2,3]);
     * expect("foo").toBeOneOf(["foo", "bar"]);
     * expect(true).toBeOneOf(new Set([true]));
     *
     * @param expected the expected value
     */
    toBeOneOf(expected: Array<unknown> | Iterable<unknown>): void;
    /**
     * Asserts that a value contains what is expected.
     *
     * The value must be an array or iterable, which
     * includes strings.
     *
     * @example
     * expect([1, 2, 3]).toContain(1);
     * expect(new Set([true])).toContain(true);
     * expect("hello").toContain("o");
     *
     * @param expected the expected value
     */
    toContain(expected: unknown): void;
    /**
     * Asserts that an `object` contains a key.
     *
     * The value must be an object
     *
     * @example
     * expect({ a: 'foo', b: 'bar', c: 'baz' }).toContainKey('a');
     * expect({ a: 'foo', b: 'bar', c: 'baz' }).toContainKey('b');
     * expect({ a: 'foo', b: 'bar', c: 'baz' }).toContainKey('c');
     * expect({ a: 'foo', b: 'bar', c: 'baz' }).not.toContainKey('d');
     *
     * @param expected the expected value
     */
    toContainKey(expected: unknown): void;
    /**
     * Asserts that an `object` contains all the provided keys.
     *
     * The value must be an object
     *
     * @example
     * expect({ a: 'hello', b: 'world' }).toContainAllKeys(['a','b']);
     * expect({ a: 'hello', b: 'world' }).toContainAllKeys(['b','a']);
     * expect({ 1: 'hello', b: 'world' }).toContainAllKeys([1,'b']);
     * expect({ a: 'hello', b: 'world' }).not.toContainAllKeys(['c']);
     * expect({ a: 'hello', b: 'world' }).not.toContainAllKeys(['a']);
     *
     * @param expected the expected value
     */
    toContainAllKeys(expected: unknown): void;
    /**
     * Asserts that an `object` contains at least one of the provided keys.
     * Asserts that an `object` contains all the provided keys.
     *
     * The value must be an object
     *
     * @example
     * expect({ a: 'hello', b: 'world' }).toContainAnyKeys(['a']);
     * expect({ a: 'hello', b: 'world' }).toContainAnyKeys(['b']);
     * expect({ a: 'hello', b: 'world' }).toContainAnyKeys(['b', 'c']);
     * expect({ a: 'hello', b: 'world' }).not.toContainAnyKeys(['c']);
     *
     * @param expected the expected value
     */
    toContainAnyKeys(expected: unknown): void;

    /**
     * Asserts that an `object` contain the provided value.
     *
     * The value must be an object
     *
     * @example
     * const shallow = { hello: "world" };
     * const deep = { message: shallow };
     * const deepArray = { message: [shallow] };
     * const o = { a: "foo", b: [1, "hello", true], c: "baz" };

     * expect(shallow).toContainValue("world");
     * expect({ foo: false }).toContainValue(false);
     * expect(deep).toContainValue({ hello: "world" });
     * expect(deepArray).toContainValue([{ hello: "world" }]);

     * expect(o).toContainValue("foo", "barr");
     * expect(o).toContainValue([1, "hello", true]);
     * expect(o).not.toContainValue("qux");

     // NOT
     * expect(shallow).not.toContainValue("foo");
     * expect(deep).not.toContainValue({ foo: "bar" });
     * expect(deepArray).not.toContainValue([{ foo: "bar" }]);
     *
     * @param expected the expected value
     */
    toContainValue(expected: unknown): void;

    /**
     * Asserts that an `object` contain the provided value.
     *
     * The value must be an object
     *
     * @example
     * const o = { a: 'foo', b: 'bar', c: 'baz' };
     * expect(o).toContainValues(['foo']);
     * expect(o).toContainValues(['baz', 'bar']);
     * expect(o).not.toContainValues(['qux', 'foo']);
     * @param expected the expected value
     */
    toContainValues(expected: unknown): void;

    /**
     * Asserts that an `object` contain all the provided values.
     *
     * The value must be an object
     *
     * @example
     * const o = { a: 'foo', b: 'bar', c: 'baz' };
     * expect(o).toContainAllValues(['foo', 'bar', 'baz']);
     * expect(o).toContainAllValues(['baz', 'bar', 'foo']);
     * expect(o).not.toContainAllValues(['bar', 'foo']);
     * @param expected the expected value
     */
    toContainAllValues(expected: unknown): void;

    /**
     * Asserts that an `object` contain any provided value.
     *
     * The value must be an object
     *
     * @example
     * const o = { a: 'foo', b: 'bar', c: 'baz' };
     * expect(o).toContainAnyValues(['qux', 'foo']);
     * expect(o).toContainAnyValues(['qux', 'bar']);
     * expect(o).toContainAnyValues(['qux', 'baz']);
     * expect(o).not.toContainAnyValues(['qux']);
     * @param expected the expected value
     */
    toContainAnyValues(expected: unknown): void;

    /**
     * Asserts that an `object` contains all the provided keys.
     *
     * @example
     * expect({ a: 'foo', b: 'bar', c: 'baz' }).toContainKeys(['a', 'b']);
     * expect({ a: 'foo', b: 'bar', c: 'baz' }).toContainKeys(['a', 'b', 'c']);
     * expect({ a: 'foo', b: 'bar', c: 'baz' }).not.toContainKeys(['a', 'b', 'e']);
     *
     * @param expected the expected value
     */
    toContainKeys(expected: unknown): void;
    /**
     * Asserts that a value contains and equals what is expected.
     *
     * This matcher will perform a deep equality check for members
     * of arrays, rather than checking for object identity.
     *
     * @example
     * expect([{ a: 1 }]).toContainEqual({ a: 1 });
     * expect([{ a: 1 }]).not.toContainEqual({ a: 2 });
     *
     * @param expected the expected value
     */
    toContainEqual(expected: unknown): void;
    /**
     * Asserts that a value has a `.length` property
     * that is equal to the expected length.
     *
     * @example
     * expect([]).toHaveLength(0);
     * expect("hello").toHaveLength(4);
     *
     * @param length the expected length
     */
    toHaveLength(length: number): void;
    /**
     * Asserts that a value has a property with the
     * expected name, and value if provided.
     *
     * @example
     * expect(new Set()).toHaveProperty("size");
     * expect(new Uint8Array()).toHaveProperty("byteLength", 0);
     * expect({ kitchen: { area: 20 }}).toHaveProperty("kitchen.area", 20);
     * expect({ kitchen: { area: 20 }}).toHaveProperty(["kitchen", "area"], 20);
     *
     * @param keyPath the expected property name or path, or an index
     * @param value the expected property value, if provided
     */
    toHaveProperty(keyPath: string | number | Array<string | number>, value?: unknown): void;
    /**
     * Asserts that a value is "truthy".
     *
     * To assert that a value equals `true`, use `toBe(true)` instead.
     *
     * @link https://developer.mozilla.org/en-US/docs/Glossary/Truthy
     * @example
     * expect(true).toBeTruthy();
     * expect(1).toBeTruthy();
     * expect({}).toBeTruthy();
     */
    toBeTruthy(): void;
    /**
     * Asserts that a value is "falsy".
     *
     * To assert that a value equals `false`, use `toBe(false)` instead.
     *
     * @link https://developer.mozilla.org/en-US/docs/Glossary/Falsy
     * @example
     * expect(true).toBeTruthy();
     * expect(1).toBeTruthy();
     * expect({}).toBeTruthy();
     */
    toBeFalsy(): void;
    /**
     * Asserts that a value is defined. (e.g. is not `undefined`)
     *
     * @example
     * expect(true).toBeDefined();
     * expect(undefined).toBeDefined(); // fail
     */
    toBeDefined(): void;
    /**
     * Asserts that the expected value is an instance of value
     *
     * @example
     * expect([]).toBeInstanceOf(Array);
     * expect(null).toBeInstanceOf(Array); // fail
     */
    toBeInstanceOf(value: unknown): void;
    /**
     * Asserts that the expected value is an instance of value
     *
     * @example
     * expect([]).toBeInstanceOf(Array);
     * expect(null).toBeInstanceOf(Array); // fail
     */
    toBeInstanceOf(value: unknown): void;
    /**
     * Asserts that a value is `undefined`.
     *
     * @example
     * expect(undefined).toBeUndefined();
     * expect(null).toBeUndefined(); // fail
     */
    toBeUndefined(): void;
    /**
     * Asserts that a value is `null`.
     *
     * @example
     * expect(null).toBeNull();
     * expect(undefined).toBeNull(); // fail
     */
    toBeNull(): void;
    /**
     * Asserts that a value is `NaN`.
     *
     * Same as using `Number.isNaN()`.
     *
     * @example
     * expect(NaN).toBeNaN();
     * expect(Infinity).toBeNaN(); // fail
     * expect("notanumber").toBeNaN(); // fail
     */
    toBeNaN(): void;
    /**
     * Asserts that a value is a `number` and is greater than the expected value.
     *
     * @example
     * expect(1).toBeGreaterThan(0);
     * expect(3.14).toBeGreaterThan(3);
     * expect(9).toBeGreaterThan(9); // fail
     *
     * @param expected the expected number
     */
    toBeGreaterThan(expected: number | bigint): void;
    /**
     * Asserts that a value is a `number` and is greater than or equal to the expected value.
     *
     * @example
     * expect(1).toBeGreaterThanOrEqual(0);
     * expect(3.14).toBeGreaterThanOrEqual(3);
     * expect(9).toBeGreaterThanOrEqual(9);
     *
     * @param expected the expected number
     */
    toBeGreaterThanOrEqual(expected: number | bigint): void;
    /**
     * Asserts that a value is a `number` and is less than the expected value.
     *
     * @example
     * expect(-1).toBeLessThan(0);
     * expect(3).toBeLessThan(3.14);
     * expect(9).toBeLessThan(9); // fail
     *
     * @param expected the expected number
     */
    toBeLessThan(expected: number | bigint): void;
    /**
     * Asserts that a value is a `number` and is less than or equal to the expected value.
     *
     * @example
     * expect(-1).toBeLessThanOrEqual(0);
     * expect(3).toBeLessThanOrEqual(3.14);
     * expect(9).toBeLessThanOrEqual(9);
     *
     * @param expected the expected number
     */
    toBeLessThanOrEqual(expected: number | bigint): void;
    /**
     * Asserts that a function throws an error.
     *
     * - If expected is a `string` or `RegExp`, it will check the `message` property.
     * - If expected is an `Error` object, it will check the `name` and `message` properties.
     * - If expected is an `Error` constructor, it will check the class of the `Error`.
     * - If expected is not provided, it will check if anything has thrown.
     *
     * @example
     * function fail() {
     *   throw new Error("Oops!");
     * }
     * expect(fail).toThrow("Oops!");
     * expect(fail).toThrow(/oops/i);
     * expect(fail).toThrow(Error);
     * expect(fail).toThrow();
     *
     * @param expected the expected error, error message, or error pattern
     */
    toThrow(expected?: unknown): void;
    /**
     * Asserts that a function throws an error.
     *
     * - If expected is a `string` or `RegExp`, it will check the `message` property.
     * - If expected is an `Error` object, it will check the `name` and `message` properties.
     * - If expected is an `Error` constructor, it will check the class of the `Error`.
     * - If expected is not provided, it will check if anything has thrown.
     *
     * @example
     * function fail() {
     *   throw new Error("Oops!");
     * }
     * expect(fail).toThrowError("Oops!");
     * expect(fail).toThrowError(/oops/i);
     * expect(fail).toThrowError(Error);
     * expect(fail).toThrowError();
     *
     * @param expected the expected error, error message, or error pattern
     * @alias toThrow
     */
    toThrowError(expected?: unknown): void;
    /**
     * Asserts that a value matches a regular expression or includes a substring.
     *
     * @example
     * expect("dog").toMatch(/dog/);
     * expect("dog").toMatch("og");
     *
     * @param expected the expected substring or pattern.
     */
    toMatch(expected: string | RegExp): void;
    /**
     * Asserts that a value matches the most recent snapshot.
     *
     * @example
     * expect([1, 2, 3]).toMatchSnapshot('hint message');
     * @param hint Hint used to identify the snapshot in the snapshot file.
     */
    toMatchSnapshot(hint?: string): void;
    /**
     * Asserts that a value matches the most recent snapshot.
     *
     * @example
     * expect([1, 2, 3]).toMatchSnapshot();
     * expect({ a: 1, b: 2 }).toMatchSnapshot({ a: 1 });
     * expect({ c: new Date() }).toMatchSnapshot({ c: expect.any(Date) });
     *
     * @param propertyMatchers Object containing properties to match against the value.
     * @param hint Hint used to identify the snapshot in the snapshot file.
     */
    toMatchSnapshot(propertyMatchers?: object, hint?: string): void;
    /**
     * Asserts that a value matches the most recent inline snapshot.
     *
     * @example
     * expect("Hello").toMatchInlineSnapshot();
     * expect("Hello").toMatchInlineSnapshot(`"Hello"`);
     *
     * @param value The latest automatically-updated snapshot value.
     */
    toMatchInlineSnapshot(value?: string): void;
    /**
     * Asserts that a value matches the most recent inline snapshot.
     *
     * @example
     * expect({ c: new Date() }).toMatchInlineSnapshot({ c: expect.any(Date) });
     * expect({ c: new Date() }).toMatchInlineSnapshot({ c: expect.any(Date) }, `
     * {
     *   "v": Any<Date>,
     * }
     * `);
     *
     * @param propertyMatchers Object containing properties to match against the value.
     * @param value The latest automatically-updated snapshot value.
     */
    toMatchInlineSnapshot(propertyMatchers?: object, value?: string): void;
    /**
     * Asserts that a function throws an error matching the most recent snapshot.
     *
     * @example
     * function fail() {
     *   throw new Error("Oops!");
     * }
     * expect(fail).toThrowErrorMatchingSnapshot();
     * expect(fail).toThrowErrorMatchingSnapshot("This one should say Oops!");
     *
     * @param value The latest automatically-updated snapshot value.
     */
    toThrowErrorMatchingSnapshot(hint?: string): void;
    /**
     * Asserts that a function throws an error matching the most recent snapshot.
     *
     * @example
     * function fail() {
     *   throw new Error("Oops!");
     * }
     * expect(fail).toThrowErrorMatchingInlineSnapshot();
     * expect(fail).toThrowErrorMatchingInlineSnapshot(`"Oops!"`);
     *
     * @param value The latest automatically-updated snapshot value.
     */
    toThrowErrorMatchingInlineSnapshot(value?: string): void;
    /**
     * Asserts that an object matches a subset of properties.
     *
     * @example
     * expect({ a: 1, b: 2 }).toMatchObject({ b: 2 });
     * expect({ c: new Date(), d: 2 }).toMatchObject({ d: 2 });
     *
     * @param subset Subset of properties to match with.
     */
    toMatchObject(subset: object): void;
    /**
     * Asserts that a value is empty.
     *
     * @example
     * expect("").toBeEmpty();
     * expect([]).toBeEmpty();
     * expect({}).toBeEmpty();
     * expect(new Set()).toBeEmpty();
     */
    toBeEmpty(): void;
    /**
     * Asserts that a value is an empty `object`.
     *
     * @example
     * expect({}).toBeEmptyObject();
     * expect({ a: 'hello' }).not.toBeEmptyObject();
     */
    toBeEmptyObject(): void;
    /**
     * Asserts that a value is `null` or `undefined`.
     *
     * @example
     * expect(null).toBeNil();
     * expect(undefined).toBeNil();
     */
    toBeNil(): void;
    /**
     * Asserts that a value is a `array`.
     *
     * @link https://jest-extended.jestcommunity.dev/docs/matchers/array/#tobearray
     * @example
     * expect([1]).toBeArray();
     * expect(new Array(1)).toBeArray();
     * expect({}).not.toBeArray();
     */
    toBeArray(): void;
    /**
     * Asserts that a value is a `array` of a certain length.
     *
     * @link https://jest-extended.jestcommunity.dev/docs/matchers/array/#tobearrayofsize
     * @example
     * expect([]).toBeArrayOfSize(0);
     * expect([1]).toBeArrayOfSize(1);
     * expect(new Array(1)).toBeArrayOfSize(1);
     * expect({}).not.toBeArrayOfSize(0);
     */
    toBeArrayOfSize(size: number): void;
    /**
     * Asserts that a value is a `boolean`.
     *
     * @example
     * expect(true).toBeBoolean();
     * expect(false).toBeBoolean();
     * expect(null).not.toBeBoolean();
     * expect(0).not.toBeBoolean();
     */
    toBeBoolean(): void;
    /**
     * Asserts that a value is `true`.
     *
     * @example
     * expect(true).toBeTrue();
     * expect(false).not.toBeTrue();
     * expect(1).not.toBeTrue();
     */
    toBeTrue(): void;
    /**
     * Asserts that a value matches a specific type.
     *
     * @link https://vitest.dev/api/expect.html#tobetypeof
     * @example
     * expect(1).toBeTypeOf("number");
     * expect("hello").toBeTypeOf("string");
     * expect([]).not.toBeTypeOf("boolean");
     */
    toBeTypeOf(type: "bigint" | "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined"): void;
    /**
     * Asserts that a value is `false`.
     *
     * @example
     * expect(false).toBeFalse();
     * expect(true).not.toBeFalse();
     * expect(0).not.toBeFalse();
     */
    toBeFalse(): void;
    /**
     * Asserts that a value is a `number`.
     *
     * @example
     * expect(1).toBeNumber();
     * expect(3.14).toBeNumber();
     * expect(NaN).toBeNumber();
     * expect(BigInt(1)).not.toBeNumber();
     */
    toBeNumber(): void;
    /**
     * Asserts that a value is a `number`, and is an integer.
     *
     * @example
     * expect(1).toBeInteger();
     * expect(3.14).not.toBeInteger();
     * expect(NaN).not.toBeInteger();
     */
    toBeInteger(): void;
    /**
     * Asserts that a value is an `object`.
     *
     * @example
     * expect({}).toBeObject();
     * expect("notAnObject").not.toBeObject();
     * expect(NaN).not.toBeObject();
     */
    toBeObject(): void;
    /**
     * Asserts that a value is a `number`, and is not `NaN` or `Infinity`.
     *
     * @example
     * expect(1).toBeFinite();
     * expect(3.14).toBeFinite();
     * expect(NaN).not.toBeFinite();
     * expect(Infinity).not.toBeFinite();
     */
    toBeFinite(): void;
    /**
     * Asserts that a value is a positive `number`.
     *
     * @example
     * expect(1).toBePositive();
     * expect(-3.14).not.toBePositive();
     * expect(NaN).not.toBePositive();
     */
    toBePositive(): void;
    /**
     * Asserts that a value is a negative `number`.
     *
     * @example
     * expect(-3.14).toBeNegative();
     * expect(1).not.toBeNegative();
     * expect(NaN).not.toBeNegative();
     */
    toBeNegative(): void;
    /**
     * Asserts that a value is a number between a start and end value.
     *
     * @param start the start number (inclusive)
     * @param end the end number (exclusive)
     */
    toBeWithin(start: number, end: number): void;
    /**
     * Asserts that a value is equal to the expected string, ignoring any whitespace.
     *
     * @example
     * expect(" foo ").toEqualIgnoringWhitespace("foo");
     * expect("bar").toEqualIgnoringWhitespace(" bar ");
     *
     * @param expected the expected string
     */
    toEqualIgnoringWhitespace(expected: string): void;
    /**
     * Asserts that a value is a `symbol`.
     *
     * @example
     * expect(Symbol("foo")).toBeSymbol();
     * expect("foo").not.toBeSymbol();
     */
    toBeSymbol(): void;
    /**
     * Asserts that a value is a `function`.
     *
     * @example
     * expect(() => {}).toBeFunction();
     */
    toBeFunction(): void;
    /**
     * Asserts that a value is a `Date` object.
     *
     * To check if a date is valid, use `toBeValidDate()` instead.
     *
     * @example
     * expect(new Date()).toBeDate();
     * expect(new Date(null)).toBeDate();
     * expect("2020-03-01").not.toBeDate();
     */
    toBeDate(): void;
    /**
     * Asserts that a value is a valid `Date` object.
     *
     * @example
     * expect(new Date()).toBeValidDate();
     * expect(new Date(null)).not.toBeValidDate();
     * expect("2020-03-01").not.toBeValidDate();
     */
    toBeValidDate(): void;
    /**
     * Asserts that a value is a `string`.
     *
     * @example
     * expect("foo").toBeString();
     * expect(new String("bar")).toBeString();
     * expect(123).not.toBeString();
     */
    toBeString(): void;
    /**
     * Asserts that a value includes a `string`.
     *
     * For non-string values, use `toContain()` instead.
     *
     * @param expected the expected substring
     */
    toInclude(expected: string): void;
    /**
     * Asserts that a value includes a `string` {times} times.
     * @param expected the expected substring
     * @param times the number of times the substring should occur
     */
    toIncludeRepeated(expected: string, times: number): void;
    /**
     * Checks whether a value satisfies a custom condition.
     * @param {Function} predicate - The custom condition to be satisfied. It should be a function that takes a value as an argument (in this case the value from expect) and returns a boolean.
     * @example
     * expect(1).toSatisfy((val) => val > 0);
     * expect("foo").toSatisfy((val) => val === "foo");
     * expect("bar").not.toSatisfy((val) => val === "bun");
     * @link https://vitest.dev/api/expect.html#tosatisfy
     * @link https://jest-extended.jestcommunity.dev/docs/matchers/toSatisfy
     */
    toSatisfy(predicate: (value: T) => boolean): void;
    /**
     * Asserts that a value starts with a `string`.
     *
     * @param expected the string to start with
     */
    toStartWith(expected: string): void;
    /**
     * Asserts that a value ends with a `string`.
     *
     * @param expected the string to end with
     */
    toEndWith(expected: string): void;
    /**
     * Ensures that a mock function has returned successfully at least once.
     *
     * A promise that is unfulfilled will be considered a failure. If the
     * function threw an error, it will be considered a failure.
     */
    toHaveReturned(): void;

    /**
     * Ensures that a mock function has returned successfully at `times` times.
     *
     * A promise that is unfulfilled will be considered a failure. If the
     * function threw an error, it will be considered a failure.
     */
    toHaveReturnedTimes(times: number): void;

    /**
     * Ensures that a mock function is called.
     */
    toHaveBeenCalled(): void;
    /**
     * Ensures that a mock function is called an exact number of times.
     * @alias toHaveBeenCalled
     */
    toBeCalled(): void;
    /**
     * Ensures that a mock function is called an exact number of times.
     */
    toHaveBeenCalledTimes(expected: number): void;
    /**
     * Ensure that a mock function is called with specific arguments.
     * @alias toHaveBeenCalledTimes
     */
    toBeCalledTimes(expected: number): void;
    /**
     * Ensure that a mock function is called with specific arguments.
     */
    toHaveBeenCalledWith(...expected: unknown[]): void;
    /**
     * Ensure that a mock function is called with specific arguments.
     * @alias toHaveBeenCalledWith
     */
    toBeCalledWith(...expected: unknown[]): void;
    /**
     * Ensure that a mock function is called with specific arguments for the last call.
     */
    toHaveBeenLastCalledWith(...expected: unknown[]): void;
    /**
     * Ensure that a mock function is called with specific arguments for the nth call.
     * @alias toHaveBeenCalledWith
     */
    lastCalledWith(...expected: unknown[]): void;
    /**
     * Ensure that a mock function is called with specific arguments for the nth call.
     */
    toHaveBeenNthCalledWith(n: number, ...expected: unknown[]): void;
    /**
     * Ensure that a mock function is called with specific arguments for the nth call.
     * @alias toHaveBeenCalledWith
     */
    nthCalledWith(n: number, ...expected: unknown[]): void;
  }

  /**
   * Object representing an asymmetric matcher obtained by an static call to expect like `expect.anything()`, `expect.stringContaining("...")`, etc.
   */
  // Defined as an alias of `any` so that it does not trigger any type mismatch
  export type AsymmetricMatcher = any;

  export interface MatcherResult {
    pass: boolean;
    message?: string | (() => string);
  }

  export type CustomMatcher<E, P extends any[]> = (
    this: MatcherContext,
    expected: E,
    ...matcherArguments: P
  ) => MatcherResult | Promise<MatcherResult>;

  /** All non-builtin matchers and asymmetric matchers that have been type-registered through declaration merging */
  export type CustomMatchersDetected = Omit<Matchers<unknown>, keyof MatchersBuiltin<unknown>> &
    Omit<AsymmetricMatchers, keyof AsymmetricMatchersBuiltin>;

  /**
   * If the types has been defined through declaration merging, enforce it.
   * Otherwise enforce the generic custom matcher signature.
   */
  export type ExpectExtendMatchers<M> = {
    [k in keyof M]: k extends keyof CustomMatchersDetected
      ? CustomMatcher<unknown, Parameters<CustomMatchersDetected[k]>>
      : CustomMatcher<unknown, any[]>;
  };

  /** Custom equality tester */
  export type Tester = (this: TesterContext, a: any, b: any, customTesters: Tester[]) => boolean | undefined;

  export type EqualsFunction = (
    a: unknown,
    b: unknown,
    //customTesters?: Array<Tester>,
    //strictCheck?: boolean,
  ) => boolean;

  export interface TesterContext {
    equals: EqualsFunction;
  }

  interface MatcherState {
    //assertionCalls: number;
    //currentConcurrentTestName?: () => string | undefined;
    //currentTestName?: string;
    //error?: Error;
    //expand: boolean;
    //expectedAssertionsNumber: number | null;
    //expectedAssertionsNumberError?: Error;
    //isExpectingAssertions: boolean;
    //isExpectingAssertionsError?: Error;
    isNot: boolean;
    //numPassingAsserts: number;
    promise: string;
    //suppressedErrors: Array<Error>;
    //testPath?: string;
  }

  type MatcherHintColor = (arg: string) => string; // subset of Chalk type

  interface MatcherUtils {
    //customTesters: Array<Tester>;
    //dontThrow(): void; // (internally used by jest snapshot)
    equals: EqualsFunction;
    utils: Readonly<{
      stringify(value: unknown): string;
      printReceived(value: unknown): string;
      printExpected(value: unknown): string;
      matcherHint(
        matcherName: string,
        received?: unknown,
        expected?: unknown,
        options?: {
          isNot?: boolean;
          promise?: string;
          isDirectExpectCall?: boolean; // (internal)
          comment?: string;
          expectedColor?: MatcherHintColor;
          receivedColor?: MatcherHintColor;
          secondArgument?: string;
          secondArgumentColor?: MatcherHintColor;
        },
      ): string;
      //iterableEquality: Tester;
      //subsetEquality: Tester;
      // ...
    }>;
  }

  type MatcherContext = MatcherUtils & MatcherState;

  namespace JestMock {
    /**
     * Copyright (c) Meta Platforms, Inc. and affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export interface ClassLike {
      new (...args: any): any;
    }

    export type ConstructorLikeKeys<T> = keyof {
      [K in keyof T as Required<T>[K] extends ClassLike ? K : never]: T[K];
    };

    // export const fn: <T extends FunctionLike = UnknownFunction>(
    //   implementation?: T | undefined,
    // ) => Mock<T>;

    export type FunctionLike = (...args: any) => any;

    export type MethodLikeKeys<T> = keyof {
      [K in keyof T as Required<T>[K] extends FunctionLike ? K : never]: T[K];
    };

    export interface Mock<T extends (...args: any[]) => any> extends MockInstance<T> {
      (...args: Parameters<T>): ReturnType<T>;
    }

    /**
     * All what the internal typings need is to be sure that we have any-function.
     * `FunctionLike` type ensures that and helps to constrain the type as well.
     * The default of `UnknownFunction` makes sure that `any`s do not leak to the
     * user side. For instance, calling `fn()` without implementation will return
     * a mock of `(...args: Array<unknown>) => unknown` type. If implementation
     * is provided, its typings are inferred correctly.
     */
    // export interface Mock<T extends FunctionLike = UnknownFunction>
    //   extends Function,
    //     MockInstance<T> {
    //   new (...args: Parameters<T>): ReturnType<T>;
    //   (...args: Parameters<T>): ReturnType<T>;
    // }

    // export type Mocked<T> = T extends ClassLike
    //   ? MockedClass<T>
    //   : T extends FunctionLike
    //   ? MockedFunction<T>
    //   : T extends object
    //   ? MockedObject<T>
    //   : T;

    // export const mocked: {
    //   <T extends object>(
    //     source: T,
    //     options?: {
    //       shallow: false;
    //     },
    //   ): Mocked<T>;
    //   <T_1 extends object>(
    //     source: T_1,
    //     options: {
    //       shallow: true;
    //     },
    //   ): MockedShallow<T_1>;
    // };

    // export type MockedClass<T extends ClassLike> = MockInstance<
    //   (...args: ConstructorParameters<T>) => Mocked<InstanceType<T>>
    // > &
    //   MockedObject<T>;

    // export type MockedFunction<T extends FunctionLike> = MockInstance<T> &
    //   MockedObject<T>;

    // type MockedFunctionShallow<T extends FunctionLike> = MockInstance<T> & T;

    // export type MockedObject<T extends object> = {
    //   [K in keyof T]: T[K] extends ClassLike
    //     ? MockedClass<T[K]>
    //     : T[K] extends FunctionLike
    //     ? MockedFunction<T[K]>
    //     : T[K] extends object
    //     ? MockedObject<T[K]>
    //     : T[K];
    // } & T;

    // type MockedObjectShallow<T extends object> = {
    //   [K in keyof T]: T[K] extends ClassLike
    //     ? MockedClass<T[K]>
    //     : T[K] extends FunctionLike
    //     ? MockedFunctionShallow<T[K]>
    //     : T[K];
    // } & T;

    // export type MockedShallow<T> = T extends ClassLike
    //   ? MockedClass<T>
    //   : T extends FunctionLike
    //   ? MockedFunctionShallow<T>
    //   : T extends object
    //   ? MockedObjectShallow<T>
    //   : T;

    // export type MockFunctionMetadata<
    //   T = unknown,
    //   MetadataType = MockMetadataType,
    // > = MockMetadata<T, MetadataType>;

    // export type MockFunctionMetadataType = MockMetadataType;

    type MockFunctionResult<T extends FunctionLike = UnknownFunction> =
      | MockFunctionResultIncomplete
      | MockFunctionResultReturn<T>
      | MockFunctionResultThrow;

    interface MockFunctionResultIncomplete {
      type: "incomplete";
      /**
       * Result of a single call to a mock function that has not yet completed.
       * This occurs if you test the result from within the mock function itself,
       * or from within a function that was called by the mock.
       */
      value: undefined;
    }

    interface MockFunctionResultReturn<T extends FunctionLike = UnknownFunction> {
      type: "return";
      /**
       * Result of a single call to a mock function that returned.
       */
      value: ReturnType<T>;
    }

    interface MockFunctionResultThrow {
      type: "throw";
      /**
       * Result of a single call to a mock function that threw.
       */
      value: unknown;
    }

    interface MockFunctionState<T extends FunctionLike = FunctionLike> {
      /**
       * List of the call arguments of all calls that have been made to the mock.
       */
      calls: Array<Parameters<T>>;
      /**
       * List of all the object instances that have been instantiated from the mock.
       */
      instances: Array<ReturnType<T>>;
      /**
       * List of all the function contexts that have been applied to calls to the mock.
       */
      contexts: Array<ThisParameterType<T>>;
      /**
       * List of the call order indexes of the mock. Jest is indexing the order of
       * invocations of all mocks in a test file. The index is starting with `1`.
       */
      invocationCallOrder: number[];
      /**
       * List of the call arguments of the last call that was made to the mock.
       * If the function was not called, it will return `undefined`.
       */
      lastCall?: Parameters<T>;
      /**
       * List of the results of all calls that have been made to the mock.
       */
      results: Array<MockFunctionResult<T>>;
    }

    export interface MockInstance<T extends FunctionLike = UnknownFunction> {
      _isMockFunction: true;
      _protoImpl: Function;
      getMockImplementation(): T | undefined;
      getMockName(): string;
      mock: MockFunctionState<T>;
      mockClear(): this;
      mockReset(): this;
      mockRestore(): void;
      mockImplementation(fn: T): this;
      mockImplementationOnce(fn: T): this;
      withImplementation(fn: T, callback: () => Promise<unknown>): Promise<void>;
      withImplementation(fn: T, callback: () => void): void;
      mockName(name: string): this;
      mockReturnThis(): this;
      mockReturnValue(value: ReturnType<T>): this;
      mockReturnValueOnce(value: ReturnType<T>): this;
      mockResolvedValue(value: ResolveType<T>): this;
      mockResolvedValueOnce(value: ResolveType<T>): this;
      mockRejectedValue(value: RejectType<T>): this;
      mockRejectedValueOnce(value: RejectType<T>): this;
    }

    // export type MockMetadata<T, MetadataType = MockMetadataType> = {
    //   ref?: number;
    //   members?: Record<string, MockMetadata<T>>;
    //   mockImpl?: T;
    //   name?: string;
    //   refID?: number;
    //   type?: MetadataType;
    //   value?: T;
    //   length?: number;
    // };

    // export type MockMetadataType =
    //   | "object"
    //   | "array"
    //   | "regexp"
    //   | "function"
    //   | "constant"
    //   | "collection"
    //   | "null"
    //   | "undefined";

    // export class ModuleMocker {
    //   private readonly _environmentGlobal;
    //   private _mockState;
    //   private _mockConfigRegistry;
    //   private _spyState;
    //   private _invocationCallCounter;
    //   /**
    //    * @see README.md
    //    * @param global Global object of the test environment, used to create
    //    * mocks
    //    */
    //   constructor(global: typeof globalThis);
    //   private _getSlots;
    //   private _ensureMockConfig;
    //   private _ensureMockState;
    //   private _defaultMockConfig;
    //   private _defaultMockState;
    //   private _makeComponent;
    //   private _createMockFunction;
    //   private _generateMock;
    //   /**
    //    * Check whether the given property of an object has been already replaced.
    //    */
    //   private _findReplacedProperty;
    //   /**
    //    * @see README.md
    //    * @param metadata Metadata for the mock in the schema returned by the
    //    * getMetadata method of this module.
    //    */
    //   generateFromMetadata<T>(metadata: MockMetadata<T>): Mocked<T>;
    //   /**
    //    * @see README.md
    //    * @param component The component for which to retrieve metadata.
    //    */
    //   getMetadata<T = unknown>(
    //     component: T,
    //     _refs?: Map<T, number>,
    //   ): MockMetadata<T> | null;
    //   isMockFunction<T extends FunctionLike = UnknownFunction>(
    //     fn: MockInstance<T>,
    //   ): fn is MockInstance<T>;
    //   isMockFunction<P extends Array<unknown>, R>(
    //     fn: (...args: P) => R,
    //   ): fn is Mock<(...args: P) => R>;
    //   isMockFunction(fn: unknown): fn is Mock<UnknownFunction>;
    //   fn<T extends FunctionLike = UnknownFunction>(implementation?: T): Mock<T>;
    //   private _attachMockImplementation;
    //   spyOn<
    //     T extends object,
    //     K extends PropertyLikeKeys<T>,
    //     A extends "get" | "set",
    //   >(
    //     object: T,
    //     methodKey: K,
    //     accessType: A,
    //   ): A extends "get"
    //     ? SpiedGetter<T[K]>
    //     : A extends "set"
    //     ? SpiedSetter<T[K]>
    //     : never;
    //   spyOn<
    //     T extends object,
    //     K extends ConstructorLikeKeys<T> | MethodLikeKeys<T>,
    //     V extends Required<T>[K],
    //   >(
    //     object: T,
    //     methodKey: K,
    //   ): V extends ClassLike | FunctionLike ? Spied<V> : never;
    //   private _spyOnProperty;
    //   replaceProperty<
    //     T extends object,
    //     K extends PropertyLikeKeys<T>,
    //     V extends T[K],
    //   >(object: T, propertyKey: K, value: V): Replaced<T[K]>;
    //   clearAllMocks(): void;
    //   resetAllMocks(): void;
    //   restoreAllMocks(): void;
    //   private _typeOf;
    //   mocked<T extends object>(
    //     source: T,
    //     options?: {
    //       shallow: false;
    //     },
    //   ): Mocked<T>;
    //   mocked<T extends object>(
    //     source: T,
    //     options: {
    //       shallow: true;
    //     },
    //   ): MockedShallow<T>;
    // }

    export type PropertyLikeKeys<T> = Exclude<keyof T, ConstructorLikeKeys<T> | MethodLikeKeys<T>>;

    export type RejectType<T extends FunctionLike> = ReturnType<T> extends PromiseLike<any> ? unknown : never;

    export interface Replaced<T = unknown> {
      /**
       * Restore property to its original value known at the time of mocking.
       */
      restore(): void;
      /**
       * Change the value of the property.
       */
      replaceValue(value: T): this;
    }

    export function replaceProperty<
      T extends object,
      K_2 extends Exclude<
        keyof T,
        | keyof {
            [K in keyof T as Required<T>[K] extends ClassLike ? K : never]: T[K];
          }
        | keyof {
            [K_1 in keyof T as Required<T>[K_1] extends FunctionLike ? K_1 : never]: T[K_1];
          }
      >,
      V extends T[K_2],
    >(object: T, propertyKey: K_2, value: V): Replaced<T[K_2]>;

    export type ResolveType<T extends FunctionLike> = ReturnType<T> extends PromiseLike<infer U> ? U : never;

    export type Spied<T extends ClassLike | FunctionLike> = T extends ClassLike
      ? SpiedClass<T>
      : T extends FunctionLike
        ? SpiedFunction<T>
        : never;

    export type SpiedClass<T extends ClassLike = UnknownClass> = MockInstance<
      (...args: ConstructorParameters<T>) => InstanceType<T>
    >;

    export type SpiedFunction<T extends FunctionLike = UnknownFunction> = MockInstance<
      (...args: Parameters<T>) => ReturnType<T>
    >;

    export type SpiedGetter<T> = MockInstance<() => T>;

    export type SpiedSetter<T> = MockInstance<(arg: T) => void>;

    export interface SpyInstance<T extends FunctionLike = UnknownFunction> extends MockInstance<T> {}

    export const spyOn: {
      <
        T extends object,
        K_2 extends Exclude<
          keyof T,
          | keyof {
              [K in keyof T as Required<T>[K] extends ClassLike ? K : never]: T[K];
            }
          | keyof {
              [K_1 in keyof T as Required<T>[K_1] extends FunctionLike ? K_1 : never]: T[K_1];
            }
        >,
        V extends Required<T>[K_2],
        A extends "set" | "get",
      >(
        object: T,
        methodKey: K_2,
        accessType: A,
      ): A extends "get" ? SpiedGetter<V> : A extends "set" ? SpiedSetter<V> : never;
      <
        T_1 extends object,
        K_5 extends
          | keyof {
              [K_3 in keyof T_1 as Required<T_1>[K_3] extends ClassLike ? K_3 : never]: T_1[K_3];
            }
          | keyof {
              [K_4 in keyof T_1 as Required<T_1>[K_4] extends FunctionLike ? K_4 : never]: T_1[K_4];
            },
        V_1 extends Required<T_1>[K_5],
      >(
        object: T_1,
        methodKey: K_5,
      ): V_1 extends ClassLike | FunctionLike ? Spied<V_1> : never;
    };

    export interface UnknownClass {
      new (...args: unknown[]): unknown;
    }

    export type UnknownFunction = (...args: unknown[]) => unknown;
  }
}

declare module "bun" {
  namespace WebAssembly {
    type ImportExportKind = "function" | "global" | "memory" | "table";
    type TableKind = "anyfunc" | "externref";
    type ExportValue = Function | Global | WebAssembly.Memory | WebAssembly.Table;
    type Exports = Record<string, ExportValue>;
    type ImportValue = ExportValue | number;
    type Imports = Record<string, ModuleImports>;
    type ModuleImports = Record<string, ImportValue>;

    interface ValueTypeMap {
      anyfunc: Function;
      externref: any;
      f32: number;
      f64: number;
      i32: number;
      i64: bigint;
      v128: never;
    }

    type ValueType = keyof ValueTypeMap;

    interface GlobalDescriptor<T extends ValueType = ValueType> {
      mutable?: boolean;
      value: T;
    }

    interface Global<T extends ValueType = ValueType> {
      // <T extends ValueType = ValueType> {
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Global/value) */
      value: ValueTypeMap[T];
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Global/valueOf) */
      valueOf(): ValueTypeMap[T];
    }

    interface CompileError extends Error {}

    interface LinkError extends Error {}

    interface RuntimeError extends Error {}

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance) */
    interface Instance {
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance/exports) */
      readonly exports: Exports;
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) */
    interface Memory {
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory/buffer) */
      readonly buffer: ArrayBuffer;
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory/grow) */
      grow(delta: number): number;
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module) */
    interface Module {}

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Table) */
    interface Table {
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Table/length) */
      readonly length: number;
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Table/get) */
      get(index: number): any;
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Table/grow) */
      grow(delta: number, value?: any): number;
      /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Table/set) */
      set(index: number, value?: any): void;
    }

    interface MemoryDescriptor {
      initial: number;
      maximum?: number;
      shared?: boolean;
    }

    interface ModuleExportDescriptor {
      kind: ImportExportKind;
      name: string;
    }

    interface ModuleImportDescriptor {
      kind: ImportExportKind;
      module: string;
      name: string;
    }

    interface TableDescriptor {
      element: TableKind;
      initial: number;
      maximum?: number;
    }

    interface WebAssemblyInstantiatedSource {
      instance: Instance;
      module: Module;
    }
  }
}

declare namespace WebAssembly {
  interface ValueTypeMap extends Bun.WebAssembly.ValueTypeMap {}
  interface GlobalDescriptor<T extends keyof ValueTypeMap = keyof ValueTypeMap>
    extends Bun.WebAssembly.GlobalDescriptor<T> {}
  interface MemoryDescriptor extends Bun.WebAssembly.MemoryDescriptor {}
  interface ModuleExportDescriptor extends Bun.WebAssembly.ModuleExportDescriptor {}
  interface ModuleImportDescriptor extends Bun.WebAssembly.ModuleImportDescriptor {}
  interface TableDescriptor extends Bun.WebAssembly.TableDescriptor {}
  interface WebAssemblyInstantiatedSource extends Bun.WebAssembly.WebAssemblyInstantiatedSource {}

  interface LinkError extends Bun.WebAssembly.LinkError {}
  var LinkError: {
    prototype: LinkError;
    new (message?: string): LinkError;
    (message?: string): LinkError;
  };

  interface CompileError extends Bun.WebAssembly.CompileError {}
  var CompileError: {
    prototype: CompileError;
    new (message?: string): CompileError;
    (message?: string): CompileError;
  };

  interface RuntimeError extends Bun.WebAssembly.RuntimeError {}
  var RuntimeError: {
    prototype: RuntimeError;
    new (message?: string): RuntimeError;
    (message?: string): RuntimeError;
  };

  interface Global<T extends keyof ValueTypeMap = keyof ValueTypeMap> extends Bun.WebAssembly.Global<T> {}
  var Global: {
    prototype: Global;
    new <T extends Bun.WebAssembly.ValueType = Bun.WebAssembly.ValueType>(
      descriptor: GlobalDescriptor<T>,
      v?: ValueTypeMap[T],
    ): Global<T>;
  };

  interface Instance extends Bun.WebAssembly.Instance {}
  var Instance: {
    prototype: Instance;
    new (module: Module, importObject?: Bun.WebAssembly.Imports): Instance;
  };

  interface Memory extends Bun.WebAssembly.Memory {}
  var Memory: {
    prototype: Memory;
    new (descriptor: MemoryDescriptor): Memory;
  };

  interface Module extends Bun.WebAssembly.Module {}
  var Module: Bun.__internal.UseLibDomIfAvailable<
    "WebAssembly",
    {
      Module: {
        prototype: Module;
        new (bytes: Bun.BufferSource): Module;
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module/customSections) */
        customSections(moduleObject: Module, sectionName: string): ArrayBuffer[];
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module/exports) */
        exports(moduleObject: Module): ModuleExportDescriptor[];
        /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module/imports) */
        imports(moduleObject: Module): ModuleImportDescriptor[];
      };
    }
  >["Module"];

  interface Table extends Bun.WebAssembly.Table {}
  var Table: {
    prototype: Table;
    new (descriptor: TableDescriptor, value?: any): Table;
  };

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/compile) */
  function compile(bytes: Bun.BufferSource): Promise<Module>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/compileStreaming) */
  function compileStreaming(source: Response | PromiseLike<Response>): Promise<Module>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate) */
  function instantiate(
    bytes: Bun.BufferSource,
    importObject?: Bun.WebAssembly.Imports,
  ): Promise<WebAssemblyInstantiatedSource>;
  function instantiate(moduleObject: Module, importObject?: Bun.WebAssembly.Imports): Promise<Instance>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming) */
  function instantiateStreaming(
    source: Response | PromiseLike<Response>,
    importObject?: Bun.WebAssembly.Imports,
  ): Promise<WebAssemblyInstantiatedSource>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/validate) */
  function validate(bytes: Bun.BufferSource): boolean;
}

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Bun.Env, ImportMetaEnv {}

    interface Process {
      readonly version: string;
      browser: boolean;

      /**
       * Whether you are using Bun
       */
      isBun: true;

      /**
       * The current git sha of Bun
       */
      revision: string;

      reallyExit(code?: number): never;
      dlopen(module: { exports: any }, filename: string, flags?: number): void;
      _exiting: boolean;
      noDeprecation: boolean;

      binding(m: "constants"): {
        os: typeof import("node:os").constants;
        fs: typeof import("node:fs").constants;
        crypto: typeof import("node:crypto").constants;
        zlib: typeof import("node:zlib").constants;
        trace: {
          TRACE_EVENT_PHASE_BEGIN: number;
          TRACE_EVENT_PHASE_END: number;
          TRACE_EVENT_PHASE_COMPLETE: number;
          TRACE_EVENT_PHASE_INSTANT: number;
          TRACE_EVENT_PHASE_ASYNC_BEGIN: number;
          TRACE_EVENT_PHASE_ASYNC_STEP_INTO: number;
          TRACE_EVENT_PHASE_ASYNC_STEP_PAST: number;
          TRACE_EVENT_PHASE_ASYNC_END: number;
          TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN: number;
          TRACE_EVENT_PHASE_NESTABLE_ASYNC_END: number;
          TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT: number;
          TRACE_EVENT_PHASE_FLOW_BEGIN: number;
          TRACE_EVENT_PHASE_FLOW_STEP: number;
          TRACE_EVENT_PHASE_FLOW_END: number;
          TRACE_EVENT_PHASE_METADATA: number;
          TRACE_EVENT_PHASE_COUNTER: number;
          TRACE_EVENT_PHASE_SAMPLE: number;
          TRACE_EVENT_PHASE_CREATE_OBJECT: number;
          TRACE_EVENT_PHASE_SNAPSHOT_OBJECT: number;
          TRACE_EVENT_PHASE_DELETE_OBJECT: number;
          TRACE_EVENT_PHASE_MEMORY_DUMP: number;
          TRACE_EVENT_PHASE_MARK: number;
          TRACE_EVENT_PHASE_CLOCK_SYNC: number;
          TRACE_EVENT_PHASE_ENTER_CONTEXT: number;
          TRACE_EVENT_PHASE_LEAVE_CONTEXT: number;
          TRACE_EVENT_PHASE_LINK_IDS: number;
        };
      };
      binding(m: "uv"): {
        errname(code: number): string;
        UV_E2BIG: number;
        UV_EACCES: number;
        UV_EADDRINUSE: number;
        UV_EADDRNOTAVAIL: number;
        UV_EAFNOSUPPORT: number;
        UV_EAGAIN: number;
        UV_EAI_ADDRFAMILY: number;
        UV_EAI_AGAIN: number;
        UV_EAI_BADFLAGS: number;
        UV_EAI_BADHINTS: number;
        UV_EAI_CANCELED: number;
        UV_EAI_FAIL: number;
        UV_EAI_FAMILY: number;
        UV_EAI_MEMORY: number;
        UV_EAI_NODATA: number;
        UV_EAI_NONAME: number;
        UV_EAI_OVERFLOW: number;
        UV_EAI_PROTOCOL: number;
        UV_EAI_SERVICE: number;
        UV_EAI_SOCKTYPE: number;
        UV_EALREADY: number;
        UV_EBADF: number;
        UV_EBUSY: number;
        UV_ECANCELED: number;
        UV_ECHARSET: number;
        UV_ECONNABORTED: number;
        UV_ECONNREFUSED: number;
        UV_ECONNRESET: number;
        UV_EDESTADDRREQ: number;
        UV_EEXIST: number;
        UV_EFAULT: number;
        UV_EFBIG: number;
        UV_EHOSTUNREACH: number;
        UV_EINTR: number;
        UV_EINVAL: number;
        UV_EIO: number;
        UV_EISCONN: number;
        UV_EISDIR: number;
        UV_ELOOP: number;
        UV_EMFILE: number;
        UV_EMSGSIZE: number;
        UV_ENAMETOOLONG: number;
        UV_ENETDOWN: number;
        UV_ENETUNREACH: number;
        UV_ENFILE: number;
        UV_ENOBUFS: number;
        UV_ENODEV: number;
        UV_ENOENT: number;
        UV_ENOMEM: number;
        UV_ENONET: number;
        UV_ENOPROTOOPT: number;
        UV_ENOSPC: number;
        UV_ENOSYS: number;
        UV_ENOTCONN: number;
        UV_ENOTDIR: number;
        UV_ENOTEMPTY: number;
        UV_ENOTSOCK: number;
        UV_ENOTSUP: number;
        UV_EOVERFLOW: number;
        UV_EPERM: number;
        UV_EPIPE: number;
        UV_EPROTO: number;
        UV_EPROTONOSUPPORT: number;
        UV_EPROTOTYPE: number;
        UV_ERANGE: number;
        UV_EROFS: number;
        UV_ESHUTDOWN: number;
        UV_ESPIPE: number;
        UV_ESRCH: number;
        UV_ETIMEDOUT: number;
        UV_ETXTBSY: number;
        UV_EXDEV: number;
        UV_UNKNOWN: number;
        UV_EOF: number;
        UV_ENXIO: number;
        UV_EMLINK: number;
        UV_EHOSTDOWN: number;
        UV_EREMOTEIO: number;
        UV_ENOTTY: number;
        UV_EFTYPE: number;
        UV_EILSEQ: number;
        UV_ESOCKTNOSUPPORT: number;
        UV_ENODATA: number;
        UV_EUNATCH: number;
      };
      binding(m: string): object;
    }

    interface ProcessVersions extends Dict<string> {
      bun: string;
    }
  }
}

declare module "fs/promises" {
  function exists(path: Bun.PathLike): Promise<boolean>;
}

declare module "tls" {
  interface BunConnectionOptions extends Omit<ConnectionOptions, "key" | "ca" | "tls" | "cert"> {
    /**
     * Optionally override the trusted CA certificates. Default is to trust
     * the well-known CAs curated by Mozilla. Mozilla's CAs are completely
     * replaced when CAs are explicitly specified using this option.
     */
    ca?: string | Buffer | NodeJS.TypedArray | Bun.BunFile | Array<string | Buffer | Bun.BunFile> | undefined;
    /**
     *  Cert chains in PEM format. One cert chain should be provided per
     *  private key. Each cert chain should consist of the PEM formatted
     *  certificate for a provided private key, followed by the PEM
     *  formatted intermediate certificates (if any), in order, and not
     *  including the root CA (the root CA must be pre-known to the peer,
     *  see ca). When providing multiple cert chains, they do not have to
     *  be in the same order as their private keys in key. If the
     *  intermediate certificates are not provided, the peer will not be
     *  able to validate the certificate, and the handshake will fail.
     */
    cert?:
      | string
      | Buffer
      | NodeJS.TypedArray
      | Bun.BunFile
      | Array<string | Buffer | NodeJS.TypedArray | Bun.BunFile>
      | undefined;
    /**
     * Private keys in PEM format. PEM allows the option of private keys
     * being encrypted. Encrypted keys will be decrypted with
     * options.passphrase. Multiple keys using different algorithms can be
     * provided either as an array of unencrypted key strings or buffers,
     * or an array of objects in the form {pem: <string|buffer>[,
     * passphrase: <string>]}. The object form can only occur in an array.
     * object.passphrase is optional. Encrypted keys will be decrypted with
     * object.passphrase if provided, or options.passphrase if it is not.
     */
    key?:
      | string
      | Buffer
      | Bun.BunFile
      | NodeJS.TypedArray
      | Array<string | Buffer | Bun.BunFile | NodeJS.TypedArray | KeyObject>
      | undefined;
  }

  function connect(options: BunConnectionOptions, secureConnectListener?: () => void): TLSSocket;
}

declare module "bun" {
  interface BunMessageEvent<T> {
    /**
     * @deprecated
     */
    initMessageEvent(
      type: string,
      bubbles?: boolean,
      cancelable?: boolean,
      data?: any,
      origin?: string,
      lastEventId?: string,
      source?: null,
    ): void;
  }

  /**
   * @deprecated Renamed to `ErrorLike`
   */
  type Errorlike = ErrorLike;
  interface TLSOptions {
    /**
     * File path to a TLS key
     *
     * To enable TLS, this option is required.
     *
     * @deprecated since v0.6.3 - Use `key: Bun.file(path)` instead.
     */
    keyFile?: string;
    /**
     * File path to a TLS certificate
     *
     * To enable TLS, this option is required.
     *
     * @deprecated since v0.6.3 - Use `cert: Bun.file(path)` instead.
     */
    certFile?: string;
    /**
     *  File path to a .pem file for a custom root CA
     *
     * @deprecated since v0.6.3 - Use `ca: Bun.file(path)` instead.
     */
    caFile?: string;
  }
}

declare namespace NodeJS {
  interface Process {
    /**
     * @deprecated This is deprecated; use the "node:assert" module instead.
     */
    assert(value: unknown, message?: string | Error): asserts value;
  }
}

interface CustomEvent<T = any> {
  /** @deprecated */
  initCustomEvent(type: string, bubbles?: boolean, cancelable?: boolean, detail?: T): void;
}

interface DOMException {
  /** @deprecated */
  readonly code: number;
}

/**
 * @deprecated Renamed to `BuildMessage`
 */
declare var BuildError: typeof BuildMessage;

/**
 * @deprecated Renamed to `ResolveMessage`
 */
declare var ResolveError: typeof ResolveMessage;

declare module "bun" {
  export interface RedisOptions {
    /**
     * Connection timeout in milliseconds
     * @default 10000
     */
    connectionTimeout?: number;

    /**
     * Idle timeout in milliseconds
     * @default 0 (no timeout)
     */
    idleTimeout?: number;

    /**
     * Whether to automatically reconnect
     * @default true
     */
    autoReconnect?: boolean;

    /**
     * Maximum number of reconnection attempts
     * @default 10
     */
    maxRetries?: number;

    /**
     * Whether to queue commands when disconnected
     * @default true
     */
    enableOfflineQueue?: boolean;

    /**
     * TLS options
     * Can be a boolean or an object with TLS options
     */
    tls?:
      | boolean
      | {
          key?: string | Buffer;
          cert?: string | Buffer;
          ca?: string | Buffer | Array<string | Buffer>;
          rejectUnauthorized?: boolean;
        };

    /**
     * Whether to enable auto-pipelining
     * @default true
     */
    enableAutoPipelining?: boolean;
  }

  export namespace RedisClient {
    type KeyLike = string | ArrayBufferView | Blob;
  }

  export class RedisClient {
    /**
     * Creates a new Redis client
     * @param url URL to connect to, defaults to process.env.VALKEY_URL, process.env.REDIS_URL, or "valkey://localhost:6379"
     * @param options Additional options
     *
     * @example
     * ```ts
     * const valkey = new RedisClient();
     *
     * await valkey.set("hello", "world");
     *
     * console.log(await valkey.get("hello"));
     * ```
     */
    constructor(url?: string, options?: RedisOptions);

    /**
     * Whether the client is connected to the Redis server
     */
    readonly connected: boolean;

    /**
     * Amount of data buffered in bytes
     */
    readonly bufferedAmount: number;

    /**
     * Callback fired when the client connects to the Redis server
     */
    onconnect: ((this: RedisClient) => void) | null;

    /**
     * Callback fired when the client disconnects from the Redis server
     * @param error The error that caused the disconnection
     */
    onclose: ((this: RedisClient, error: Error) => void) | null;

    /**
     * Connect to the Redis server
     * @returns A promise that resolves when connected
     */
    connect(): Promise<void>;

    /**
     * Disconnect from the Redis server
     */
    close(): void;

    /**
     * Send a raw command to the Redis server
     * @param command The command to send
     * @param args The arguments to the command
     * @returns A promise that resolves with the command result
     */
    send(command: string, args: string[]): Promise<any>;

    /**
     * Get the value of a key
     * @param key The key to get
     * @returns Promise that resolves with the key's value as a string, or null if the key doesn't exist
     */
    get(key: RedisClient.KeyLike): Promise<string | null>;

    /**
     * Get the value of a key as a Uint8Array
     * @param key The key to get
     * @returns Promise that resolves with the key's value as a Uint8Array, or null if the key doesn't exist
     */
    getBuffer(key: RedisClient.KeyLike): Promise<Uint8Array<ArrayBuffer> | null>;

    /**
     * Set key to hold the string value
     * @param key The key to set
     * @param value The value to set
     * @returns Promise that resolves with "OK" on success
     */
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<"OK">;

    /**
     * Set key to hold the string value with expiration
     * @param key The key to set
     * @param value The value to set
     * @param ex Set the specified expire time, in seconds
     * @returns Promise that resolves with "OK" on success
     */
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, ex: "EX", seconds: number): Promise<"OK">;

    /**
     * Set key to hold the string value with expiration
     * @param key The key to set
     * @param value The value to set
     * @param px Set the specified expire time, in milliseconds
     * @returns Promise that resolves with "OK" on success
     */
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, px: "PX", milliseconds: number): Promise<"OK">;

    /**
     * Set key to hold the string value with expiration at a specific Unix timestamp
     * @param key The key to set
     * @param value The value to set
     * @param exat Set the specified Unix time at which the key will expire, in seconds
     * @returns Promise that resolves with "OK" on success
     */
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, exat: "EXAT", timestampSeconds: number): Promise<"OK">;

    /**
     * Set key to hold the string value with expiration at a specific Unix timestamp
     * @param key The key to set
     * @param value The value to set
     * @param pxat Set the specified Unix time at which the key will expire, in milliseconds
     * @returns Promise that resolves with "OK" on success
     */
    set(
      key: RedisClient.KeyLike,
      value: RedisClient.KeyLike,
      pxat: "PXAT",
      timestampMilliseconds: number,
    ): Promise<"OK">;

    /**
     * Set key to hold the string value only if key does not exist
     * @param key The key to set
     * @param value The value to set
     * @param nx Only set the key if it does not already exist
     * @returns Promise that resolves with "OK" on success, or null if the key already exists
     */
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, nx: "NX"): Promise<"OK" | null>;

    /**
     * Set key to hold the string value only if key already exists
     * @param key The key to set
     * @param value The value to set
     * @param xx Only set the key if it already exists
     * @returns Promise that resolves with "OK" on success, or null if the key does not exist
     */
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, xx: "XX"): Promise<"OK" | null>;

    /**
     * Set key to hold the string value and return the old value
     * @param key The key to set
     * @param value The value to set
     * @param get Return the old string stored at key, or null if key did not exist
     * @returns Promise that resolves with the old value, or null if key did not exist
     */
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, get: "GET"): Promise<string | null>;

    /**
     * Set key to hold the string value and retain the time to live
     * @param key The key to set
     * @param value The value to set
     * @param keepttl Retain the time to live associated with the key
     * @returns Promise that resolves with "OK" on success
     */
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, keepttl: "KEEPTTL"): Promise<"OK">;

    /**
     * Set key to hold the string value with various options
     * @param key The key to set
     * @param value The value to set
     * @param options Array of options (EX, PX, EXAT, PXAT, NX, XX, KEEPTTL, GET)
     * @returns Promise that resolves with "OK" on success, null if NX/XX condition not met, or the old value if GET is specified
     */
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, ...options: string[]): Promise<"OK" | string | null>;

    /**
     * Delete a key(s)
     * @param keys The keys to delete
     * @returns Promise that resolves with the number of keys removed
     */
    del(...keys: RedisClient.KeyLike[]): Promise<number>;

    /**
     * Increment the integer value of a key by one
     * @param key The key to increment
     * @returns Promise that resolves with the new value
     */
    incr(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Decrement the integer value of a key by one
     * @param key The key to decrement
     * @returns Promise that resolves with the new value
     */
    decr(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Determine if a key exists
     * @param key The key to check
     * @returns Promise that resolves with true if the key exists, false otherwise
     */
    exists(key: RedisClient.KeyLike): Promise<boolean>;

    /**
     * Set a key's time to live in seconds
     * @param key The key to set the expiration for
     * @param seconds The number of seconds until expiration
     * @returns Promise that resolves with 1 if the timeout was set, 0 if not
     */
    expire(key: RedisClient.KeyLike, seconds: number): Promise<number>;

    /**
     * Get the time to live for a key in seconds
     * @param key The key to get the TTL for
     * @returns Promise that resolves with the TTL, -1 if no expiry, or -2 if key doesn't exist
     */
    ttl(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Set multiple hash fields to multiple values
     * @param key The hash key
     * @param fieldValues An array of alternating field names and values
     * @returns Promise that resolves with "OK" on success
     */
    hmset(key: RedisClient.KeyLike, fieldValues: string[]): Promise<string>;

    /**
     * Get the values of all the given hash fields
     * @param key The hash key
     * @param fields The fields to get
     * @returns Promise that resolves with an array of values
     */
    hmget(key: RedisClient.KeyLike, fields: string[]): Promise<Array<string | null>>;

    /**
     * Check if a value is a member of a set
     * @param key The set key
     * @param member The member to check
     * @returns Promise that resolves with true if the member exists, false otherwise
     */
    sismember(key: RedisClient.KeyLike, member: string): Promise<boolean>;

    /**
     * Add a member to a set
     * @param key The set key
     * @param member The member to add
     * @returns Promise that resolves with 1 if the member was added, 0 if it already existed
     */
    sadd(key: RedisClient.KeyLike, member: string): Promise<number>;

    /**
     * Remove a member from a set
     * @param key The set key
     * @param member The member to remove
     * @returns Promise that resolves with 1 if the member was removed, 0 if it didn't exist
     */
    srem(key: RedisClient.KeyLike, member: string): Promise<number>;

    /**
     * Get all the members in a set
     * @param key The set key
     * @returns Promise that resolves with an array of all members
     */
    smembers(key: RedisClient.KeyLike): Promise<string[]>;

    /**
     * Get a random member from a set
     * @param key The set key
     * @returns Promise that resolves with a random member, or null if the set is empty
     */
    srandmember(key: RedisClient.KeyLike): Promise<string | null>;

    /**
     * Remove and return a random member from a set
     * @param key The set key
     * @returns Promise that resolves with the removed member, or null if the set is empty
     */
    spop(key: RedisClient.KeyLike): Promise<string | null>;

    /**
     * Increment the integer value of a hash field by the given number
     * @param key The hash key
     * @param field The field to increment
     * @param increment The amount to increment by
     * @returns Promise that resolves with the new value
     */
    hincrby(key: RedisClient.KeyLike, field: string, increment: string | number): Promise<number>;

    /**
     * Increment the float value of a hash field by the given amount
     * @param key The hash key
     * @param field The field to increment
     * @param increment The amount to increment by
     * @returns Promise that resolves with the new value as a string
     */
    hincrbyfloat(key: RedisClient.KeyLike, field: string, increment: string | number): Promise<string>;

    /**
     * Get all the fields and values in a hash
     * @param key The hash key
     * @returns Promise that resolves with an object containing all fields and values
     */
    hgetall(key: RedisClient.KeyLike): Promise<Record<string, string> | null>;

    /**
     * Get all field names in a hash
     * @param key The hash key
     * @returns Promise that resolves with an array of field names
     */
    hkeys(key: RedisClient.KeyLike): Promise<string[]>;

    /**
     * Get the number of fields in a hash
     * @param key The hash key
     * @returns Promise that resolves with the number of fields
     */
    hlen(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Get all values in a hash
     * @param key The hash key
     * @returns Promise that resolves with an array of values
     */
    hvals(key: RedisClient.KeyLike): Promise<string[]>;

    /**
     * Find all keys matching the given pattern
     * @param pattern The pattern to match
     * @returns Promise that resolves with an array of matching keys
     */
    keys(pattern: string): Promise<string[]>;

    /**
     * Get the length of a list
     * @param key The list key
     * @returns Promise that resolves with the length of the list
     */
    llen(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Remove and get the first element in a list
     * @param key The list key
     * @returns Promise that resolves with the first element, or null if the list is empty
     */
    lpop(key: RedisClient.KeyLike): Promise<string | null>;

    /**
     * Remove the expiration from a key
     * @param key The key to persist
     * @returns Promise that resolves with 1 if the timeout was removed, 0 if the key doesn't exist or has no timeout
     */
    persist(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Get the expiration time of a key as a UNIX timestamp in milliseconds
     * @param key The key to check
     * @returns Promise that resolves with the timestamp, or -1 if the key has no expiration, or -2 if the key doesn't exist
     */
    pexpiretime(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Get the time to live for a key in milliseconds
     * @param key The key to check
     * @returns Promise that resolves with the TTL in milliseconds, or -1 if the key has no expiration, or -2 if the key doesn't exist
     */
    pttl(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Remove and get the last element in a list
     * @param key The list key
     * @returns Promise that resolves with the last element, or null if the list is empty
     */
    rpop(key: RedisClient.KeyLike): Promise<string | null>;

    /**
     * Get the number of members in a set
     * @param key The set key
     * @returns Promise that resolves with the cardinality (number of elements) of the set
     */
    scard(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Get the length of the value stored in a key
     * @param key The key to check
     * @returns Promise that resolves with the length of the string value, or 0 if the key doesn't exist
     */
    strlen(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Get the number of members in a sorted set
     * @param key The sorted set key
     * @returns Promise that resolves with the cardinality (number of elements) of the sorted set
     */
    zcard(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Remove and return members with the highest scores in a sorted set
     * @param key The sorted set key
     * @returns Promise that resolves with the removed member and its score, or null if the set is empty
     */
    zpopmax(key: RedisClient.KeyLike): Promise<string | null>;

    /**
     * Remove and return members with the lowest scores in a sorted set
     * @param key The sorted set key
     * @returns Promise that resolves with the removed member and its score, or null if the set is empty
     */
    zpopmin(key: RedisClient.KeyLike): Promise<string | null>;

    /**
     * Get one or multiple random members from a sorted set
     * @param key The sorted set key
     * @returns Promise that resolves with a random member, or null if the set is empty
     */
    zrandmember(key: RedisClient.KeyLike): Promise<string | null>;

    /**
     * Append a value to a key
     * @param key The key to append to
     * @param value The value to append
     * @returns Promise that resolves with the length of the string after the append operation
     */
    append(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<number>;

    /**
     * Set the value of a key and return its old value
     * @param key The key to set
     * @param value The value to set
     * @returns Promise that resolves with the old value, or null if the key didn't exist
     */
    getset(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<string | null>;

    /**
     * Prepend one or multiple values to a list
     * @param key The list key
     * @param value The value to prepend
     * @returns Promise that resolves with the length of the list after the push operation
     */
    lpush(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<number>;

    /**
     * Prepend a value to a list, only if the list exists
     * @param key The list key
     * @param value The value to prepend
     * @returns Promise that resolves with the length of the list after the push operation, or 0 if the list doesn't exist
     */
    lpushx(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<number>;

    /**
     * Add one or more members to a HyperLogLog
     * @param key The HyperLogLog key
     * @param element The element to add
     * @returns Promise that resolves with 1 if the HyperLogLog was altered, 0 otherwise
     */
    pfadd(key: RedisClient.KeyLike, element: string): Promise<number>;

    /**
     * Append one or multiple values to a list
     * @param key The list key
     * @param value The value to append
     * @returns Promise that resolves with the length of the list after the push operation
     */
    rpush(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<number>;

    /**
     * Append a value to a list, only if the list exists
     * @param key The list key
     * @param value The value to append
     * @returns Promise that resolves with the length of the list after the push operation, or 0 if the list doesn't exist
     */
    rpushx(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<number>;

    /**
     * Set the value of a key, only if the key does not exist
     * @param key The key to set
     * @param value The value to set
     * @returns Promise that resolves with 1 if the key was set, 0 if the key was not set
     */
    setnx(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<number>;

    /**
     * Get the score associated with the given member in a sorted set
     * @param key The sorted set key
     * @param member The member to get the score for
     * @returns Promise that resolves with the score of the member as a string, or null if the member or key doesn't exist
     */
    zscore(key: RedisClient.KeyLike, member: string): Promise<string | null>;

    /**
     * Get the values of all specified keys
     * @param keys The keys to get
     * @returns Promise that resolves with an array of values, with null for keys that don't exist
     */
    mget(...keys: RedisClient.KeyLike[]): Promise<(string | null)[]>;

    /**
     * Count the number of set bits (population counting) in a string
     * @param key The key to count bits in
     * @returns Promise that resolves with the number of bits set to 1
     */
    bitcount(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Return a serialized version of the value stored at the specified key
     * @param key The key to dump
     * @returns Promise that resolves with the serialized value, or null if the key doesn't exist
     */
    dump(key: RedisClient.KeyLike): Promise<string | null>;

    /**
     * Get the expiration time of a key as a UNIX timestamp in seconds
     * @param key The key to check
     * @returns Promise that resolves with the timestamp, or -1 if the key has no expiration, or -2 if the key doesn't exist
     */
    expiretime(key: RedisClient.KeyLike): Promise<number>;

    /**
     * Get the value of a key and delete the key
     * @param key The key to get and delete
     * @returns Promise that resolves with the value of the key, or null if the key doesn't exist
     */
    getdel(key: RedisClient.KeyLike): Promise<string | null>;

    /**
     * Get the value of a key and optionally set its expiration
     * @param key The key to get
     * @returns Promise that resolves with the value of the key, or null if the key doesn't exist
     */
    getex(key: RedisClient.KeyLike): Promise<string | null>;

    /**
     *  Ping the server
     *  @returns Promise that resolves with "PONG" if the server is reachable, or throws an error if the server is not reachable
     */
    ping(): Promise<"PONG">;

    /**
     *  Ping the server with a message
     *  @param message The message to send to the server
     *  @returns Promise that resolves with the message if the server is reachable, or throws an error if the server is not reachable
     */
    ping(message: RedisClient.KeyLike): Promise<string>;
  }

  /**
   * Default Redis client
   *
   * Connection information populated from one of, in order of preference:
   * - `process.env.VALKEY_URL`
   * - `process.env.REDIS_URL`
   * - `"valkey://localhost:6379"`
   *
   */
  export const redis: RedisClient;
}

declare module "bun" {
  type ShellFunction = (input: Uint8Array) => Uint8Array;

  type ShellExpression =
    | { toString(): string }
    | Array<ShellExpression>
    | string
    | { raw: string }
    | Subprocess<SpawnOptions.Writable, SpawnOptions.Readable, SpawnOptions.Readable>
    | SpawnOptions.Readable
    | SpawnOptions.Writable
    | ReadableStream;

  /**
   * The [Bun shell](https://bun.sh/docs/runtime/shell) is a powerful tool for running shell commands.
   *
   * @example
   * ```ts
   * const result = await $`echo "Hello, world!"`.text();
   * console.log(result); // "Hello, world!"
   * ```
   *
   * @category Process Management
   */
  function $(strings: TemplateStringsArray, ...expressions: ShellExpression[]): $.ShellPromise;

  type $ = typeof $;

  namespace $ {
    /**
     * Perform bash-like brace expansion on the given pattern.
     * @param pattern - Brace pattern to expand
     *
     * @example
     * ```js
     * const result = braces('index.{js,jsx,ts,tsx}');
     * console.log(result) // ['index.js', 'index.jsx', 'index.ts', 'index.tsx']
     * ```
     */
    function braces(pattern: string): string[];

    /**
     * Escape strings for input into shell commands.
     * @param input
     */
    function escape(input: string): string;

    /**
     *
     * Change the default environment variables for shells created by this instance.
     *
     * @param newEnv Default environment variables to use for shells created by this instance.
     * @default process.env
     *
     * @example
     * ```js
     * import {$} from 'bun';
     * $.env({ BUN: "bun" });
     * await $`echo $BUN`;
     * // "bun"
     * ```
     */
    function env(newEnv?: Record<string, string | undefined>): $;

    /**
     *
     * @param newCwd Default working directory to use for shells created by this instance.
     */
    function cwd(newCwd?: string): $;

    /**
     * Configure the shell to not throw an exception on non-zero exit codes.
     */
    function nothrow(): $;

    /**
     * Configure whether or not the shell should throw an exception on non-zero exit codes.
     */
    function throws(shouldThrow: boolean): $;

    /**
     * The `Bun.$.ShellPromise` class represents a shell command that gets executed
     * once awaited, or called with `.text()`, `.json()`, etc.
     *
     * @example
     * ```ts
     * const myShellPromise = $`echo "Hello, world!"`;
     * const result = await myShellPromise.text();
     * console.log(result); // "Hello, world!"
     * ```
     */
    class ShellPromise extends Promise<ShellOutput> {
      get stdin(): WritableStream;

      /**
       * Change the current working directory of the shell.
       * @param newCwd - The new working directory
       */
      cwd(newCwd: string): this;

      /**
       * Set environment variables for the shell.
       * @param newEnv - The new environment variables
       *
       * @example
       * ```ts
       * await $`echo $FOO`.env({ ...process.env, FOO: "LOL!" })
       * expect(stdout.toString()).toBe("LOL!");
       * ```
       */
      env(newEnv: Record<string, string> | undefined): this;

      /**
       * By default, the shell will write to the current process's stdout and stderr, as well as buffering that output.
       *
       * This configures the shell to only buffer the output.
       */
      quiet(): this;

      /**
       * Read from stdout as a string, line by line
       *
       * Automatically calls {@link quiet} to disable echoing to stdout.
       */
      lines(): AsyncIterable<string>;

      /**
       * Read from stdout as a string.
       *
       * Automatically calls {@link quiet} to disable echoing to stdout.
       *
       * @param encoding - The encoding to use when decoding the output
       * @returns A promise that resolves with stdout as a string
       *
       * @example
       * **Read as UTF-8 string**
       * ```ts
       * const output = await $`echo hello`.text();
       * console.log(output); // "hello\n"
       * ```
       *
       * **Read as base64 string**
       * ```ts
       * const output = await $`echo ${atob("hello")}`.text("base64");
       * console.log(output); // "hello\n"
       * ```
       */
      text(encoding?: BufferEncoding): Promise<string>;

      /**
       * Read from stdout as a JSON object
       *
       * Automatically calls {@link quiet}
       *
       * @returns A promise that resolves with stdout as a JSON object
       * @example
       *
       * ```ts
       * const output = await $`echo '{"hello": 123}'`.json();
       * console.log(output); // { hello: 123 }
       * ```
       *
       */
      json(): Promise<any>;

      /**
       * Read from stdout as an ArrayBuffer
       *
       * Automatically calls {@link quiet}
       * @returns A promise that resolves with stdout as an ArrayBuffer
       * @example
       *
       * ```ts
       * const output = await $`echo hello`.arrayBuffer();
       * console.log(output); // ArrayBuffer { byteLength: 6 }
       * ```
       */
      arrayBuffer(): Promise<ArrayBuffer>;

      /**
       * Read from stdout as a Blob
       *
       * Automatically calls {@link quiet}
       * @returns A promise that resolves with stdout as a Blob
       * @example
       * ```ts
       * const output = await $`echo hello`.blob();
       * console.log(output); // Blob { size: 6, type: "" }
       * ```
       */
      blob(): Promise<Blob>;

      /**
       * Configure the shell to not throw an exception on non-zero exit codes. Throwing can be re-enabled with `.throws(true)`.
       *
       * By default, the shell with throw an exception on commands which return non-zero exit codes.
       */
      nothrow(): this;

      /**
       * Configure whether or not the shell should throw an exception on non-zero exit codes.
       *
       * By default, this is configured to `true`.
       */
      throws(shouldThrow: boolean): this;
    }

    /**
     * ShellError represents an error that occurred while executing a shell command with [the Bun Shell](https://bun.sh/docs/runtime/shell).
     *
     * @example
     * ```ts
     * try {
     *   const result = await $`exit 1`;
     * } catch (error) {
     *   if (error instanceof ShellError) {
     *     console.log(error.exitCode); // 1
     *   }
     * }
     * ```
     */
    class ShellError extends Error implements ShellOutput {
      readonly stdout: Buffer;
      readonly stderr: Buffer;
      readonly exitCode: number;

      /**
       * Read from stdout as a string
       *
       * @param encoding - The encoding to use when decoding the output
       * @returns Stdout as a string with the given encoding
       *
       * @example
       * **Read as UTF-8 string**
       * ```ts
       * const output = await $`echo hello`;
       * console.log(output.text()); // "hello\n"
       * ```
       *
       * **Read as base64 string**
       * ```ts
       * const output = await $`echo ${atob("hello")}`;
       * console.log(output.text("base64")); // "hello\n"
       * ```
       */
      text(encoding?: BufferEncoding): string;

      /**
       * Read from stdout as a JSON object
       *
       * @returns Stdout as a JSON object
       * @example
       *
       * ```ts
       * const output = await $`echo '{"hello": 123}'`;
       * console.log(output.json()); // { hello: 123 }
       * ```
       *
       */
      json(): any;

      /**
       * Read from stdout as an ArrayBuffer
       *
       * @returns Stdout as an ArrayBuffer
       * @example
       *
       * ```ts
       * const output = await $`echo hello`;
       * console.log(output.arrayBuffer()); // ArrayBuffer { byteLength: 6 }
       * ```
       */
      arrayBuffer(): ArrayBuffer;

      /**
       * Read from stdout as a Blob
       *
       * @returns Stdout as a blob
       * @example
       * ```ts
       * const output = await $`echo hello`;
       * console.log(output.blob()); // Blob { size: 6, type: "" }
       * ```
       */
      blob(): Blob;

      /**
       * Read from stdout as an Uint8Array
       *
       * @returns Stdout as an Uint8Array
       * @example
       *```ts
       * const output = await $`echo hello`;
       * console.log(output.bytes()); // Uint8Array { byteLength: 6 }
       * ```
       */
      bytes(): Uint8Array;
    }

    interface ShellOutput {
      readonly stdout: Buffer;
      readonly stderr: Buffer;
      readonly exitCode: number;

      /**
       * Read from stdout as a string
       *
       * @param encoding - The encoding to use when decoding the output
       * @returns Stdout as a string with the given encoding
       *
       * @example
       * **Read as UTF-8 string**
       * ```ts
       * const output = await $`echo hello`;
       * console.log(output.text()); // "hello\n"
       * ```
       *
       * **Read as base64 string**
       * ```ts
       * const output = await $`echo ${atob("hello")}`;
       * console.log(output.text("base64")); // "hello\n"
       * ```
       */
      text(encoding?: BufferEncoding): string;

      /**
       * Read from stdout as a JSON object
       *
       * @returns Stdout as a JSON object
       * @example
       *
       * ```ts
       * const output = await $`echo '{"hello": 123}'`;
       * console.log(output.json()); // { hello: 123 }
       * ```
       *
       */
      json(): any;

      /**
       * Read from stdout as an ArrayBuffer
       *
       * @returns Stdout as an ArrayBuffer
       * @example
       *
       * ```ts
       * const output = await $`echo hello`;
       * console.log(output.arrayBuffer()); // ArrayBuffer { byteLength: 6 }
       * ```
       */
      arrayBuffer(): ArrayBuffer;

      /**
       * Read from stdout as an Uint8Array
       *
       * @returns Stdout as an Uint8Array
       * @example
       *
       * ```ts
       * const output = await $`echo hello`;
       * console.log(output.bytes()); // Uint8Array { byteLength: 6 }
       * ```
       */
      bytes(): Uint8Array;

      /**
       * Read from stdout as a Blob
       *
       * @returns Stdout as a blob
       * @example
       * ```ts
       * const output = await $`echo hello`;
       * console.log(output.blob()); // Blob { size: 6, type: "" }
       * ```
       */
      blob(): Blob;
    }

    const Shell: new () => $;
  }
}

declare module "bun" {
  export namespace __experimental {
    /**
     * Base interface for static site generation route parameters.
     *
     * Supports both single string values and arrays of strings for dynamic route segments.
     * This is typically used for route parameters like `[slug]`, `[...rest]`, or `[id]`.
     *
     * @warning These APIs are experimental and might be moved/changed in future releases.
     *
     * @example
     * ```tsx
     * // Simple slug parameter
     * type BlogParams = { slug: string };
     *
     * // Multiple parameters
     * type ProductParams = {
     *   category: string;
     *   id: string;
     * };
     *
     * // Catch-all routes with string arrays
     * type DocsParams = {
     *   path: string[];
     * };
     * ```
     */
    export interface SSGParamsLike {
      [key: string]: string | string[];
    }

    /**
     * Configuration object for a single static route to be generated.
     *
     * Each path object contains the parameters needed to render a specific
     * instance of a dynamic route at build time.
     *
     * @warning These APIs are experimental and might be moved/changed in future releases.
     *
     * @template Params - The shape of route parameters for this path
     *
     * @example
     * ```tsx
     * // Single blog post path
     * const blogPath: SSGPath<{ slug: string }> = {
     *   params: { slug: "my-first-post" }
     * };
     *
     * // Product page with multiple params
     * const productPath: SSGPath<{ category: string; id: string }> = {
     *   params: {
     *     category: "electronics",
     *     id: "laptop-123"
     *   }
     * };
     *
     * // Documentation with catch-all route
     * const docsPath: SSGPath<{ path: string[] }> = {
     *   params: { path: ["getting-started", "installation"] }
     * };
     * ```
     */
    export interface SSGPath<Params extends SSGParamsLike = SSGParamsLike> {
      params: Params;
    }

    /**
     * Array of static paths to be generated at build time.
     *
     * This type represents the collection of all route configurations
     * that should be pre-rendered for a dynamic route.
     *
     * @warning These APIs are experimental and might be moved/changed in future releases.
     *
     * @template Params - The shape of route parameters for these paths
     *
     * @example
     * ```tsx
     * // Array of blog post paths
     * const blogPaths: SSGPaths<{ slug: string }> = [
     *   { params: { slug: "introduction-to-bun" } },
     *   { params: { slug: "performance-benchmarks" } },
     *   { params: { slug: "getting-started-guide" } }
     * ];
     *
     * // Mixed parameter types
     * const productPaths: SSGPaths<{ category: string; id: string }> = [
     *   { params: { category: "books", id: "javascript-guide" } },
     *   { params: { category: "electronics", id: "smartphone-x" } }
     * ];
     * ```
     */
    export type SSGPaths<Params extends SSGParamsLike = SSGParamsLike> = SSGPath<Params>[];

    /**
     * Props interface for SSG page components.
     *
     * This interface defines the shape of props that will be passed to your
     * static page components during the build process. The `params` object
     * contains the route parameters extracted from the URL pattern.
     *
     * @warning These APIs are experimental and might be moved/changed in future releases.
     *
     * @template Params - The shape of route parameters for this page
     *
     * @example
     * ```tsx
     * // Blog post component props
     * interface BlogPageProps extends SSGPageProps<{ slug: string }> {
     *   // params: { slug: string } is automatically included
     * }
     *
     * // Product page component props
     * interface ProductPageProps extends SSGPageProps<{
     *   category: string;
     *   id: string;
     * }> {
     *   // params: { category: string; id: string } is automatically included
     * }
     *
     * // Usage in component
     * function BlogPost({ params }: BlogPageProps) {
     *   const { slug } = params; // TypeScript knows slug is a string
     *   return <h1>Blog post: {slug}</h1>;
     * }
     * ```
     */
    export interface SSGPageProps<Params extends SSGParamsLike = SSGParamsLike> {
      params: Params;
    }

    /**
     * React component type for SSG pages that can be statically generated.
     *
     * This type represents a React component that receives SSG page props
     * and can be rendered at build time. The component can be either a regular
     * React component or an async React Server Component for advanced use cases
     * like data fetching during static generation.
     *
     * @warning These APIs are experimental and might be moved/changed in future releases.
     *
     * @template Params - The shape of route parameters for this page component
     *
     * @example
     * ```tsx
     * // Regular synchronous SSG page component
     * const BlogPost: SSGPage<{ slug: string }> = ({ params }) => {
     *   return (
     *     <article>
     *       <h1>Blog Post: {params.slug}</h1>
     *       <p>This content was generated at build time!</p>
     *     </article>
     *   );
     * };
     *
     * // Async React Server Component for data fetching
     * const AsyncBlogPost: SSGPage<{ slug: string }> = async ({ params }) => {
     *   // Fetch data during static generation
     *   const post = await fetchBlogPost(params.slug);
     *   const author = await fetchAuthor(post.authorId);
     *
     *   return (
     *     <article>
     *       <h1>{post.title}</h1>
     *       <p>By {author.name}</p>
     *       <div dangerouslySetInnerHTML={{ __html: post.content }} />
     *     </article>
     *   );
     * };
     *
     * // Product page with multiple params and async data fetching
     * const ProductPage: SSGPage<{ category: string; id: string }> = async ({ params }) => {
     *   const [product, reviews] = await Promise.all([
     *     fetchProduct(params.category, params.id),
     *     fetchProductReviews(params.id)
     *   ]);
     *
     *   return (
     *     <div>
     *       <h1>{product.name}</h1>
     *       <p>Category: {params.category}</p>
     *       <p>Price: ${product.price}</p>
     *       <div>
     *         <h2>Reviews ({reviews.length})</h2>
     *         {reviews.map(review => (
     *           <div key={review.id}>{review.comment}</div>
     *         ))}
     *       </div>
     *     </div>
     *   );
     * };
     * ```
     */
    export type SSGPage<Params extends SSGParamsLike = SSGParamsLike> = React.ComponentType<SSGPageProps<Params>>;

    /**
     * getStaticPaths is Bun's implementation of SSG (Static Site Generation) path determination.
     *
     * This function is called at your app's build time to determine which
     * dynamic routes should be pre-rendered as static pages. It returns an
     * array of path parameters that will be used to generate static pages for
     * dynamic routes (e.g., [slug].tsx, [category]/[id].tsx).
     *
     * The function can be either synchronous or asynchronous, allowing you to
     * fetch data from APIs, databases, or file systems to determine which paths
     * should be statically generated.
     *
     * @warning These APIs are experimental and might be moved/changed in future releases.
     *
     * @template Params - The shape of route parameters for the dynamic route
     *
     * @returns An object containing an array of paths to be statically generated
     *
     * @example
     * ```tsx
     * // In pages/blog/[slug].tsx ———————————————————╮
     * export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
     *   // Fetch all blog posts from your CMS or API at build time
     *   const posts = await fetchBlogPosts();
     *
     *   return {
     *     paths: posts.map((post) => ({
     *       params: { slug: post.slug }
     *     }))
     *   };
     * };
     *
     * // In pages/products/[category]/[id].tsx
     * export const getStaticPaths: GetStaticPaths<{
     *   category: string;
     *   id: string;
     * }> = async () => {
     *   // Fetch products from database
     *   const products = await db.products.findMany({
     *     select: { id: true, category: { slug: true } }
     *   });
     *
     *   return {
     *     paths: products.map(product => ({
     *       params: {
     *         category: product.category.slug,
     *         id: product.id
     *       }
     *     }))
     *   };
     * };
     *
     * // In pages/docs/[...path].tsx (catch-all route)
     * export const getStaticPaths: GetStaticPaths<{ path: string[] }> = async () => {
     *   // Read documentation structure from file system
     *   const docPaths = await getDocumentationPaths('./content/docs');
     *
     *   return {
     *     paths: docPaths.map(docPath => ({
     *       params: { path: docPath.split('/') }
     *     }))
     *   };
     * };
     *
     * // Synchronous example with static data
     * export const getStaticPaths: GetStaticPaths<{ id: string }> = () => {
     *   const staticIds = ['1', '2', '3', '4', '5'];
     *
     *   return {
     *     paths: staticIds.map(id => ({
     *       params: { id }
     *     }))
     *   };
     * };
     * ```
     */
    export type GetStaticPaths<Params extends SSGParamsLike = SSGParamsLike> = () => MaybePromise<{
      paths: SSGPaths<Params>;
    }>;
  }
}

import * as BunModule from "bun";

declare global {
  export import Bun = BunModule;
}

export {};
