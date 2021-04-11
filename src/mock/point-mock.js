import dayjs from 'dayjs';
import { getRandomInteger } from '../utils.js';

const MIN_BASE_PRICE = 100;
const MAX_BASE_PRICE = 1000;
const MIN_OFFER = 1;
const MAX_OFFER = 5;
const MIN_DESCRIPTION = 1;
const MAX_DESCRIPTION = 5;
const MIN_PICTURE = 1;
const MAX_PICTURE = 5;
const HOURS_GAP_MIN = 0;
const HOURS_GAP_MAX = 24;
const MINUTES_GAP_MIN = 1;
const MINUTES_GAP_MAX = 59;
const DESTINATION_POINTS = [
  'Singapore',
  'Paris',
  'Hong Kong',
  'Zurich',
  'Geneva',
  'Osaka',
  'Seoul',
  'Copenhagen',
  'New York',
  'Tel Aviv',
  'Los Angeles',
];
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  ' Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];
const ROUTE_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];
const OFFERS = [
  { title: 'add luggage', price: 50 },
  { title: 'switch to comfort class', price: 100 },
  { title: 'add meal', price: 15 },
  { title: 'choose seats', price: 5 },
  { title: 'travel by train', price: 40 },
];

let id = 1;
let timeFromMin = -6;
let timeFromMax = -5;
let timeToMin = -4;
let timeToMax = -3;

const getId = () => {
  return id++;
};

const getDescription = () => {
  return new Array(getRandomInteger(MIN_DESCRIPTION, MAX_DESCRIPTION))
    .fill()
    .map(() => DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)])
    .join(' ');
};

const generateOffers = () => {
  return Array.from(
    new Set(
      new Array(getRandomInteger(MIN_OFFER, MAX_OFFER))
        .fill()
        .map(() => OFFERS[getRandomInteger(0, OFFERS.length - 1)])
        .map((item) => JSON.stringify(item))
    )
  ).map((item) => JSON.parse(item));
};

const generateDate = (from, to) => {
  const daysGap = getRandomInteger(from, to);
  const hoursGap = getRandomInteger(HOURS_GAP_MIN, HOURS_GAP_MAX);
  const minutesGap = getRandomInteger(MINUTES_GAP_MIN, MINUTES_GAP_MAX);

  return dayjs().add(daysGap, 'd').add(hoursGap, 'h').add(minutesGap, 'm').toDate();
};

const generatePicture = () => {
  return {
    src: `http://picsum.photos/248/152?r=${Math.random()}`,
    description: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)],
  };
};

const getPictures = () => {
  return new Array(getRandomInteger(MIN_PICTURE, MAX_PICTURE)).fill().map(() => generatePicture());
};

export const generatePoint = () => {
  return {
    basePrice: getRandomInteger(MIN_BASE_PRICE, MAX_BASE_PRICE),
    dateFrom: generateDate(timeFromMin++, timeFromMax++),
    dateTo: generateDate(timeToMin++, timeToMax++),
    destination: {
      description: getDescription(),
      name: DESTINATION_POINTS[getRandomInteger(0, DESTINATION_POINTS.length - 1)],
      pictures: getPictures(),
    },
    id: getId(),
    isFavorite: Math.random() < 0.5 ? true : false,
    offers: generateOffers(),
    type: ROUTE_TYPES[getRandomInteger(0, ROUTE_TYPES.length - 1)],
  };
};
