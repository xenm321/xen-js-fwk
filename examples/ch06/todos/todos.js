import { h } from 'https://unpkg.com/xen-js-fwk@1.0.1';

function CreateTodo() {
  return h('div', {}, [
    h('label', { for: 'todo-input' }, ['New TODO']),
    h('input', {
      type: 'text',
      id: 'todo-input',
      value: 'placeholder',
    }),
    h(
      'button',
      {
        disabled: false,
      },
      ['Add']
    ),
  ])
}

console.log(CreateTodo());