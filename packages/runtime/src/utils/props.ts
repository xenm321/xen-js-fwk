import { EventHandlers, VNode } from '../models/vNode';

export function extractPropsAndEvents(vDom: VNode): {
  props: Readonly<any>;
  events: EventHandlers;
} {
  const { on: events = {}, ...props } = vDom.props;
  delete props.key;

  return { props, events };
}
