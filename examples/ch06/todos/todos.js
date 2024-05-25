//import { h } from 'https://unpkg.com/xen-js-fwk@1.0.1';
import { h, createApp, hString } from '../../dist/xen-js-fwk.min.js';

createApp({
  state: 0,
  reducers: {
    add: (state, amount) => state + amount,
  },
  view: (state, emit) =>
    h(
      'button',
      { on: { click: () => emit('add', 1) } },
      [hString(state)]
    ),
}).mount(document.body)
