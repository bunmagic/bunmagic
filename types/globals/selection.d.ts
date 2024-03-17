export declare function select<T extends string>(message: string, options: T[]): Promise<T>;
export declare function autoselect<T extends string>(message: string, options: T[], flag: string): Promise<T>;
export declare function getPassword(message: string): Promise<string>;
