import AbstractView from './abstract.js';
import { SortType } from '../const.js';

const SORT_BUTTON_ACTIVE_CLASS = 'sort__button--active';

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? SORT_BUTTON_ACTIVE_CLASS : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? SORT_BUTTON_ACTIVE_CLASS : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.RAITING ? SORT_BUTTON_ACTIVE_CLASS : ''}" data-sort-type="${SortType.RAITING}">Sort by rating</a></li>
  </ul>`);

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;

    this._onSortTypeClick = this._onSortTypeClick.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _onSortTypeClick(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeClick(evt.target.dataset.sortType);
  }

  setSortTypeClickListener(callback) {
    this._callback.sortTypeClick = callback;
    this.getElement().addEventListener('click', this._onSortTypeClick);
  }
}
