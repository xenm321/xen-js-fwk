export function withoutNulls(arr: unknown[]): unknown[] {
  return arr.filter((item) => item != null);
}
