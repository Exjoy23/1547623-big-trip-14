import InfoView from './view/info-view.js';
import MenuView from './view/menu-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import PointView from './view/point-view.js';
import EditPointView from './view/edit-point-view.js';
import NoPointView from './view/no-point-view.js';
import { generatePoint } from './mock/point-mock.js';
import { render, RenderPosition } from './utils.js';

const POINT_COUNT = 20;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector('.page-body');
const infoElement = mainElement.querySelector('.trip-main');
const menuElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const tripElement = mainElement.querySelector('.trip-events');

render(menuElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(filterElement, new FilterView().getElement(), RenderPosition.BEFOREEND);

if (points.length) {
  render(tripElement, new SortView().getElement(), RenderPosition.BEFOREEND);
  render(infoElement, new InfoView(points).getElement(), RenderPosition.AFTERBEGIN);
}

if (!points.length) {
  render(tripElement, new NoPointView().getElement(), RenderPosition.BEFOREEND);
}

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

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent
    .getElement()
    .querySelector('.event__rollup-btn')
    .addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

  editPointComponent
    .getElement()
    .querySelector('.event--edit')
    .addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

  editPointComponent
    .getElement()
    .querySelector('.event__rollup-btn')
    .addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

  render(pointListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

for (let i = 0; i < POINT_COUNT; i++) {
  renderPoint(tripListElement, points[i]);
}
