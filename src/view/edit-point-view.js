import SmartView from './smart-view.js';
import { createOffersMarkup, createPictureContainerMarkup, formatDate, createOfferContainerMarkup, createDestinationContainerMarkup } from '../utils/point.js';
import { PointType } from '../const.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { destinationData, offersData } from '../main.js';

const NO_OFFERS_TYPES = ['sightseeing', 'transport'];
const STATES = {
  DISABLED: 'disabled',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
};
const BUTTONS_NAMES = {
  CLOSE: 'Close',
  SAVE: 'Save',
  DELETE: 'Delete',
};

const createOptionsMarkup = (destinations) => {
  return destinations.map((item) => `<option value="${item.name}"></option>`);
};

const createPointTypeMarkup = (types, currentType) => {
  return types
    .map((item) => {
      return `<div class="event__type-item">
  <input id="event-type-${item.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
  value="${item.type}" ${item.type === currentType ? 'checked' : ''}>
  <label class="event__type-label  event__type-label--${item.type}" for="event-type-${item.type}-1">${item.type}</label>
</div>`;
    })
    .join(' ');
};

const checkOffers = (type) => {
  return !NO_OFFERS_TYPES.some((item) => item === type);
};

const setDisabled = (saving, deleting) => (saving || deleting ? STATES.DISABLED : '');

const createPointEditTemplate = ({ basePrice, dateFrom, dateTo, destination, type = PointType.TAXI, isSaving, isDeleting }, offers) => {
  const dateTimeStart = formatDate(dateFrom);
  const dateTimeEnd = formatDate(dateTo);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17"
            src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox"
          ${setDisabled(isSaving, isDeleting)}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createPointTypeMarkup(offersData.getOffers(), type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
          value="${destination ? destination.name : ''}" list="destination-list-1" required
          ${setDisabled(isSaving, isDeleting)}>
          <datalist id="destination-list-1">
            ${createOptionsMarkup(destinationData.getDestinations())}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time event__input--date-from" id="event-start-time-1" type="text" name="event-start-time" value="${dateTimeStart}"
          ${setDisabled(isSaving, isDeleting)}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time event__input--date-to" id="event-end-time-1" type="text" name="event-end-time" value="${dateTimeEnd}"
          ${setDisabled(isSaving, isDeleting)}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="1"
          value="${basePrice ? basePrice : ''}" required ${setDisabled(isSaving, isDeleting)}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDeleting ? STATES.DISABLED : ''}>
        ${isSaving ? STATES.SAVING : BUTTONS_NAMES.SAVE}</button>
        <button class="event__reset-btn" type="reset" ${isSaving ? STATES.DISABLED : ''}>
        ${basePrice ? (isDeleting ? STATES.DELETING : BUTTONS_NAMES.DELETE) : BUTTONS_NAMES.CLOSE}</button>
        ${basePrice ? '<button class="event__rollup-btn event__rollup-btn--close" type="button">' : ''}
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${checkOffers(type) ? createOfferContainerMarkup(createOffersMarkup(offersData.getOffers(), offers, type, isSaving, isDeleting)) : ''}
        ${destination ? createDestinationContainerMarkup(destination) : ''}
        ${destination ? createPictureContainerMarkup(destination.pictures) : ''}
      </section>
    </form>
  </li>
  `;
};

export default class EditPointView extends SmartView {
  constructor(point) {
    super();
    this._data = EditPointView.parsePointToData(point);
    this._element = null;
    this._startPicker = null;
    this._endPicker = null;
    this._dateState = null;
    this._checkedOffers = this._data.offers;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._routeTypeChangeHandler = this._routeTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);

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

    this._endPicker = flatpickr(this.getElement().querySelector('.event__input--date-to'), {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      time_24hr: true,
      minDate: this._data.dateFrom || new Date(),
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

    if (this._dateState <= userDate || !this._dateState) {
      this._endPicker.setDate(userDate);
      this._dateState = userDate;

      this.updateData(
        {
          dateTo: userDate,
        },
        true
      );
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

  removeElement() {
    super.removeElement();

    if (this._startPicker) {
      this._startPicker.destroy();
      this._startPicker = null;
    }

    if (this._endPicker) {
      this._endPicker.destroy();
      this._endPicker = null;
    }
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({ basePrice: evt.target.value }, true);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const destinations = destinationData.getDestinations();

    const isTrueDestination = destinations.some((item) => {
      return item.name === evt.target.value;
    });

    if (!isTrueDestination) {
      return evt.target.setCustomValidity('This destination was not found');
    }

    const destination = destinations.filter((item) => item.name === evt.target.value)[0];
    this.updateData({
      destination: {
        name: destination.name,
        description: destination.description,
        pictures: destination.pictures,
      },
    });
  }

  _routeTypeChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({ type: evt.target.value, offers: [] });

    this._checkedOffers = null;
  }

  _offersChangeHandler(evt) {
    if (!this._checkedOffers) {
      this._checkedOffers = this._data.offers || [];
    }

    const isIncludeTargetOffer = this._checkedOffers.some((item) => item.title === evt.target.dataset.title);

    const pointType = this._data.type || PointType.TAXI;

    const checkOffer = offersData
      .getOffers()
      .filter((item) => item.type === pointType)[0]
      .offers.filter((item) => item.title === evt.target.dataset.title);

    const isNewOffer = this._checkedOffers.every((item) => item.title !== checkOffer[0].title);

    let checkedOffers = this._checkedOffers;
    if (isNewOffer) {
      checkedOffers = [...this._checkedOffers, ...checkOffer];
      this._checkedOffers = checkedOffers;
    }

    if (isIncludeTargetOffer) {
      this._checkedOffers = this._checkedOffers.filter((item) => item.title !== evt.target.dataset.title);
    }
  }

  reset(point) {
    this._checkedOffers = this._data.offers;
    this.updateData(EditPointView.parsePointToData(point));
  }

  getTemplate() {
    return createPointEditTemplate(this._data, this._checkedOffers);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setStartPicker();
    this._setEndPicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._removeDisabledButtonNewEvent();
    this._callback.deleteClick(EditPointView.parseDataToPoint(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._routeTypeChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);
    this.getElement().querySelector('.event__details').addEventListener('change', this._offersChangeHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this.updateData({ offers: this._checkedOffers });
    this._removeDisabledButtonNewEvent();
    this._callback.formSubmit(EditPointView.parseDataToPoint(this._data));
  }

  _removeDisabledButtonNewEvent() {
    document.querySelector('.trip-main__event-add-btn').removeAttribute(STATES.DISABLED);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  static parsePointToData(point) {
    return Object.assign({}, point, {
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
