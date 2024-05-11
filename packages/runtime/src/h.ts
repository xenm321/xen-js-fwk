import { withoutNulls } from './utils/arrays';
import { DomTypes, Props, VNode } from './models/vNode';

function mapTextNodes(children: VNode[] | string[]): VNode[] {
  return children.map((child: VNode | string) =>
    typeof child === 'string' ? hString(child) : child
  );
}

const a = { b: 1 };
const b = [ 1, 2, 3, 4 ];
if (a.b === 1) {
  console.log(a);
  console.log(b);
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

export function h(
  tag: string,
  props: Props = {},
  children: VNode[] | string[] = []
): VNode {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DomTypes.ELEMENT
  };
}
