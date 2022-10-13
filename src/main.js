import FooterStatisticsView from './view/footer-statistics.js';
import MoviesBlockPresenter from './presenter/movies-block.js';
import MainNavigationPresenter from './presenter/main-navigation.js';
import HeaderProfilePresenter from './presenter/header-profile.js';
import StatisticView from './view/statistic.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import { render, remove } from './utils/render.js';
import { ModeNavigation, UpdateType } from './const.js';
import { isOnline } from './utils/common.js';
import { toast } from './utils/toast.js';

const AUTHORIZATION = 'Basic dfdc214dtrt64dre';
const API_URL = 'https://14.ecmascript.pages.academy/cinemaddict';

const STORE_PREFIX = 'kinoman-localstorage';
const STORE_FILMS = 'films';
const STORE_COMMENTS = 'comments';
const STORE_VER = 'v14';
const STORE_FILMS_NAME = `${STORE_PREFIX}-${STORE_FILMS}-${STORE_VER}`;
const STORE_COMMENTS_NAME = `${STORE_PREFIX}-${STORE_COMMENTS}-${STORE_VER}`;

const Warning = {
  ONLINE: 'All OK! You are online!',
  OFFLINE: 'Warning! Offline mode!',
};
const TITLE_OFFLINE = ' [offline]';

const api = new Api(API_URL, AUTHORIZATION);
const storeFilms = new Store(STORE_FILMS_NAME, window.localStorage);
const storeComments = new Store(STORE_COMMENTS_NAME, window.localStorage);

const apiWithProvider = new Provider(api, storeFilms, storeComments);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const headerProfilePresenter = new HeaderProfilePresenter(headerElement, filmsModel);
const moviesBlockPresenter = new MoviesBlockPresenter(mainElement, filmsModel, filterModel, apiWithProvider);

let statisticComponent = null;

const handleMainNavigationClick = (menuItem) => {
  switch (menuItem) {
    case ModeNavigation.FILTER:
      moviesBlockPresenter.destroy();
      remove(statisticComponent);
      moviesBlockPresenter.init();
      break;
    case ModeNavigation.STATISTICS:
      moviesBlockPresenter.destroy();
      statisticComponent = new StatisticView(filmsModel.getFilms());
      render(mainElement, statisticComponent);
      break;
  }
};

const mainNavigationPresenter = new MainNavigationPresenter(mainElement, filterModel, filmsModel, handleMainNavigationClick);

// headerProfilePresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  })
  .then (() => {
    headerProfilePresenter.init();
    mainNavigationPresenter.init();
    // moviesBlockPresenter.init();
    render(footerElement, new FooterStatisticsView(filmsModel.getFilms()));
  });

moviesBlockPresenter.init();

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');

  if (!isOnline()) {
    toast(Warning.OFFLINE);
    document.title += TITLE_OFFLINE;
  }
});

window.addEventListener('online', () => {
  toast(Warning.ONLINE);
  document.title = document.title.replace(TITLE_OFFLINE, '');

  if (apiWithProvider.getIsSinc()) {
    apiWithProvider.sync();
  }
});

window.addEventListener('offline', () => {
  toast(Warning.OFFLINE);
  document.title += TITLE_OFFLINE;
});
