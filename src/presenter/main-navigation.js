import MainNavigationView from '../view/main-navigation.js';
import {render, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class MainNavigation {
  constructor(mainNavigationContainer, filterModel, filmsModel) {
    this._mainNavigationContainer = mainNavigationContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._mainNavigationComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleNavigationItemChange = this._handleNavigationItemChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const mainNavigationComponent = this._mainNavigationComponent;
    const currentFilterType = this._filterModel.getFilter();

    this._mainNavigationComponent = new MainNavigationView(filters, currentFilterType);
    this._mainNavigationComponent.setNavigationItemChangeHandler(this._handleNavigationItemChange);

    if (mainNavigationComponent === null) {
      render(this._mainNavigationContainer, this._mainNavigationComponent);
      return;
    }

    replace(this._mainNavigationComponent, mainNavigationComponent);
    remove(mainNavigationComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleNavigationItemChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}
