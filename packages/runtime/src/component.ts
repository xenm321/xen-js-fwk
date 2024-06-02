import { NodeElType, VNode } from './models/vNode';
import { mountDOM } from './mount-dom';
import { destroyDOM } from './destroy-dom';
import { patchDOM } from './patch-dom';
import { extractChildren } from './h';
import { DomTypes } from './models/vNode';
import { IComponent } from './models/IComponent';
import { hasOwnProperty, isEmpty } from './utils/objects';

interface IDefineComponentParams<State, Props> {
  render: () => VNode;
  state?: (props: Props) => State;
  [key: string]: AnyFunction;
}

export function defineComponent<
  State extends object = any,
  Props extends object = any
>({ render, state, ...methods }: IDefineComponentParams<State, Props>) {
  class Component implements IComponent {
    #isMounted: boolean = false;
    #vDom: Nullable<VNode> = null;
    #hostEl: Nullable<HTMLElement> = null;

    state: State;
    props: Readonly<Props>;

    constructor(props?: Readonly<Props>) {
      this.props = props ?? ({} as Props);
      this.state = state ? state(props) : ({} as State);
    }

    get elements(): NodeElType[] {
      if (this.#vDom == null) {
        return [];
      }

      if (this.#vDom.type === DomTypes.FRAGMENT) {
        return extractChildren(this.#vDom).map((child) => child.el);
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

    render(): VNode {
      return render.call(this);
    }

    mount(hostEl: HTMLElement, index: Nullable<number> = null): void {
      if (this.#isMounted) {
        throw new Error('Component is already mounted');
      }

      this.#vDom = this.render();
      mountDOM(this.#vDom, hostEl, index, this);

      this.#hostEl = hostEl;
      this.#isMounted = true;
    }

    unmount(): void {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted');
      }

      destroyDOM(this.#vDom);

      this.#vDom = null;
      this.#hostEl = null;
      this.#isMounted = false;
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
