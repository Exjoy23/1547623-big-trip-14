import dayjs from 'dayjs';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
let id = 1;

const isCheckedOffer = (availableOffer, checkedOffers) => {
  if (availableOffer && checkedOffers) {
    return checkedOffers.some((item) => {
      return [item.title].indexOf(availableOffer.title) !== -1;
    });
  }
};

export const createOffersMarkup = (availableOffers, checkedOffers, type, isSaving, isDeleting) => {
  if (availableOffers) {
    return availableOffers
      .filter((item) => item.type === type)[0]
      .offers.map((item) => {
        return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox"
        name="event-offer-${item.title}" data-title="${item.title}"
        ${isCheckedOffer(item, checkedOffers) ? 'checked' : ''}
        ${isSaving || isDeleting ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${id++}">
          <span class="event__offer-title">${item.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${item.price}</span>
        </label>
      </div>
      `;
      })
      .join(' ');
  }
};

const createPictureMarkup = (pictures) => {
  return pictures
    .map((item) => {
      return `<img class="event__photo" src="${item.src}" alt="${item.description}">`;
    })
    .join(' ');
};

export const createPictureContainerMarkup = (pictures) => {
  if (pictures && pictures.length) {
    return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${createPictureMarkup(pictures)}
    </div>
  </div>`;
  }

  return '';
};

export const createOfferContainerMarkup = (child) => {
  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${child}
    </div>
  </section>`;
};

export const createDestinationContainerMarkup = (destination) => {
  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">
    ${destination.description}</p>
  </section>`;
};

export const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YY HH:mm');
};

export const sortPointDay = (pointA, pointB) => {
  return new Date(pointA.dateFrom) - new Date(pointB.dateFrom);
};

export const sortPointTime = (pointA, pointB) => {
  return dayjs(pointB.dateTo).diff(dayjs(pointA.dateTo)) - dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom));
};

export const sortPointPrice = (priceA, priceB) => {
  return priceB.basePrice - priceA.basePrice;
};

export const formatDuration = (duration) => {
  const day = Math.floor(duration / MINUTES_IN_HOUR / HOURS_IN_DAY);
  const hour = Math.floor((duration - day * HOURS_IN_DAY * MINUTES_IN_HOUR) / MINUTES_IN_HOUR);
  const minute = duration % MINUTES_IN_HOUR;

  if (day) {
    return `${day}D ${hour ? hour : '00'}H ${minute ? minute : '00'}M`;
  }

  if (hour) {
    return `${hour}H ${minute ? minute : '00'}M`;
  }

  if (minute) {
    return `${minute}M`;
  }

  return '00M';
};
