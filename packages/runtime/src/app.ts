import { destroyDOM } from './destroy-dom';
import { mountDOM } from './mount-dom';
import { VNode } from './models/vNode';
import { Dispatcher } from './dispatcher';

export function createApp({ state, view, reducers = {} }) {
  let parentEl: Nullable<HTMLElement> = null;
  let vDom: Nullable<VNode> = null;

  const dispatcher = new Dispatcher();
  const subscriptions = [ dispatcher.afterEveryCommand(renderApp) ];
  for (const actionName in reducers) {
    const reducer = reducers[actionName];
    const subs = dispatcher.subscribe(actionName, (payload) => {
      state = reducer(state, payload);
    });
    subscriptions.push(subs);
  }

  function emit(eventName: string, payload: any): void {
    dispatcher.dispatch(eventName, payload);
  }

  function renderApp() {
    if (vDom) {
      destroyDOM(vDom);
    }

    vDom = view(state, emit);

    mountDOM(vDom, parentEl);
  }

  return {
    mount(_parentEl: HTMLElement): void {
      parentEl = _parentEl;
      renderApp();
    },

    unmount() {
      destroyDOM(vDom);
      vDom = null;
      subscriptions.forEach((unsubscribe) => unsubscribe());
    }
  };
}
