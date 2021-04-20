import AbstractView from './abstract-view.js';

const createPointListTemplate = () => {
  return '<ul class="trip-events__list"></ul>';
};

export default class PointListView extends AbstractView {
  getTemplate() {
    return createPointListTemplate();
  }
}
