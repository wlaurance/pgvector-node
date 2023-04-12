import * as utils from '../utils';

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

async function registerType(client: PgClient): Promise<void> {
  const result = await client.query('SELECT typname, oid, typarray FROM pg_type WHERE typname = $1', ['vector']);
  if (result.rowCount < 1) {
    throw new Error('vector type not found in the database');
  }
  const oid = result.rows[0].oid;
  client.setTypeParser(oid, 'text', function(value) {
    return utils.fromSql(value);
  });
}

function toSql(value: number[]): string {
  if (!Array.isArray(value)) {
    throw new Error('expected array');
  }
  return utils.toSql(value);
}

export { registerType, toSql };
