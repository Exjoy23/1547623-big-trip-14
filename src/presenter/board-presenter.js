import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from '../presenter/point-presenter.js';
import { updateItem } from '../utils/common.js';
import { render, RenderPosition } from '../utils/render.js';
import { sortPointTime, sortPointPrice } from '../utils/point.js';
import { SortType } from '../const.js';

export default class BoardPresenter {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardPoints) {
    this._boardPoints = boardPoints.slice();
    this._sourcedBoardPoints = boardPoints.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._pointListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((item) => item.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._boardPoints = updateItem(this._boardPoints, updatedPoint);
    this._sourcedBoardPoints = updateItem(this._sourcedBoardPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._boardPoints.sort(sortPointTime);
        break;
      case SortType.PRICE:
        this._boardPoints.sort(sortPointPrice);
        break;
      default:
        this._boardPoints = this._sourcedBoardPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPoints();
    this._renderPoints();
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(
      this._pointListComponent,
      this._handlePointChange,
      this._handleModeChange
    );
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints() {
    this._boardPoints.slice().forEach((item) => this._renderPoint(item));
  }

  _clearPoints() {
    Object.values(this._pointPresenter).forEach((item) => item.destroy());
    this._pointPresenter = {};
  }

  _renderNoPoints() {
    render(this._boardComponent, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (!this._boardPoints.length) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints();
  }
}
