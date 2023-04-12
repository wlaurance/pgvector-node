interface PgType {
    typname: string;
    oid: number;
    typarray: number;
}
interface PgResult {
    rowCount: number;
    rows: PgType[];
}
interface PgClient {
    query: (query: string, values: any[]) => Promise<PgResult>;
    setTypeParser: (oid: number, format: string, parseFn: (value: string) => number[]) => void;
}
declare function registerType(client: PgClient): Promise<void>;
declare function toSql(value: number[]): string;
export { registerType, toSql };
