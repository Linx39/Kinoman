import FooterStatisticsView from './view/footer-statistics.js';
import MoviesBlockPresenter from './presenter/movies-block.js';
import MainNavigationPresenter from './presenter/main-navigation.js';
import HeaderProfilePresenter from './presenter/header-profile.js';
import StatisticView from './view/statistic.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import { render, remove } from './utils/render.js';
import { FILMS_COUNT, COMMENTS_COUNT, ModeNavigation } from './const.js';
import { generateFilm } from './mock/films.js';
import { generateComment } from './mock/comment.js';
import { getRandomInteger } from './utils/common.js';

const filmsComments = new Array(COMMENTS_COUNT).fill().map(generateComment);
const films = new Array(FILMS_COUNT).fill().map(generateFilm);
filmsComments.forEach((filmComments) => {
  const index = getRandomInteger(films.length) - 1;
  films[index].comments.push(filmComments.id);
});

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);
const commentsModel = new CommentsModel();
commentsModel.setComments(filmsComments);
const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const headerProfilePresenter = new HeaderProfilePresenter(headerElement, filmsModel);
const moviesBlockPresenter = new MoviesBlockPresenter(mainElement, filmsModel, commentsModel, filterModel);

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
mainNavigationPresenter.init();
moviesBlockPresenter.init();
render(footerElement, new FooterStatisticsView(films));
