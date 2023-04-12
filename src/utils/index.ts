export function fromSql(value: string): number[] {
  return value.substring(1, value.length - 1).split(',').map((v) => parseFloat(v));
}

export function toSql(value: number[]): string {
  return JSON.stringify(value);
}
