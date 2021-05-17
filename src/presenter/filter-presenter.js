import FilterView from '../view/filter-view.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType } from '../const.js';
import { newPointButtonComponent } from '../main.js';

const ATTRIBUTE_DISABLED = 'disabled';

export default class FilterPresenter {
  constructor(filterContainer, filterModel, stationModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._stationModel = stationModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._stationModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  setDisabledFilters() {
    this._filterComponent
      .getElement()
      .querySelectorAll('.trip-filters__filter-input')
      .forEach((item) => {
        item.setAttribute(ATTRIBUTE_DISABLED, true);
      });
  }

  removeDisabledFilters() {
    this._filterComponent
      .getElement()
      .querySelectorAll('.trip-filters__filter-input')
      .forEach((item) => {
        item.removeAttribute(ATTRIBUTE_DISABLED);
      });
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    newPointButtonComponent.removeDisabled();
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const points = this._stationModel.getPoints();

    return [
      {
        type: FilterType.EVERYTHING,
        count: filter[FilterType.EVERYTHING](points).length,
      },
      {
        type: FilterType.FUTURE,
        count: filter[FilterType.FUTURE](points).length,
      },
      {
        type: FilterType.PAST,
        count: filter[FilterType.PAST](points).length,
      },
    ];
  }
}
