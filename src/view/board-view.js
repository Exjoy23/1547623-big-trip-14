import AbstractView from './abstract-view.js';

const createBoardTemplate = () => {
  return `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
  </section>
  `;
};

export default class BoardView extends AbstractView {
  getTemplate() {
    return createBoardTemplate();
  }
}
