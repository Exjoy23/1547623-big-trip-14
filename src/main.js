import InfoView from './view/info.js';
import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import PointView from './view/point.js';
import EditPointView from './view/edit-point.js';
import { generatePoint } from './mock/point-mock.js';
import { render, RenderPosition } from './utils.js';

const POINT_COUNT = 20;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector('.page-body');
const infoElement = mainElement.querySelector('.trip-main');
const menuElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const tripElement = mainElement.querySelector('.trip-events');

render(infoElement, new InfoView(points).getElement(), RenderPosition.AFTERBEGIN);
render(menuElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(filterElement, new FilterView().getElement(), RenderPosition.BEFOREEND);
render(tripElement, new SortView().getElement(), RenderPosition.BEFOREEND);

const tripListElement = document.createElement('ul');
tripListElement.classList.add('trip-events__list');
tripElement.appendChild(tripListElement);

const renderPoint = (pointListElement, point) => {
  const pointComponent = new PointView(point);
  const editPointComponent = new EditPointView(point);

  const replaceCardToForm = () => {
    pointListElement.replaceChild(editPointComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToCard = () => {
    pointListElement.replaceChild(pointComponent.getElement(), editPointComponent.getElement());
  };

  pointComponent
    .getElement()
    .querySelector('.event__rollup-btn')
    .addEventListener('click', () => {
      replaceCardToForm();
    });

  editPointComponent
    .getElement()
    .querySelector('.event--edit')
    .addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
    });

  render(pointListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

for (let i = 0; i < POINT_COUNT; i++) {
  renderPoint(tripListElement, points[i]);
}
