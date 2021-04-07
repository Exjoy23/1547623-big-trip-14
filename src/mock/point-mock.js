import dayjs from 'dayjs';
import { getRandomInteger } from '../utils.js';

const MIN_BASE_PRICE = 100;
const MAX_BASE_PRICE = 1000;
const MIN_OFFER = 1;
const MAX_OFFER = 5;
const MIN_DESCRIPTION = 1;
const MAX_DESCRIPTION = 5;
const TIME_FROM_MIN = -5;
const TIME_FROM_MAX = 0;
const TIME_TO_MIN = 1;
const TIME_TO_MAX = 5;
const MIN_PICTURE = 1;
const MAX_PICTURE = 5;
const MINUTES_GAP_MIN = 1;
const MINUTES_GAP_MAX = 59;
const DAY_INCREMENT = 0.1;

let id = 1;
let day = 0;

const getId = () => {
  return id++;
};

const generateDestinationPoints = () => {
  const destinationPoints = ['Singapore', 'Paris', 'Hong Kong', 'Zurich', 'Geneva', 'Osaka', 'Seoul', 'Copenhagen', 'New York', 'Tel Aviv', 'Los Angeles'];

  const randomIndex = getRandomInteger(0, destinationPoints.length - 1);

  return destinationPoints[randomIndex];
};

const generateDescription = () => {
  const descriptions = [
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

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const getDescription = () => {
  return new Array(getRandomInteger(MIN_DESCRIPTION, MAX_DESCRIPTION)).fill().map(() => generateDescription());
};

const generateOffers = () => {
  const offers = [
    { title: 'add luggage', price: 50 },
    { title: 'switch to comfort class', price: 100 },
    { title: 'add meal', price: 15 },
    { title: 'choose seats', price: 5 },
    { title: 'travel by train', price: 40 },
  ];

  const randomIndex = getRandomInteger(0, offers.length - 1);

  return offers[randomIndex];
};

const getOffers = () => {
  const offers = new Array(getRandomInteger(MIN_OFFER, MAX_OFFER)).fill().map(() => generateOffers());

  return Array.from(new Set(offers.map((item) => JSON.stringify(item)))).map((item) => JSON.parse(item));
};

const generateRouteType = () => {
  const routeTypes = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

  const randomIndex = getRandomInteger(0, routeTypes.length - 1);

  return routeTypes[randomIndex];
};

const generateDate = (from, to) => {
  const daysGap = getRandomInteger(day, (day += DAY_INCREMENT));
  const hoursGap = getRandomInteger(from, to);
  const minutesGap = getRandomInteger(MINUTES_GAP_MIN, MINUTES_GAP_MAX);

  return dayjs().add(daysGap, 'd').add(hoursGap, 'h').add(minutesGap, 'm').toDate();
};

const generatePicture = () => {
  return {
    src: `http://picsum.photos/248/152?r=${Math.random()}`,
    description: generateDescription(),
  };
};

const getPictures = () => {
  return new Array(getRandomInteger(MIN_PICTURE, MAX_PICTURE)).fill().map(() => generatePicture());
};

export const generatePoint = () => {
  return {
    basePrice: getRandomInteger(MIN_BASE_PRICE, MAX_BASE_PRICE),
    dateFrom: generateDate(TIME_FROM_MIN, TIME_FROM_MAX),
    dateTo: generateDate(TIME_TO_MIN, TIME_TO_MAX),
    destination: {
      description: getDescription().join(' '),
      name: generateDestinationPoints(),
      pictures: getPictures(),
    },
    id: getId(),
    isFavorite: Math.random() < 0.5 ? true : false,
    offers: getOffers(),
    type: generateRouteType(),
  };
};
