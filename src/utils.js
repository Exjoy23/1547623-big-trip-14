import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const createOfferMarkup = (offers) => {
  return offers
    .map((item) => {
      return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${item.title}" type="checkbox" name="event-offer-${item.title}">
        <label class="event__offer-label" for="${item.title}">
          <span class="event__offer-title">${item.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${item.price}</span>
        </label>
      </div>
      `;
    })
    .join(' ');
};

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YY HH:mm');
};

export { getRandomInteger, createOfferMarkup, formatDate };
