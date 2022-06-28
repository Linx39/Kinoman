import { createElement } from '../util.js';

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    `<a href="#${name}" class="main-navigation__item">${nameCapitalized} 
      <span class="main-navigation__item-count">${count}</span>
    </a>`);
};

const createMainNavigationTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter))
    .slice(1)
    .join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${filterItemsTemplate}
      </div>
      
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`);
};

export default class MainNavigation {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
