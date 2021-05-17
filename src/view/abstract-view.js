import { createElement } from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;
const ErrorMessage = {
  CANNOT_INSTANTIATE: 'Cannot instantiate AbstractView, only concrete one.',
  NOT_IMPLEMENTED: 'AbstractView method not implemented: getTemplate',
};

export default class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error(ErrorMessage.CANNOT_INSTANTIATE);
    }
    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(ErrorMessage.NOT_IMPLEMENTED);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
