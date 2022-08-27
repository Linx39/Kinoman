import FooterStatisticsView from './view/footer-statistics.js';
import MoviesBlockPresenter from './presenter/movies-block.js';
import MainNavigationPresenter from './presenter/main-navigation.js';
import HeaderProfilePresenter from './presenter/header-profile.js';
import StatisticView from './view/stats.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import {render } from './utils/render.js';
import { FILMS_COUNT, COMMENTS_COUNT, MenuItem } from './const.js';
import { generateFilm } from './mock/film';
import { generateComment } from './mock/comment.js';

const filmsComments = new Array(COMMENTS_COUNT).fill().map(generateComment);
const films = new Array(FILMS_COUNT).fill().map(() => generateFilm(filmsComments));

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);
const commentsModel = new CommentsModel();
commentsModel.setComments(filmsComments);
const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const headerProfilePresenter = new HeaderProfilePresenter(headerElement, filmsModel);
headerProfilePresenter.init();

const mainNavigationPresenter = new MainNavigationPresenter(mainElement, filterModel, filmsModel);
mainNavigationPresenter.init();

const moviesBlockPresenter = new MoviesBlockPresenter(mainElement, filmsModel, commentsModel, filterModel);
moviesBlockPresenter.init();

const statisticViewComponent = new StatisticView();
render(mainElement, statisticViewComponent);

render(footerElement, new FooterStatisticsView(films));

export { filmsComments };
