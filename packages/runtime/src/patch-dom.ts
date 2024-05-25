import { DomTypes, VNode } from './models/vNode';

export const patchDOM = (
  vdom: VNode,
  newVdom: VNode,
  parentEl: HTMLElement
): VNode => {
  // TODO
  console.log(vdom, newVdom, parentEl);
  return { type: DomTypes.ELEMENT };
};
