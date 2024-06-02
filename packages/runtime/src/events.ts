import { EventHandlers } from './models/vNode';
import { IComponent } from './models/IComponent';

export function addEventListener(
  eventName: string,
  handler: AnyFunction,
  el: HTMLElement,
  hostComponent: Nullable<IComponent> = null
): AnyFunction {
  function boundHandler(...args: any[]): any {
    hostComponent ? handler.apply(hostComponent, args) : handler(args);
  }

  el.addEventListener(eventName, boundHandler);

  return boundHandler;
}

export function addEventListeners(
  listeners: EventHandlers,
  el: HTMLElement,
  hostComponent: Nullable<IComponent> = null
): EventHandlers {
  const addedListeners: EventHandlers = {};

  Object.entries(listeners).forEach(([eventName, handler]) => {
    addedListeners[eventName] = addEventListener(
      eventName,
      handler,
      el,
      hostComponent
    );
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
