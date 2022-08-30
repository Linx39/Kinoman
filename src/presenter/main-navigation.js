import MainNavigationView from '../view/main-navigation.js';
import { render, replace, remove } from '../utils/render.js';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType, ModeNavigation } from '../const.js';

export default class MainNavigation {
  constructor(mainNavigationContainer, filterModel, filmsModel, changeModeNavigation) {
    this._mainNavigationContainer = mainNavigationContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._changeModeNavigation = changeModeNavigation;

    this._mainNavigationComponent = null;
    this._currentModeNavigation = ModeNavigation.FILTER;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterItemClick = this._handleFilterItemClick.bind(this);
    this._handleStatsClick = this._handleStatsClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const mainNavigationComponent = this._mainNavigationComponent;

    let currentFilterType = null;
    if (this._currentModeNavigation === ModeNavigation.FILTER) {
      currentFilterType = this._filterModel.getFilter();
    }

    this._mainNavigationComponent = new MainNavigationView(filters, currentFilterType);
    this._mainNavigationComponent.setFilterItemClickListener(this._handleFilterItemClick);
    this._mainNavigationComponent.setStatsClickListener(this._handleStatsClick);

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

  _handleFilterItemClick(filterType) {
    if (this._currentModeNavigation === ModeNavigation.FILTER && this._filterModel.getFilter() === filterType) {
      return;
    }
    this._currentModeNavigation = ModeNavigation.FILTER;
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    this._changeModeNavigation(this._currentModeNavigation);
  }

  _handleStatsClick() {
    this._currentModeNavigation = ModeNavigation.STATISTICS;
    this.init();
    this._changeModeNavigation(this._currentModeNavigation);
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
