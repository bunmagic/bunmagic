export declare function readFirstComment(view: Uint8Array): string;
declare function parseFile(filePath: string): Promise<Properties | undefined>;
type Meta = {
    name: string;
    description: string;
};
type Properties = {
    name: string;
    description: string;
    usage: Meta;
    meta: Record<string, Meta[]>;
    source: string;
    slug: string;
    alias: string[];
    autohelp: boolean;
};
declare function parseContent(contents: string): Promise<Properties>;
export declare const parseHeader: {
    fromFile: typeof parseFile;
    fromContent: typeof parseContent;
};
export {};
