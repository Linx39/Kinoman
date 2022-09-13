import FooterStatisticsView from './view/footer-statistics.js';
import MoviesBlockPresenter from './presenter/movies-block.js';
import MainNavigationPresenter from './presenter/main-navigation.js';
import HeaderProfilePresenter from './presenter/header-profile.js';
import StatisticView from './view/statistic.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import Api from './api.js';
import { render, remove } from './utils/render.js';
import { ModeNavigation, UpdateType, AUTHORIZATION, API_URL, Url } from './const.js';

const apiFilms = new Api(API_URL, AUTHORIZATION, Url.MOVIES, FilmsModel);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const headerProfilePresenter = new HeaderProfilePresenter(headerElement, filmsModel);
const moviesBlockPresenter = new MoviesBlockPresenter(mainElement, filmsModel, filterModel, apiFilms);

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

headerProfilePresenter.init();
moviesBlockPresenter.init();
render(footerElement, new FooterStatisticsView(filmsModel.getFilms()));

apiFilms.getData()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    // mainNavigationPresenter.init();
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    // mainNavigationPresenter.init();
  })
  .then (() => {
    mainNavigationPresenter.init();
  });
