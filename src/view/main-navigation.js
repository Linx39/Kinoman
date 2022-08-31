import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const ITEM_ACTIVE_CLASS = 'main-navigation__item--active';
const ADDITIONAL_ACTIVE_CLASS = 'main-navigation__additional--active';

const createMainNavigationItemTemplate = (item, currentFilterType) => {
  const {type, name, count} = item;

  return (
    `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? ITEM_ACTIVE_CLASS : ''}" data-type = ${type}>${name}
      ${type !== FilterType.ALL? `<span class="main-navigation__item-count" data-type = ${type}>${count}</span>` : ''}
    </a>`);
};

const createMainNavigationTemplate = (filters, currentFilterType) => {
  const mainNavigationItemsTemplate = filters
    .map((item) => createMainNavigationItemTemplate(item, currentFilterType))
    .slice()
    .join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${mainNavigationItemsTemplate}
      </div>
      
      <a href="#stats" class="main-navigation__additional ${currentFilterType === null ? ADDITIONAL_ACTIVE_CLASS : ''}">Stats</a>
    </nav>`);
};

export default class MainNavigation extends AbstractView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;

    this._onFilterItemClick = this._onFilterItemClick.bind(this);
    this._onStatsClick = this._onStatsClick.bind(this);
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters, this._currentFilter);
  }

  _onFilterItemClick(evt) {
    if (!evt.target.classList.contains('main-navigation__item') && !evt.target.classList.contains('main-navigation__item-count')) {
      return;
    }
    evt.preventDefault();

    this._callback.filterItemClick(evt.target.dataset.type);
  }

  setFilterItemClickListener(callback) {
    this._callback.filterItemClick = callback;
    this.getElement()
      .querySelector('.main-navigation__items')
      .addEventListener('click', this._onFilterItemClick);
  }

  _onStatsClick(evt) {
    evt.preventDefault();

    this._callback.statsClick();
  }

  setStatsClickListener(callback) {
    this._callback.statsClick = callback;
    this.getElement()
      .querySelector('.main-navigation__additional')
      .addEventListener('click', this._onStatsClick);
  }
}
