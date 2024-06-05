type AnyFunction = (...args: any[]) => any;
type Nullable<T> = T | null;
type Class<T, Arguments extends unknown[] = any[]> = {
  prototype: Pick<T, keyof T>;
  new (...arguments_: Arguments): T;
};
