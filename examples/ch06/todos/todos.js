//import { h } from 'https://unpkg.com/xen-js-fwk@1.0.1';
import { h, createApp, hString } from '../../dist/xen-js-fwk.js?2';

createApp({
  state: 0,
  reducers: {
    add: (state, amount) => state + amount,
  },
  view: (state, emit) => {
    return h('div', {}, [
      h(
        'button',
        { on: { click: () => emit('add', 1) } },
        [hString(state)]
      ),
      h('br'),
      h('br'),
      h(
        'p',
        {},
        [hString(`Result is ${state}`)]
      )
    ])
  },
}).mount(document.body)
