import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';
import { PointType } from '../const.js';
import { formatDuration } from '../utils/point.js';

const createOfferMarkup = (offer) => {
  return `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>
  `;
};

const createPointTemplate = ({ basePrice, dateFrom, dateTo, destination, isFavorite, offers, type = PointType.TAXI }) => {
  const dateTimeStart = dayjs(dateFrom).format('YYYY-MM-DDTHH:mm');
  const dateTimeEnd = dayjs(dateTo).format('YYYY-MM-DDTHH:mm');
  const dayStart = dayjs(dateFrom).format('D MMM');
  const dateStart = dayjs(dateFrom).format('HH:mm');
  const dateEnd = dayjs(dateTo).format('HH:mm');
  const duration = dayjs(dateTo).diff(dayjs(dateFrom), 'm');

  const offersMarkup = offers.length ? offers.map((item) => createOfferMarkup(item)).join(' ') : '';

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${dayStart}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination ? destination.name : ''}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateTimeStart}">${dateStart}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTimeEnd}">${dateEnd}</time>
        </p>
        <p class="event__duration">
          ${formatDuration(duration)}
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersMarkup}
      </ul>
      <button class="event__favorite-btn
      ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `;
};

export default class PointView extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._element = null;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}
