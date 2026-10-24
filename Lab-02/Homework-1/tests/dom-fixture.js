// Small in-memory DOM double for controller logic, not a browser or accessibility engine.
class TextNode {
  constructor(text) { this.textContent = String(text); this.parentElement = null; }
}

class Element {
  constructor(tag, document) {
    this.tagName = tag.toUpperCase();
    this.ownerDocument = document;
    this.childNodes = [];
    this.attributes = new Map();
    this.dataset = {};
    this.listeners = new Map();
    this.tabIndex = -1;
    this.className = '';
    this.id = '';
    this.value = '';
    this.disabled = false;
    this.hidden = false;
    this.parentElement = null;
    this.classList = { add: (name) => { this.className = `${this.className} ${name}`.trim(); } };
  }
  get children() { return this.childNodes.filter((node) => node instanceof Element); }
  get textContent() { return this.childNodes.map((node) => node.textContent).join(''); }
  set textContent(value) { this.replaceChildren(new TextNode(value)); }
  append(...nodes) {
    for (const node of nodes) { node.parentElement = this; this.childNodes.push(node); }
  }
  replaceChildren(...nodes) {
    this.childNodes.forEach((node) => { node.parentElement = null; });
    this.childNodes = [];
    this.append(...nodes);
  }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) {
    if (name === 'tabindex') return String(this.tabIndex);
    if (name.startsWith('data-')) {
      const key = name.slice(5).replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());
      return this.dataset[key] ?? null;
    }
    return this.attributes.get(name) ?? null;
  }
  matches(selector) {
    if (selector.includes(',')) return selector.split(',').some((part) => this.matches(part.trim()));
    if (selector.startsWith('#')) return this.id === selector.slice(1);
    const attribute = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/u);
    if (attribute) return attribute[2] === undefined ? this.getAttribute(attribute[1]) !== null : this.getAttribute(attribute[1]) === attribute[2];
    return this.tagName.toLowerCase() === selector;
  }
  querySelectorAll(selector) {
    return this.children.flatMap((child) => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
  closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) ?? null; }
  contains(node) { return node === this || this.children.some((child) => child.contains(node)); }
  get rows() { return this.querySelectorAll('tr'); }
  get cells() { return this.children.filter((child) => ['TH', 'TD'].includes(child.tagName)); }
  get cellIndex() { return this.parentElement.cells.indexOf(this); }
  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }
  removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener); }
  emit(type, options = {}) {
    const event = { target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...options };
    for (let node = this; node; node = node.parentElement) {
      for (const listener of node.listeners.get(type) ?? []) listener(event);
    }
    return event;
  }
  click() { if (!this.disabled) this.emit('click'); }
  focus() { this.ownerDocument.activeElement = this; this.emit('focusin'); }
  scrollIntoView(options) { this.ownerDocument.scrollRequests.push({ target: this, options }); }
}

export function fixture() {
  const document = {
    activeElement: null,
    scrollRequests: [],
    createElement(tag) { return new Element(tag, this); },
    createTextNode(text) { return new TextNode(text); },
  };
  const root = document.createElement('section');
  root.id = 'directory';
  document.querySelector = (selector) => root.matches(selector) ? root : root.querySelector(selector);
  const add = (tag, id, dataset = {}) => {
    const node = document.createElement(tag);
    node.id = id;
    Object.assign(node.dataset, dataset);
    root.append(node);
    return node;
  };
  const table = add('table', 'members-grid');
  for (const id of ['result-status', 'selected-count', 'empty-state', 'page-label']) add('p', id);
  for (const id of ['search', 'team-filter', 'status-filter', 'page-size']) add(id === 'search' ? 'input' : 'select', id);
  add('button', '', { page: 'previous' });
  add('button', '', { page: 'next' });
  add('button', '', { action: 'clear-selection' });
  add('button', '', { action: 'clear-filters' });
  return { document, root, table };
}
