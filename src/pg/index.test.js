const { Client } = require('pg');
const pgvector = require('./index');

const client = new Client({database: 'pgvector_node_test'});

beforeAll(async () => {
  await client.connect();
  const sql = `
  CREATE EXTENSION IF NOT EXISTS vector;
  DROP TABLE IF EXISTS items;
  CREATE TABLE IF NOT EXISTS items (
    id serial primary key,
    embedding vector(3)
  );
  `;
  await client.query(sql);
  await pgvector.registerType(client);
});

afterAll(async () => {
  await client.end();
});

beforeEach(async () => {
  await client.query('DELETE FROM items');
});

test('works', async () => {
  await client.query('INSERT INTO items (embedding) VALUES ($1)', [pgvector.toSql([1, 2, 3])]);
  const { rows } = await client.query('SELECT * FROM items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql([1, 2, 3])]);
  expect(rows[0].embedding).toStrictEqual([1, 2, 3]);
});

test('bad object', () => {
  expect(() => {
    pgvector.toSql({hello: 'world'});
  }).toThrowError('expected array');
});
