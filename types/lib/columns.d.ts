type ColumnConfig = 'auto' | '' | number | `${number}%`;
export declare class Columns<T extends number, Row extends string | string[]> {
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
    private nearestWrap;
    private calculateColumnWidths;
    private fitWidths;
    private renderRow;
    private getColumnWidths;
}
export {};
