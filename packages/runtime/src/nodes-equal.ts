import { DomTypes, VNode } from './models/vNode';

export function areNodesEqual(nodeOne: VNode, nodeTwo: VNode): boolean {
  if (nodeOne.type !== nodeTwo.type) {
    return false;
  }

  if (nodeOne.type === DomTypes.ELEMENT) {
    const {
      tag: tagOne,
      props: { key: keyOne }
    } = nodeOne;
    const {
      tag: tagTwo,
      props: { key: keyTwo }
    } = nodeTwo;
    return tagOne === tagTwo && keyOne === keyTwo;
  }

  if (nodeOne.type === DomTypes.COMPONENT) {
    const {
      tag: componentOne,
      props: { key: keyOne }
    } = nodeOne;
    const {
      tag: componentTwo,
      props: { key: keyTwo }
    } = nodeTwo;
    return componentOne === componentTwo && keyOne === keyTwo;
  }

  return true;
}
