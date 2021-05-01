import AbstractView from './abstract-view.js';
import { FilterType } from '../const.js';

const createFilterTemplate = (filters, currentFilterType) => {
  const everythingCount = filters.filter(({ type }) => type === 'everything')[0].count;
  const futureCount = filters.filter(({ type }) => type === 'future')[0].count;
  const pastCount = filters.filter(({ type }) => type === 'past')[0].count;

  return `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything"
        ${FilterType.EVERYTHING === currentFilterType ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-everything">Everything (${everythingCount})</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future"
        ${FilterType.FUTURE === currentFilterType ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-future">Future (${futureCount})</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past"
        ${FilterType.PAST === currentFilterType ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-past">Past (${pastCount})</label>
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

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback._filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback._filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
