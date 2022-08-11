import HeaderProfileView from './view/header-profile.js';
import MainNavigationView from './view/main-navigation.js';
import FooterStatisticsView from './view/footer-statistics.js';
import MoviesBlockPresenter from './presenter/movies-block.js';
import { createFilmsFilter } from './view/filter.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import { render } from './utils/render.js';
import { FILMS_COUNT, COMMENTS_COUNT } from './const.js';
import { generateFilm } from './mock/film';
import { generateComment } from './mock/comment.js';

const filmsComments = new Array(COMMENTS_COUNT).fill().map(generateComment);
const films = new Array(FILMS_COUNT).fill().map(() => generateFilm(filmsComments));

const filmFilters = createFilmsFilter(films);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);
const commentsModel = new CommentsModel();
commentsModel.setComments(filmsComments);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new HeaderProfileView(filmFilters));

// const mainNavigationComponent =  new MainNavigationView(filmFilters);
render(mainElement, new MainNavigationView(filmFilters));
// mainNavigationComponent.setNavigationItemChangeHandler();

const moviesBlockPresenter = new MoviesBlockPresenter(mainElement, filmsModel, commentsModel);
moviesBlockPresenter.init();

render(footerElement, new FooterStatisticsView(films));

export { filmsComments };
