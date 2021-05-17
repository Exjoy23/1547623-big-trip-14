import AbstractView from './abstract-view.js';
import { FilterType } from '../const.js';

const createFilterTemplate = (filters, currentFilterType) => {
  const everythingCount = filters.filter(({ type }) => type === FilterType.EVERYTHING)[0].count;
  const futureCount = filters.filter(({ type }) => type === FilterType.FUTURE)[0].count;
  const pastCount = filters.filter(({ type }) => type === FilterType.PAST)[0].count;

  return `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything"
        ${FilterType.EVERYTHING === currentFilterType ? 'checked' : ''}${everythingCount ? '' : 'disabled'}>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future"
        ${FilterType.FUTURE === currentFilterType ? 'checked' : ''}${futureCount ? '' : 'disabled'}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past"
        ${FilterType.PAST === currentFilterType ? 'checked' : ''}${pastCount ? '' : 'disabled'}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

export default class FilterView extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback._filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback._filterTypeChange(evt.target.value);
  }
}
