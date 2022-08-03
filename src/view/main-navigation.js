import AbstractView from './abstract.js';

const classMainNavigationItemActive = 'main-navigation__item--active';

const createMainNavigationItemTemplate = (item) => {
  const {name, count} = item;
  const capitalizedName = name.slice(0, 1).toUpperCase() + name.slice(1);

  return (
    `<a href="#${name}" class="main-navigation__item">${capitalizedName} 
      <span class="main-navigation__item-count">${count}</span>
    </a>`);
};

const createMainNavigationTemplate = (filters) => {
  const mainNavigationItemsTemplate = filters
    .map((filter) => createMainNavigationItemTemplate(filter))
    .slice(1)
    .join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item ${classMainNavigationItemActive}">All movies</a>
        ${mainNavigationItemsTemplate}
      </div>
      
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`);
};

export default class MainNavigation extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;

    this._navigationItemChangeHandler = this._navigationItemChangeHandler.bind(this);
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters);
  }

  _navigationItemChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();

    for (const item of evt.currentTarget.children) {
      item.classList.remove(classMainNavigationItemActive);
    }
    evt.target.classList.add(classMainNavigationItemActive);

    // this._callback.navigationItemChange(evt.target.dataset.sortType);
  }

  setNavigationItemChangeHandler(callback) {
    this._callback.navigationItemChange = callback;
    this.getElement()
      .querySelector('.main-navigation__items')
      .addEventListener('click', this._navigationItemChangeHandler);
  }
}
