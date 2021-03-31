import { createInfoTemplate } from './view/info.js';
import { createMenuTemplate } from './view/menu.js';
import { createFilterTemplate } from './view/filter.js';
import { createSortTemplate } from './view/sort.js';
import { createPointTemplate } from './view/point.js';
import { createNewPointTemplate } from './view/new-point.js';
import { createEditPointTemplate } from './view/edit-point.js';

const POINT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector('.page-body');
const infoElement = mainElement.querySelector('.trip-main');
const menuElement = mainElement.querySelector('.trip-controls__navigation');
const filterElement = mainElement.querySelector('.trip-controls__filters');
const tripElement = mainElement.querySelector('.trip-events');

render(infoElement, createInfoTemplate(), 'afterbegin');
render(menuElement, createMenuTemplate(), 'beforeend');
render(filterElement, createFilterTemplate(), 'beforeend');
render(tripElement, createSortTemplate(), 'beforeend');

const tripListElement = document.createElement('ul');
tripListElement.classList.add('trip-events__list');
tripElement.appendChild(tripListElement);

render(tripListElement, createEditPointTemplate(), 'beforeend');
render(tripListElement, createNewPointTemplate(), 'beforeend');

for (let i = 0; i < POINT_COUNT; i++) {
  render(tripListElement, createPointTemplate(), 'beforeend');
}
