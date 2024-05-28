import { expect, test } from 'vitest';
import { h, hString } from '../h';
import { mountDOM } from '../mount-dom';

test('correct mount', () => {
  const vDom = h('button', {}, [hString('Value')]);

  const body = document.body;
  mountDOM(vDom, body);
  expect(body.outerHTML).equals('<body><button>Value</button></body>');
});
