import dayjs from 'dayjs';

let id = 1;

export const createOffersMarkup = (offers) => {
  return offers
    .map((item) => {
      return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox"
        name="event-offer-${item.title}">
        <label class="event__offer-label" for="event-offer-${id++}">
          <span class="event__offer-title">${item.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${item.price}</span>
        </label>
      </div>
      `;
    })
    .join(' ');
};

const createPictureMarkup = (pictures) => {
  return pictures
    .map((item) => {
      return `<img class="event__photo" src="${item.src}" alt="${item.description}">`;
    })
    .join(' ');
};

export const createPictureContainerMarkup = (pictures) => {
  if (pictures.length) {
    return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${createPictureMarkup(pictures)}
    </div>
  </div>`;
  }

  return '';
};

export const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YY HH:mm');
};

export const sortPointTime = (pointA, pointB) => {
  return dayjs(pointB.dateTo).diff(dayjs(pointA.dateTo)) - dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom));
};

export const sortPointPrice = (priceA, priceB) => {
  return priceB.basePrice - priceA.basePrice;
};
