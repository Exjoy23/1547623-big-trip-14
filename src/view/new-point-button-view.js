import AbstractView from './abstract-view.js';

const createNewPointButtonTemplate = () => {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" >New event</button>';
};

export default class NewPointButtonView extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createNewPointButtonTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback._click(evt.target.value);
  }

  setClickHandler(callback) {
    this._callback._click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  setDisabled() {
    this.getElement().setAttribute('disabled', true);
  }

  removeDisabled() {
    this.getElement().removeAttribute('disabled');
  }
}
