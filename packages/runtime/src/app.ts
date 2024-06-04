import { destroyDOM } from './destroy-dom';
import { mountDOM } from './mount-dom';
import { VNode } from './models/vNode';
import { h } from './h';
import { IComponent } from './models/IComponent';

export function createApp(RootComponent: IComponent, props = {}) {
  let parentEl: Nullable<HTMLElement> = null;
  let isMounted: boolean = false;
  let vdom: Nullable<VNode> = null;

  function reset() {
    parentEl = null;
    isMounted = false;
    vdom = null;
  }

  return {
    mount(_parentEl: HTMLElement): void {
      if (isMounted) {
        throw new Error('The application is already mounted');
      }

      parentEl = _parentEl;
      vdom = h(RootComponent, props);
      mountDOM(vdom, parentEl);

      isMounted = true;
    },

    unmount(): void {
      if (!isMounted) {
        throw new Error('The application is not mounted');
      }

      destroyDOM(vdom);
      reset();
    }
  };
}
