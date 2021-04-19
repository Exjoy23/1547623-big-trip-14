import InfoView from './view/info-view.js';
import MenuView from './view/menu-view.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { generatePoint } from './mock/point.js';
import { render, RenderPosition } from './utils/render.js';

const POINT_COUNT = 20;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector('.page-body');
const infoElement = mainElement.querySelector('.trip-main');
const menuElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const boardContainer = mainElement.querySelector('.board-container');

render(infoElement, new InfoView(points), RenderPosition.AFTERBEGIN);
render(menuElement, new MenuView(), RenderPosition.BEFOREEND);
render(filterElement, new FilterView(), RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(boardContainer);

boardPresenter.init(points);
