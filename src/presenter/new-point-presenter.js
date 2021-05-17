import EditPointView from '../view/edit-point-view.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { UserAction, UpdateType, OfflineMessage, EvtKey } from '../const.js';
import { isOnline, setToast } from '../utils/common.js';

export default class NewPointPresenter {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._pointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._pointEditComponent = new EditPointView();
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointEditComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    if (!isOnline()) {
      setToast(OfflineMessage.EDIT);
      return;
    }

    this._changeData(UserAction.ADD_POINT, UpdateType.MINOR, point);
    this.destroy();
  }

  _handleDeleteClick() {
    if (!isOnline()) {
      setToast(OfflineMessage.DELETE);
      return;
    }

    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (!isOnline()) {
      setToast(OfflineMessage.EDIT);
      return;
    }

    if (evt.key === EvtKey.ESCAPE || evt.key === EvtKey.ESC) {
      evt.preventDefault();
      this._pointEditComponent._removeDisabledButtonNewEvent();
      this.destroy();
    }
  }
}
