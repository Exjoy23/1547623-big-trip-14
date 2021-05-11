import dayjs from 'dayjs';
import { sortPointDay } from '../utils/point.js';
import AbstractView from './abstract-view.js';

const getTotalPrice = (points) => {
  let totalPrice = 0;

  points.forEach((item) => {
    totalPrice += +item.basePrice;

    item.offers.forEach((item) => {
      totalPrice += item.price;
    });
  });

  return totalPrice;
};

const getRoute = (points) => {
  if (points.length <= 3) {
    const point1 = points[0] ? points[0].destination.name : '';
    const point2 = points[1] ? ' &mdash; ' + points[1].destination.name : '';
    const point3 = points[2] ? ' &mdash; ' + points[2].destination.name : '';

    return `${point1}${point2}${point3}`;
  }

  return `${points[0].destination.name} &mdash; ... &mdash;
    ${points[points.length - 1].destination.name}`;
};

const createInfoTemplate = (pointsData) => {
  const points = pointsData.sort(sortPointDay);
  const dayStart = dayjs(points[0].dateFrom).format('MMM D');
  const dayEnd = dayjs(points[points.length - 1].dateTo).format('MMM D');

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getRoute(points)}</h1>

      <p class="trip-info__dates">${dayStart}&nbsp;&mdash;&nbsp;${dayEnd}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">
      ${getTotalPrice(points)}</span>
    </p>
  </section>
  `;
};

export default class InfoView extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._element = null;
  }

  getTemplate() {
    return createInfoTemplate(this._point);
  }
}
