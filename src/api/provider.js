import StationModel from '../model/station-model.js';
import { isOnline } from '../utils/common.js';

const ErrorMessage = {
  ADD: 'Add point failed',
  DELETE: 'Delete point failed',
  SYNC: 'Sync data failed',
};

const getSyncedPoints = (items) => {
  return items.filter(({ success }) => success).map(({ payload }) => payload.point);
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints().then((points) => {
        const items = points.map(StationModel.adaptToServer);
        this._store.setItems(items);
        return points;
      });
    }

    const storePoints = Object.values(this._store.getItems());

    return Promise.resolve(storePoints.map(StationModel.adaptToClient));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers().then((offers) => {
        return offers;
      });
    }
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations().then((destinations) => {
        return destinations;
      });
    }
  }

  updatePoint(point) {
    if (isOnline()) {
      return this._api.updatePoint(point).then((updatedPoint) => {
        this._store.setItem(updatedPoint.id, StationModel.adaptToServer(updatedPoint));
        return updatedPoint;
      });
    }

    this._store.setItem(point.id, StationModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point).then((newPoint) => {
        this._store.setItem(newPoint.id, StationModel.adaptToServer(newPoint));
        return newPoint;
      });
    }

    return Promise.reject(new Error(ErrorMessage.ADD));
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point).then(() => this._store.removeItem(point.id));
    }

    return Promise.reject(new Error(ErrorMessage.DELETE));
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints).then((response) => {
        const createdPoints = getSyncedPoints(response.created);
        const updatedPoints = getSyncedPoints(response.updated);

        const items = [...createdPoints, ...updatedPoints];

        this._store.setItems(items);
      });
    }

    return Promise.reject(new Error(ErrorMessage.SYNC));
  }
}
