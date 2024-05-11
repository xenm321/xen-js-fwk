export enum DomTypes {
  TEXT = 'text',
  ELEMENT = 'element',
  FRAGMENT = 'fragment',
}

type EventHandlers = Record<string, () => void>;

export type Props = Record<string, string | number | EventHandlers>;

export interface VNode {
  type: DomTypes;
  tag?: string;
  value?: string;
  props?: Props;
  children?: VNode[];
}
