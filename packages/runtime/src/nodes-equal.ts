import { DomTypes, VNode } from './models/vNode';

export function areNodesEqual(nodeOne: VNode, nodeTwo: VNode): boolean {
  if (nodeOne.type !== nodeTwo.type) {
    return false;
  }

  if (nodeOne.type === DomTypes.ELEMENT) {
    const { tag: tagOne } = nodeOne;
    const { tag: tagTwo } = nodeTwo;
    return tagOne === tagTwo;
  }

  return true;
}
