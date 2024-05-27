import { describe, expect, test } from 'vitest';
import {h} from "../../h";

describe('zzzz', () => {
  test('example1', () => {
    expect(2).toBe(2);
  });

  test('create element', () => {
    const el = document.createElement('div');
    expect(el).instanceof(HTMLDivElement);
  });
});
