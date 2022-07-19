import AbstractView from './abstract.js';
import { SortType } from '../const.js';

const classSortButtonActive = 'sort__button--active';

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button ${classSortButtonActive}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RAITING}">Sort by rating</a></li>
  </ul>`);

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();

    for (const button of evt.currentTarget.children) {
      button.firstChild.classList.remove(classSortButtonActive);
    }
    evt.target.classList.add(classSortButtonActive);

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
