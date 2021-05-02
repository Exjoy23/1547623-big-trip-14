import InfoView from './view/info-view.js';
import MenuView from './view/menu-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import { generatePoint } from './mock/point.js';
import { render, RenderPosition } from './utils/render.js';

const POINT_COUNT = 4;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector('.page-body');
const infoElement = mainElement.querySelector('.trip-main');
const menuElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const boardContainer = mainElement.querySelector('.board-container');

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

if (points.length) {
  render(infoElement, new InfoView(points), RenderPosition.AFTERBEGIN);
}
render(menuElement, new MenuView(), RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(boardContainer, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filterElement, filterModel, pointsModel);

filterPresenter.init();
boardPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
  // evt.target.setAttribute('disabled', true);
});
