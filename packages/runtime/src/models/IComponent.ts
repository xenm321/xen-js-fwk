import { EventHandlers, NodeElType } from './vNode';

export type ComponentConstructor = new (
  props: Readonly<any>,
  eventHandlers: Nullable<EventHandlers>,
  parentComponent: Nullable<IComponent>
) => IComponent<Readonly<any>>;

export interface IComponent<Props = any> {
  offset: number;

  elements: NodeElType[];

  firstElement: Nullable<NodeElType>;

  mount(hostEl: HTMLElement, index: Nullable<number>): void;

  unmount(): void;

  updateProps(props: Readonly<Props>): void;
}
