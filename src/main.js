import MenuView from './view/menu-view.js';
import StatisticsView from './view/statistics-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import StationModel from './model/station-model.js';
import FilterModel from './model/filter-model.js';
import Api from './api/api.js';
import { render, RenderPosition, remove } from './utils/render.js';
import { UpdateType, MenuItem, OfflineMessage } from './const.js';
import Destination from './data/destination.js';
import Offers from './data/offers.js';
import NewPointButtonView from './view/new-point-button-view.js';
import InfoPresenter from './presenter/info-presenter.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import { isOnline, setToast } from './utils/common.js';

const AUTHORIZATION = 'Basic exjoy233333333333333331111';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const HIDE_LINE_CLASS = 'hide-line';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v23';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const OFFLINE_TITLE = ' [offline]';

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const mainElement = document.querySelector('.page-body');
const menuElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const boardContainer = mainElement.querySelector('.board-container');
const tripMainElement = mainElement.querySelector('.trip-main');
const pageContainerElements = mainElement.querySelectorAll('.page-body__container');

const stationModel = new StationModel();
const filterModel = new FilterModel();

const menuComponent = new MenuView();
export const newPointButtonComponent = new NewPointButtonView();

export const destinationData = new Destination();
export const offersData = new Offers();

const boardPresenter = new BoardPresenter(boardContainer, stationModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(filterElement, filterModel, stationModel);
const infoPresenter = new InfoPresenter(tripMainElement, stationModel);

newPointButtonComponent.setClickHandler(() => {
  if (!isOnline()) {
    setToast(OfflineMessage.CREATE);
    return;
  }

  newPointButtonComponent.setDisabled();
  boardPresenter.createPoint();
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
      statisticsComponent = new StatisticsView(stationModel.getPoints());
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
      stationModel.setPoints(UpdateType.INIT, points);
      infoPresenter.init();
      filterPresenter.init();
    });
  })
  .catch(() => {
    setToast(OfflineMessage.LOADING);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(OFFLINE_TITLE, '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  setToast(OfflineMessage.CONNECTION);
  document.title += OFFLINE_TITLE;
});
