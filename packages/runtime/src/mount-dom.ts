import { DomTypes, Props, VNode } from './models/vNode';
import { setAttributes } from './attributes';
import { addEventListeners } from './events';
import { Attr } from './models/attr';
import { isEmpty } from './utils/objects';

export function mountDOM(
  vDom: VNode,
  parentEl: HTMLElement,
  index: Nullable<number> = null
): void {
  switch (vDom.type) {
    case DomTypes.TEXT:
      createTextNode(vDom, parentEl, index);
      break;

    case DomTypes.ELEMENT:
      createElementNode(vDom, parentEl, index);
      break;

    case DomTypes.FRAGMENT:
      createFragmentNodes(vDom, parentEl, index);
      break;

    default: {
      throw new Error(`Can't mount DOM of type: ${vDom.type}`);
    }
  }
}

function createTextNode(
  vDom: VNode,
  parentEl: HTMLElement,
  index: Nullable<number>
): void {
  const { value } = vDom;

  const textNode = document.createTextNode(value);
  vDom.el = textNode;
  insert(textNode, parentEl, index);
}

function createFragmentNodes(
  vDom: VNode,
  parentEl: HTMLElement,
  index: Nullable<number>
): void {
  const { children } = vDom;

  vDom.el = parentEl;
  children.forEach((child, i) =>
    mountDOM(child, parentEl, index ? index + i : null)
  );
}

function addProps(el: HTMLElement, props: Props, vDom: VNode) {
  const { on: events, ...attrs } = props;

  if (!isEmpty(events)) {
    vDom.listeners = addEventListeners(events, el);
  }

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

function createElementNode(
  vDom: VNode,
  parentEl: HTMLElement,
  index: Nullable<number>
): void {
  const { tag, props, children } = vDom;

  const element = document.createElement(tag);
  if (!isEmpty(props)) {
    addProps(element, props, vDom);
  }
  vDom.el = element;

  children.forEach((child, i) =>
    mountDOM(child, element, index ? index + i : null)
  );
  insert(element, parentEl, index);
}

function insert(
  el: HTMLElement | Text,
  parentEl: HTMLElement,
  index: Nullable<number>
): void {
  if (index === null) {
    parentEl.append(el);
    return;
  }

  if (index < 0) {
    throw new Error(`Index must be a positive integer, got ${index}`);
  }

  const children = parentEl.childNodes;
  if (index >= children.length) {
    parentEl.append(el);
  } else {
    parentEl.insertBefore(el, children[index]);
  }
}
