import AbstractView from './abstract-view.js';

const ERROR_MESSAGE = 'Abstract method not implemented: resetHandlers';

export default class SmartView extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign({}, this._data, update);

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    if (parent) {
      parent.replaceChild(newElement, prevElement);
    }

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(ERROR_MESSAGE);
  }
}
