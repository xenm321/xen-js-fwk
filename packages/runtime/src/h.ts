import { withoutNulls } from './utils/arrays';
import { DomTypes, Props, VNode } from './models/vNode';
import { IComponent } from './models/IComponent';

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
  tag: string | IComponent,
  props: Props = {},
  children: VNode[] | string[] = []
): VNode {
  const type: DomTypes =
    typeof tag === 'string' ? DomTypes.ELEMENT : DomTypes.COMPONENT;

  return {
    tag,
    props,
    type,
    children: mapTextNodes(withoutNulls(children))
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
