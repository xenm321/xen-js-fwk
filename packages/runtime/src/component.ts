import equal from 'fast-deep-equal';
import { DomTypes, EventHandlers, NodeElType, VNode } from './models/vNode';
import { mountDOM } from './mount-dom';
import { destroyDOM } from './destroy-dom';
import { patchDOM } from './patch-dom';
import { extractChildren } from './h';
import { IComponent } from './models/IComponent';
import { hasOwnProperty, isEmpty } from './utils/objects';
import { Dispatcher } from './dispatcher';

interface IDefineComponentParams<State, Props> {
  render: () => VNode;
  state?: (props: Props) => State;
  onMounted?: () => void;
  onUnmounted?: () => void;
  [key: string]: AnyFunction;
}

const emptyFn = (): void => {};

export type ComponentProps = [
  Readonly<any>,
  Nullable<EventHandlers>,
  Nullable<IComponent>
];

export function defineComponent<
  State extends object = any,
  Props extends object = any
>({
  render,
  state,
  onMounted = emptyFn,
  onUnmounted = emptyFn,
  ...methods
}: IDefineComponentParams<State, Props>) {
  class Component implements IComponent<Props> {
    #isMounted: boolean = false;
    #vDom: Nullable<VNode> = null;
    #hostEl: Nullable<HTMLElement> = null;

    state: State;
    props: Readonly<Props>;

    #eventHandlers: Nullable<EventHandlers> = null;
    readonly #parentComponent: Nullable<IComponent> = null;
    #dispatcher = new Dispatcher();
    #subscriptions = [];

    constructor(
      props?: Readonly<Props>,
      eventHandlers: Nullable<EventHandlers> = {},
      parentComponent: Nullable<IComponent> = null
    ) {
      this.props = props ?? ({} as Props);
      this.state = state ? state(props) : ({} as State);
      this.#eventHandlers = eventHandlers;
      this.#parentComponent = parentComponent;
    }

    onMounted(): Promise<any> {
      return Promise.resolve(onMounted.call(this));
    }

    onUnmounted(): Promise<any> {
      return Promise.resolve(onUnmounted.call(this));
    }

    get elements(): NodeElType[] {
      if (this.#vDom == null) {
        return [];
      }

      if (this.#vDom.type === DomTypes.FRAGMENT) {
        return extractChildren(this.#vDom).flatMap((child) => {
          if (child.type === DomTypes.COMPONENT) {
            return child.component.elements;
          }

          return [child.el];
        });
      }
      return [this.#vDom.el];
    }

    get firstElement(): Nullable<NodeElType> {
      return this.elements[0];
    }

    get offset(): number {
      if (
        this.#vDom.type === DomTypes.FRAGMENT &&
        this.firstElement instanceof HTMLElement
      ) {
        return Array.from(this.#hostEl.children).indexOf(this.firstElement);
      }
      return 0;
    }

    updateState(state: State): void {
      this.state = { ...this.state, ...state };
      this.#patch();
    }

    updateProps(props: Readonly<Props>): void {
      const newProps = { ...this.props, ...props };
      if (equal(this.props, newProps)) {
        return;
      }

      this.props = newProps;
      this.#patch();
    }

    render(): VNode {
      return render.call(this);
    }

    mount(hostEl: HTMLElement, index: Nullable<number> = null): void {
      if (this.#isMounted) {
        throw new Error('Component is already mounted');
      }

      this.#vDom = this.render();
      mountDOM(this.#vDom, hostEl, index, this);
      this.#wireEventHandlers();

      this.#hostEl = hostEl;
      this.#isMounted = true;
    }

    unmount(): void {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted');
      }

      destroyDOM(this.#vDom);
      this.#subscriptions.forEach((unsubscribe) => unsubscribe());

      this.#vDom = null;
      this.#hostEl = null;
      this.#isMounted = false;
      this.#subscriptions = [];
    }

    #patch(): void {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted');
      }

      const vdom = this.render();
      this.#vDom = patchDOM(this.#vDom, vdom, this.#hostEl, this);
    }

    get html(): HTMLElement {
      return this.#hostEl;
    }

    get strHtml(): string {
      return this.#hostEl?.innerHTML ?? '';
    }

    #wireEventHandlers() {
      this.#subscriptions = Object.entries(this.#eventHandlers).map(
        ([eventName, handler]) => this.#wireEventHandler(eventName, handler)
      );
    }

    #wireEventHandler(eventName: string, handler: AnyFunction): AnyFunction {
      return this.#dispatcher.subscribe(eventName, (payload) => {
        if (this.#parentComponent) {
          handler.call(this.#parentComponent, payload);
        } else {
          handler(payload);
        }
      });
    }

    emit(eventName: string, payload: any): void {
      this.#dispatcher.dispatch(eventName, payload);
    }
  }

  if (!isEmpty(methods)) {
    for (const [methodName, method] of Object.entries(methods)) {
      if (hasOwnProperty(Component, methodName)) {
        throw new Error(
          `Method "${methodName}()" already exists in the component.`
        );
      }

      Component.prototype[methodName] = method;
    }
  }

  return Component;
}
