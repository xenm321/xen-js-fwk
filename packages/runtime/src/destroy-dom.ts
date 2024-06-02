import { DomTypes, VNode } from './models/vNode';
import { removeEventListeners } from './events';

export function destroyDOM(vDom: VNode): void {
  const { type } = vDom;
  switch (type) {
    case DomTypes.TEXT:
      removeTextNode(vDom);
      break;
    case DomTypes.ELEMENT:
      removeElementNode(vDom);
      break;
    case DomTypes.FRAGMENT:
      removeFragmentNodes(vDom);
      break;

    case DomTypes.COMPONENT: {
      vDom.component.unmount();
      break;
    }

    default: {
      throw new Error(`Can't destroy DOM of type: ${type}`);
    }
  }
}

function removeTextNode(vDom: VNode): void {
  const { el } = vDom;
  el.remove();
}

function removeElementNode(vDom: VNode) {
  const { el, children, listeners } = vDom;
  el.remove();
  children.forEach(destroyDOM);
  if (listeners) {
    removeEventListeners(listeners, el);
    delete vDom.listeners;
  }
}

function removeFragmentNodes(vDom: VNode): void {
  const { children } = vDom;
  children.forEach(destroyDOM);
}
