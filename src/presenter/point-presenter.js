import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
};

export default class PointPresenter {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._clickHandler = this._clickHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevPointEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign({}, this._point, { isFavorite: !this._point.isFavorite })
    );
  }

  _replaceCardToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    document.addEventListener('click', this._clickHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
    this._pointEditComponent._removeDisabledButtonNewEvent();
  }

  _replaceFormToCard() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    document.removeEventListener('click', this._clickHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._closeFormWithoutSave(evt);
    }
  }

  _clickHandler(evt) {
    if (evt.target.classList.contains('event__rollup-btn--close')) {
      this._closeFormWithoutSave(evt);
    }
  }

  _closeFormWithoutSave(evt) {
    evt.preventDefault();
    this._pointEditComponent.reset(this._point);
    this._replaceFormToCard();
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit(update) {
    this._changeData(UserAction.UPDATE_POINT, UpdateType.MINOR, update);
  }

  _handleDeleteClick(point) {
    this._changeData(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  }
}
