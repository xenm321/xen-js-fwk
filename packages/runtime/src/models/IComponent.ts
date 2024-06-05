import { NodeElType, VNode } from './vNode';

export interface IComponent<Props = Readonly<any>> {
  offset: number;

  elements: NodeElType[];

  firstElement: Nullable<NodeElType>;

  mount(hostEl: HTMLElement, index: Nullable<number>): void;

  unmount(): void;

  updateProps(props: Readonly<Props>): void;

  onMounted: () => Promise<any>;

  onUnmounted: () => Promise<any>;

  setExternalContent(nodes: VNode[]): void;
}
