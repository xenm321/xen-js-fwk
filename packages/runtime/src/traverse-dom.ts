import { VNode } from './models/vNode';

export function traverseDFS(
  vDom: VNode,
  processNode: (vDom: VNode, parentNode: VNode, index: number) => void,
  shouldSkipBranch: (vDom?: VNode) => boolean = (): boolean => false,
  parentNode: Nullable<VNode> = null,
  index: Nullable<number> = null
): void {
  if (shouldSkipBranch(vDom)) return;

  processNode(vDom, parentNode, index);

  if (vDom.children) {
    vDom.children.forEach((child, i) =>
      traverseDFS(child, processNode, shouldSkipBranch, vDom, i)
    );
  }
}
