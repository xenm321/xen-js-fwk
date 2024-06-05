import { IComponent } from './IComponent';

export enum DomTypes {
  TEXT = 'text',
  ELEMENT = 'element',
  FRAGMENT = 'fragment',
  COMPONENT = 'component'
}

export type EventHandlers = Record<string, AnyFunction>;

type PropValue = string | number | EventHandlers;

export type NodeElType = HTMLElement | Text | null;

export type Props = {
  [k: string]: PropValue;
  on?: EventHandlers;
};

export interface VNode {
  type: DomTypes;
  tag?: string | Class<IComponent>;
  value?: string;
  props?: Props;
  el?: NodeElType;
  listeners?: EventHandlers;
  children?: VNode[];
  component?: IComponent;
}
