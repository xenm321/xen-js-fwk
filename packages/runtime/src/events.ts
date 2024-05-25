import { EventHandlers } from './models/vNode';

export function addEventListener(
  eventName: string,
  handler: AnyFunction,
  el: HTMLElement
): AnyFunction {
  el.addEventListener(eventName, handler);
  return handler;
}

export function addEventListeners(
  listeners: EventHandlers,
  el: HTMLElement
): EventHandlers {
  const addedListeners: EventHandlers = {};

  Object.entries(listeners).forEach(([eventName, handler]) => {
    addedListeners[eventName] = addEventListener(eventName, handler, el);
  });

  return addedListeners;
}

export function removeEventListeners(
  listeners: EventHandlers,
  el: HTMLElement | Text
): void {
  Object.entries(listeners).forEach(([eventName, handler]) => {
    el.removeEventListener(eventName, handler);
  });
}
