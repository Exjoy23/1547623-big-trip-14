import SmartView from './smart-view.js';
import { createOffersMarkup, createPictureContainerMarkup, formatDate } from '../utils/point.js';
import { generateOffers, getPictures, getDescription } from '../mock/point.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createPointEditTemplate = ({ basePrice, dateFrom, dateTo, destination, offers, type }) => {
  const dateTimeStart = formatDate(dateFrom);
  const dateTimeEnd = formatDate(dateTo);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi"
                ${type === 'taxi' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus"
                ${type === 'bus' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train"
                ${type === 'train' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship"
                ${type === 'ship' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport"
                ${type === 'transport' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive"
                ${type === 'drive' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight"
                ${type === 'flight' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in"
                ${type === 'check-in' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing"
                ${type === 'sightseeing' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant"
                ${type === 'restaurant' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
          value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time event__input--date-from" id="event-start-time-1" type="text" name="event-start-time" value="${dateTimeStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time event__input--date-to" id="event-end-time-1" type="text" name="event-end-time" value="${dateTimeEnd}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn event__rollup-btn--close" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createOffersMarkup(offers)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
          ${destination.description}</p>
        </section>

        ${createPictureContainerMarkup(destination.pictures)}
      </section>
    </form>
  </li>
  `;
};

export default class PointEditView extends SmartView {
  constructor(point) {
    super();
    this._data = PointEditView.parsePointToData(point);
    this._element = null;
    this._startPicker = null;
    this._endPicker = null;
    this._dateState = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._routeTypeChangeHandler = this._routeTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setStartPicker();
    this._setEndPicker();
  }

  _setStartPicker() {
    if (this._startPicker) {
      this._startPicker.destroy();
      this._startPicker = null;
    }

    this._startPicker = flatpickr(this.getElement().querySelector('.event__input--date-from'), {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      time_24hr: true,
      onChange: this._dateFromChangeHandler,
    });
  }

  _setEndPicker() {
    if (this._endPicker) {
      this._endPicker.destroy();
      this._endPicker = null;
    }

    this._dateState = this._data.dateTo;
    this._endPicker = flatpickr(this.getElement().querySelector('.event__input--date-to'), {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      time_24hr: true,
      minDate: this._data.dateFrom,
      onChange: this._dateToChangeHandler,
    });
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData(
      {
        dateFrom: userDate,
      },
      true
    );

    this._endPicker.set('minDate', userDate);
    this._endPicker.set('minTime', userDate);

    if (this._dateState <= userDate) {
      this._endPicker.setDate(userDate);
      this._dateState = userDate;
    }
  }

  _dateToChangeHandler([userDate]) {
    this._dateState = userDate;

    this.updateData(
      {
        dateTo: userDate,
      },
      true
    );
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({ basePrice: evt.target.value });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: { name: evt.target.value, description: getDescription(), pictures: getPictures() },
    });
  }

  _routeTypeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({ type: evt.target.value, offers: generateOffers() });
  }

  reset(point) {
    this.updateData(PointEditView.parsePointToData(point));
  }

  getTemplate() {
    return createPointEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setStartPicker();
    this._setEndPicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationChangeHandler);
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._routeTypeChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEditView.parseDataToPoint(this._data));
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  static parsePointToData(point) {
    return Object.assign({}, point);
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    return data;
  }
}
