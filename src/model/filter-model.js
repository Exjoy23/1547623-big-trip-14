import Observer from '../utils/observer.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observer {
  constructor() {
    super();
    this._active = FilterType.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this._active = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._active;
  }
}
