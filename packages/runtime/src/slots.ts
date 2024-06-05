import { hFragment } from './h';
import { traverseDFS } from './traverse-dom';
import { DomTypes, VNode } from './models/vNode';

export function fillSlots(vDom: VNode, externalContent: VNode[] = []): void {
  function processNode(node: VNode, parent: VNode, index: number): void {
    insertViewInSlot(node, parent, index, externalContent);
  }

  traverseDFS(vDom, processNode, shouldSkipBranch);
}

function insertViewInSlot(
  node: VNode,
  parent: VNode,
  index: number,
  externalContent: VNode[]
): void {
  if (node.type !== DomTypes.SLOT) return;

  const defaultContent = node.children;
  const views = externalContent.length > 0 ? externalContent : defaultContent;

  const hasContent = views.length > 0;
  if (hasContent) {
    parent.children.splice(index, 1, hFragment(views));
  } else {
    parent.children.splice(index, 1);
  }
}

function shouldSkipBranch(node: VNode): boolean {
  return node.type === DomTypes.COMPONENT;
}
