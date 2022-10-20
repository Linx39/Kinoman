import MainNavigationView from '../view/main-navigation.js';
import { render, replace, remove } from '../utils/render.js';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType, NavigationMode } from '../const.js';

export default class MainNavigation {
  constructor(mainNavigationContainer, filterModel, filmsModel, changeNavigationMode) {
    this._mainNavigationContainer = mainNavigationContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._changeNavigationMode = changeNavigationMode;

    this._mainNavigationComponent = null;
    this._currentNavigationMode = NavigationMode.FILTER;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
    this._handleStatsClick = this._handleStatsClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevMainNavigationComponent = this._mainNavigationComponent;

    this._currentFilterType = null;

    if (this._currentNavigationMode === NavigationMode.FILTER) {
      this._currentFilterType = this._filterModel.getFilter();
    }

    this._mainNavigationComponent = new MainNavigationView(filters, this._currentFilterType);

    this._mainNavigationComponent.setFilterItemClickListener(this._handleFilterItemClick);
    this._mainNavigationComponent.setStatsClickListener(this._handleStatsClick);

    if (prevMainNavigationComponent === null) {
      render(this._mainNavigationContainer, this._mainNavigationComponent);
      return;
    }

    replace(this._mainNavigationComponent, prevMainNavigationComponent);
    remove(prevMainNavigationComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterItemClick(filterType) {
    if (this._currentNavigationMode === NavigationMode.FILTER && this._filterModel.getFilter() === filterType) {
      return;
    }

    this._currentNavigationMode = NavigationMode.FILTER;
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    this._changeNavigationMode(this._currentNavigationMode);
  }

  _handleStatsClick() {
    if (this._currentNavigationMode === NavigationMode.STATISTICS) {
      return;
    }

    this._currentNavigationMode = NavigationMode.STATISTICS;
    this.init();
    this._changeNavigationMode(this._currentNavigationMode);
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
