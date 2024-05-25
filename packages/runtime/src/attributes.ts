import { Attr, TClassName } from './models/attr';

function setClass(el: HTMLElement, className: TClassName): void {
  el.className = '';

  if (typeof className === 'string') {
    el.className = className;
  }

  if (Array.isArray(className)) {
    el.classList.add(...className);
  }
}

export function setStyle(
  el: HTMLElement,
  name: string,
  value: string | number
): void {
  el.style[name] = value;
}

export function removeStyle(el: HTMLElement, name: string): void {
  el.style[name] = null;
}

export function setAttribute(
  el: HTMLElement,
  name: string,
  value: string | null
): void {
  if (value == null) {
    removeAttribute(el, name);
  } else if (name.startsWith('data-')) {
    el.setAttribute(name, value);
  } else {
    el[name] = value;
  }
}

export function setAttributes(el: HTMLElement, attrs: Attr): void {
  const { class: className, style, ...otherAttrs } = attrs;

  // Delete the "key" property if it exists
  delete otherAttrs.key;

  if (className) {
    setClass(el, className);
  }

  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(el, prop, value);
    });
  }

  for (const [name, value] of Object.entries(otherAttrs)) {
    setAttribute(el, name, value);
  }
}

export function removeAttribute(el: HTMLElement, name: string): void {
  try {
    el[name] = null;
  } catch {
    // Setting 'size' to null on an <input> throws an error.
    // Removing the attribute instead works. (Done below.)
    console.warn(`Failed to set "${name}" to null on ${el.tagName}`);
  }

  el.removeAttribute(name);
}
