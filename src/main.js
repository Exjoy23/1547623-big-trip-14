import MenuView from './view/menu-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import Api from './api.js';
import { render, RenderPosition } from './utils/render.js';
import { UpdateType } from './const.js';
import Destination from './data/destination.js';
import Offers from './data/offers.js';

const AUTHORIZATION = 'Basic exjoy2333333333333333333333';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const mainElement = document.querySelector('.page-body');
const menuElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const boardContainer = mainElement.querySelector('.board-container');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

export const destinationData = new Destination();
export const offersData = new Offers();

const boardPresenter = new BoardPresenter(boardContainer, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(filterElement, filterModel, pointsModel);

boardPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
  evt.target.setAttribute('disabled', true);
});

api
  .getOffers()
  .then((offers) => {
    offersData.setOffers(offers);
  })
  .then(() => {
    api.getDestinations().then((destinations) => {
      destinationData.setDestinations(destinations);
    });
  })
  .then(() => {
    api
      .getPoints()
      .then((points) => {
        pointsModel.setPoints(UpdateType.INIT, points);
        render(menuElement, new MenuView(), RenderPosition.BEFOREEND);
        filterPresenter.init();
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
