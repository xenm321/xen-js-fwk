import { expect, test } from 'vitest';
import { h, hFragment } from '../h';
import { defineComponent } from '../component';

test('create component', () => {
  const Counter = defineComponent<{ count: number }>({
    state() {
      return { count: 0 };
    },

    render() {
      return hFragment([
        h('p', {}, [`Count: ${this.state.count}`]),
        h(
          'button',
          {
            on: {
              click: this.updateCount
            }
          },
          ['Increment']
        )
      ]);
    },

    updateCount(): void {
      this.updateState({ count: this.state.count + 1 });
    }
  });

  const comp = new Counter();
  comp.mount(document.body);
  const html = comp.html;
  const btn = html.getElementsByTagName('button')[0];
  btn.click();
  btn.click();
  expect(comp.strHtml).equals('<p>Count: 2</p><button>Increment</button>');
});
