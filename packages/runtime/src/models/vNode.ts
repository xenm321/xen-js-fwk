export enum DomTypes {
  TEXT = 'text',
  ELEMENT = 'element',
  FRAGMENT = 'fragment',
}

export type EventHandlers = Record<string, AnyFunction>;

type PropValue = string | number | EventHandlers;

export type Props = {
  [k: string]: PropValue;
  on?: EventHandlers;
};

export interface VNode {
  type: DomTypes;
  tag?: string;
  value?: string;
  props?: Props;
  el?: HTMLElement | Text | null;
  listeners?: EventHandlers;
  children?: VNode[];
}
