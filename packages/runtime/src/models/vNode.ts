export enum DomTypes {
  TEXT = 'text',
  ELEMENT = 'element',
  FRAGMENT = 'fragment',
}

type EventHandlers = Record<string, () => void>;

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
  children?: VNode[];
}