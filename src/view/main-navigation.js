import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const classMainNavigationItemActive = 'main-navigation__item--active';

const createMainNavigationItemTemplate = (item, currentFilterType) => {
  const {type, name, count} = item;

  return (
    `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? classMainNavigationItemActive : ''}" data-type = ${type}>${name}
      ${type !== FilterType.ALL? `<span class="main-navigation__item-count">${count}</span>` : ''}
    </a>`);
};

const createMainNavigationTemplate = (filters, currentFilterType) => {
  const mainNavigationItemsTemplate = filters
    .map((filter) => createMainNavigationItemTemplate(filter, currentFilterType))
    .slice()
    .join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${mainNavigationItemsTemplate}
      </div>
      
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`);
};

export default class MainNavigation extends AbstractView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;

    this._navigationItemChangeHandler = this._navigationItemChangeHandler.bind(this);
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters, this._currentFilter);
  }

  _navigationItemChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();

    this._callback.navigationItemChange(evt.target.dataset.type);
  }

  setNavigationItemChangeHandler(callback) {
    this._callback.navigationItemChange = callback;
    this.getElement()
      .querySelector('.main-navigation__items')
      .addEventListener('click', this._navigationItemChangeHandler);
  }
}
