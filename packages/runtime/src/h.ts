import { withoutNulls } from './utils/arrays';
import { DomTypes, Props, VNode } from './models/vNode';

function mapTextNodes(children: VNode[] | string[]): VNode[] {
  return children.map((child: VNode | string) =>
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

export function extractChildren(vdom: VNode, children: VNode[] = []): VNode[] {
  if (vdom.children == null) {
    return [];
  }

  for (const child of vdom.children) {
    if (child.type === DomTypes.FRAGMENT) {
      children.push(...extractChildren(child, children));
    } else {
      children.push(child);
    }
  }

  return children;
}
