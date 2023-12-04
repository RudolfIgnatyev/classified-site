class Section {
  constructor({ items, renderer }, containerSelector) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  renderItems() {
    this._items.forEach(item => this.addItem(this._renderer(item), true));
  }

  addItem(DOMElement, endPosition) {
    if (endPosition === true) {
      this._container.append(DOMElement);
    } else {
      this._container.prepend(DOMElement);
    }
  }
}

export { Section };
