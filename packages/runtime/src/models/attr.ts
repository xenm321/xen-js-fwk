export type TClassName = string | string[];

export type Attr = {
  [k: string]: string;
  class?: string;
  style?: string;
};

export type SimpleAttr = { [k: string]: string };
