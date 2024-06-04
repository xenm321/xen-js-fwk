import { DomTypes, Props, VNode } from './models/vNode';
import { setAttributes } from './attributes';
import { addEventListeners } from './events';
import { Attr } from './models/attr';
import { isEmpty } from './utils/objects';
import { ComponentConstructor, IComponent } from './models/IComponent';
import { extractPropsAndEvents } from './utils/props';

export function mountDOM(
  vDom: VNode,
  parentEl: HTMLElement,
  index: Nullable<number> = null,
  hostComponent: Nullable<IComponent> = null
): void {
  switch (vDom.type) {
    case DomTypes.TEXT:
      createTextNode(vDom, parentEl, index);
      break;

    case DomTypes.ELEMENT:
      createElementNode(vDom, parentEl, index, hostComponent);
      break;

    case DomTypes.FRAGMENT:
      createFragmentNodes(vDom, parentEl, index, hostComponent);
      break;

    case DomTypes.COMPONENT:
      createComponentNode(vDom, parentEl, index, hostComponent);
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
  index: Nullable<number>,
  hostComponent: Nullable<IComponent> = null
): void {
  const { children } = vDom;
  vDom.el = parentEl;

  for (const child of children) {
    mountDOM(child, parentEl, index, hostComponent);

    if (index == null) {
      continue;
    }

    switch (child.type) {
      case DomTypes.FRAGMENT:
        index += child.children.length;
        break;
      default:
        index++;
    }
  }
}

function addProps(
  el: HTMLElement,
  props: Props,
  vDom: VNode,
  hostComponent: Nullable<IComponent> = null
): void {
  const { on: events, ...attrs } = props;

  if (!isEmpty(events)) {
    vDom.listeners = addEventListeners(events, el, hostComponent);
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
  index: Nullable<number>,
  hostComponent: Nullable<IComponent> = null
): void {
  const { tag, props, children } = vDom;

  const element = document.createElement(tag as string);
  if (!isEmpty(props)) {
    addProps(element, props, vDom, hostComponent);
  }
  vDom.el = element;

  children.forEach((child) => mountDOM(child, element, null, hostComponent));
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

function createComponentNode(
  vDom: VNode,
  parentEl: HTMLElement,
  index: Nullable<number>,
  hostComponent: Nullable<IComponent> = null
): void {
  const Component = vDom.tag as ComponentConstructor;

  const { props, events } = extractPropsAndEvents(vDom);
  const component = new Component(props, events, hostComponent);

  component.mount(parentEl, index);
  vDom.component = component;
  vDom.el = component.firstElement;
}
