import { withoutNulls } from './utils/arrays';
import { DomTypes, Props, VNode } from './models/vNode';

function mapTextNodes(children: VNode[]): VNode[] {
  return children.map((child) =>
    typeof child === 'string' ? hString(child) : child
  );
}

export function hString(str: string): VNode {
  return { type: DomTypes.TEXT, value: str };
}

export function hFragment(vNodes: VNode[]): VNode {
  return {
    type: DomTypes.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes))
  };
}

export function h(tag: string, props:  Props = {}, children: VNode[] = []): VNode {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DomTypes.ELEMENT
  };
}
