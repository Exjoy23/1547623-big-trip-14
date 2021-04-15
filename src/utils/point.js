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

export const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YY HH:mm');
};
