import { DomTypes, Props, VNode } from './models/vNode';
import { setAttributes } from './attributes';
import { addEventListeners } from './events';
import { Attr } from './models/attr';

export function mountDOM(vDom: VNode, parentEl: HTMLElement): void {
  switch (vDom.type) {
    case DomTypes.TEXT:
      createTextNode(vDom, parentEl);
      break;

    case DomTypes.ELEMENT:
      createElementNode(vDom, parentEl);
      break;

    case DomTypes.FRAGMENT:
      createFragmentNodes(vDom, parentEl);
      break;

    default: {
      throw new Error(`Can't mount DOM of type: ${vDom.type}`);
    }
  }
}

function createTextNode(vDom: VNode, parentEl: HTMLElement): void {
  const { value } = vDom;

  const textNode = document.createTextNode(value);
  vDom.el = textNode;
  parentEl.append(textNode);
}

function createFragmentNodes(vDom: VNode, parentEl: HTMLElement): void {
  const { children } = vDom;

  vDom.el = parentEl;
  children.forEach((child) => mountDOM(child, parentEl));
}

function addProps(el: HTMLElement, props: Props, vDom: VNode) {
  const { on: events, ...attrs } = props;

  vDom.listeners = addEventListeners(events, el);

  const convertedAttrs: Attr = {};
  for (const [name, value] of Object.entries(attrs)) {
    if (typeof value === 'string') {
      convertedAttrs[name] = value;
    } else if (typeof value === 'number') {
      convertedAttrs[name] = value.toString();
    }
  }
  setAttributes(el, convertedAttrs);
}

function createElementNode(vDom: VNode, parentEl: HTMLElement): void {
  const { tag, props, children } = vDom;

  const element = document.createElement(tag);
  addProps(element, props, vDom);
  vDom.el = element;

  children.forEach((child) => mountDOM(child, element));
  parentEl.append(element);
}
