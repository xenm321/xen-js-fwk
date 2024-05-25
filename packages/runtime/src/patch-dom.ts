import { DomTypes, NodeElType, VNode } from './models/vNode';
import { areNodesEqual } from './nodes-equal';
import { destroyDOM } from './destroy-dom';
import { mountDOM } from './mount-dom';
import { extractChildren } from './h';
import {
  removeAttribute,
  removeStyle,
  setAttribute,
  setStyle
} from './attributes';
import { objectsDiff } from './utils/objects';
import { arraysDiff, arraysDiffSequence } from './utils/arrays';
import {
  ArrayDiffOperation,
  ArrayDiffOperationType
} from './utils/ArrayWithOriginalIndices';
import { isNotBlankOrEmptyString } from './utils/strings';
import { addEventListener } from './events';

export const patchDOM = (
  oldVdom: VNode,
  newVdom: VNode,
  parentEl: HTMLElement
): VNode => {
  if (!areNodesEqual(oldVdom, newVdom)) {
    const index = findIndexInParent(parentEl, oldVdom.el);

    destroyDOM(oldVdom);
    mountDOM(newVdom, parentEl, index);

    return newVdom;
  }

  newVdom.el = oldVdom.el;

  switch (newVdom.type) {
    case DomTypes.TEXT: {
      patchText(oldVdom, newVdom);
      return newVdom;
    }

    case DomTypes.ELEMENT: {
      patchElement(oldVdom, newVdom);
      break;
    }
  }

  patchChildren(oldVdom, newVdom);

  return newVdom;
};

function findIndexInParent(parentEl: HTMLElement, el: NodeElType): number {
  const index = Array.from(parentEl.childNodes).indexOf(el);
  if (index < 0) {
    return null;
  }
  return index;
}

function patchText(oldVdom: VNode, newVdom: VNode): void {
  const el = oldVdom.el;
  const { value: oldText } = oldVdom;
  const { value: newText } = newVdom;

  if (oldText !== newText) {
    el.nodeValue = newText;
  }
}

function patchElement(oldVdom: VNode, newVdom: VNode): void {
  const el = oldVdom.el;

  const {
    class: oldClass,
    style: oldStyle,
    on: oldEvents,
    ...oldAttrs
  } = oldVdom.props;

  const {
    class: newClass,
    style: newStyle,
    on: newEvents,
    ...newAttrs
  } = newVdom.props;

  const { listeners: oldListeners } = oldVdom;

  // NOTE: нужно проверить работу instanceof
  if (el instanceof HTMLElement) {
    patchAttrs(el, oldAttrs, newAttrs);
    // NOTE: уточнить тип oldClass и newClass
    patchClasses(
      el,
      oldClass as string[] | string,
      newClass as string[] | string
    );
    patchStyles(el, oldStyle, newStyle);

    newVdom.listeners = patchEvents(el, oldListeners, oldEvents, newEvents);
  }
}

// NOTE: вывести типы
function patchAttrs(el: HTMLElement, oldAttrs, newAttrs): void {
  const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);

  for (const attr of removed) {
    removeAttribute(el, attr);
  }

  for (const attr of added.concat(updated)) {
    setAttribute(el, attr, newAttrs[attr]);
  }
}

function patchClasses(
  el: HTMLElement,
  oldClass: string[] | string,
  newClass: string[] | string
): void {
  const oldClasses = toClassList(oldClass);
  const newClasses = toClassList(newClass);
  const { added, removed } = arraysDiff<string>(oldClasses, newClasses);
  if (removed.length > 0) {
    el.classList.remove(...removed);
  }
  if (added.length > 0) {
    el.classList.add(...added);
  }
}

function toClassList(classes: string[] | string = ''): string[] {
  return Array.isArray(classes)
    ? classes.filter(isNotBlankOrEmptyString)
    : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString);
}

function patchStyles(el: HTMLElement, oldStyle = {}, newStyle = {}) {
  const { added, removed, updated } = objectsDiff(oldStyle, newStyle);

  for (const style of removed) {
    removeStyle(el, style);
  }

  for (const style of added.concat(updated)) {
    setStyle(el, style, newStyle[style]);
  }
}

function patchEvents(
  el: HTMLElement,
  oldListeners = {},
  oldEvents = {},
  newEvents = {}
) {
  const { removed, added, updated } = objectsDiff(oldEvents, newEvents);

  for (const eventName of removed.concat(updated)) {
    el.removeEventListener(eventName, oldListeners[eventName]);
  }

  const addedListeners = {};
  for (const eventName of added.concat(updated)) {
    addedListeners[eventName] = addEventListener(
      eventName,
      newEvents[eventName],
      el
    );
  }
  return addedListeners;
}

// NOTE: разобраться с типизацией
function patchChildren(oldVdom: VNode, newVdom: VNode): void {
  const oldChildren = extractChildren(oldVdom);

  const newChildren = extractChildren(newVdom);
  const parentEl = oldVdom.el;

  const diffSeq = arraysDiffSequence(
    oldChildren,
    newChildren,
    areNodesEqual
  ) as ArrayDiffOperation[];

  for (const operation of diffSeq) {
    const { originalIndex, index, item } = operation;
    switch (operation.op) {
      case ArrayDiffOperationType.ADD: {
        mountDOM(item as VNode, parentEl as HTMLElement, index);
        break;
      }
      case ArrayDiffOperationType.REMOVE: {
        destroyDOM(item as VNode);
        break;
      }
      case ArrayDiffOperationType.MOVE: {
        const oldChild = oldChildren[originalIndex];
        const newChild = newChildren[index];
        const el = oldChild.el;
        const elAtTargetIndex = parentEl.childNodes[index];

        parentEl.insertBefore(el, elAtTargetIndex);
        patchDOM(oldChild, newChild, parentEl as HTMLElement);
        break;
      }
      case ArrayDiffOperationType.NOOP: {
        patchDOM(
          oldChildren[originalIndex],
          newChildren[index],
          parentEl as HTMLElement
        );
        break;
      }
    }
  }
}
