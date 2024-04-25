export declare function select<T extends string>(message: string, options: T[] | {
    value: T;
    label: string;
}[]): Promise<T>;
export declare function autoselect<T extends string>(message: string, options: T[], flag: string): Promise<T>;
export declare function getPassword(message: string): Promise<string>;
type HandleAskResponse = 'required' | 'use_default' | ((answer: string | undefined) => Promise<string>);
export declare function ask(q: string, defaultAnswer?: string, handle?: HandleAskResponse): Promise<string>;
export {};
