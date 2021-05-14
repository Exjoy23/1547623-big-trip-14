import AbstractView from './abstract-view.js';
import { MenuItem } from '../const.js';

const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-value="${MenuItem.POINTS}">Table</a>
    <a class="trip-tabs__btn" href="#" data-value="${MenuItem.STATISTICS}">Stats</a>
  </nav>
  `;
};

export default class MenuView extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();

    if (!evt.target.classList.contains('trip-tabs__btn--active')) {
      this._callback.menuClick(evt.target.dataset.value);
    }

    this.getElement()
      .querySelectorAll('.trip-tabs__btn')
      .forEach((item) => {
        item.classList.remove('trip-tabs__btn--active');
      });

    if (evt.target.classList.contains('trip-tabs__btn')) {
      evt.target.classList.add('trip-tabs__btn--active');
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }
}
