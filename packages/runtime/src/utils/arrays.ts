export function withoutNulls(arr: any[]): any[] {
  return arr.filter((item) => item != null);
}
