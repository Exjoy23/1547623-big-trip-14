import MenuView from './view/menu-view.js';
import StatisticsView from './view/statistics-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import Api from './api/api.js';
import { render, RenderPosition, remove } from './utils/render.js';
import { UpdateType, MenuItem } from './const.js';
import Destination from './data/destination.js';
import Offers from './data/offers.js';
import NewPointButtonView from './view/new-point-button-view.js';
import InfoPresenter from './presenter/info-presenter.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import { isOnline } from './utils/common.js';
import { toast } from './utils/toast.js';

const AUTHORIZATION = 'Basic exjoy2333333333111111';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const HIDE_LINE_CLASS = 'hide-line';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v23';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const mainElement = document.querySelector('.page-body');
const menuElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const boardContainer = mainElement.querySelector('.board-container');
const tripMainElement = mainElement.querySelector('.trip-main');
const pageContainerElements = mainElement.querySelectorAll('.page-body__container');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const menuComponent = new MenuView();
export const newPointButtonComponent = new NewPointButtonView();

export const destinationData = new Destination();
export const offersData = new Offers();

const boardPresenter = new BoardPresenter(boardContainer, pointsModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(filterElement, filterModel, pointsModel);
const infoPresenter = new InfoPresenter(tripMainElement, pointsModel);

newPointButtonComponent.setClickHandler(() => {
  if (!isOnline()) {
    toast('You cannot create point offline');
    return;
  }

  boardPresenter.createPoint();
  newPointButtonComponent.setDisabled();
});

boardPresenter.init();

render(menuElement, menuComponent, RenderPosition.BEFOREEND);
render(tripMainElement, newPointButtonComponent, RenderPosition.BEFOREEND);

let statisticsComponent = null;

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.POINTS:
      boardPresenter.init();
      remove(statisticsComponent);
      filterPresenter.removeDisabledFilters();
      newPointButtonComponent.removeDisabled();
      filterPresenter.init();
      pageContainerElements.forEach((item) => item.classList.remove(HIDE_LINE_CLASS));
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(boardContainer, statisticsComponent, RenderPosition.BEFOREEND);
      filterPresenter.setDisabledFilters();
      newPointButtonComponent.setDisabled();
      pageContainerElements.forEach((item) => item.classList.add(HIDE_LINE_CLASS));
      break;
  }
};

menuComponent.setMenuClickHandler(handleMenuClick);

apiWithProvider
  .getOffers()
  .then((offers) => {
    offersData.setOffers(offers);
  })
  .then(() => {
    apiWithProvider.getDestinations().then((destinations) => {
      destinationData.setDestinations(destinations);
    });
  })
  .then(() => {
    apiWithProvider.getPoints().then((points) => {
      pointsModel.setPoints(UpdateType.INIT, points);
      infoPresenter.init();
      filterPresenter.init();
    });
  })
  .catch(() => {
    toast('Loading failure. Try again later.');
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  toast('Connection lost');
  document.title += ' [offline]';
});
