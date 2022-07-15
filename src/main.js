import HeaderProfileView from './view/header-profile.js';
import MainNavigationView from './view/main-navigation.js';
import FooterStatisticsView from './view/footer-statistics.js';
import MoviesListPresenter from './presenter/movies-list.js';
import { createFilmsFilter } from './view/filter.js';
import { render } from './utils/render.js';
import { FILMS_COUNT, COMMENTS_COUNT } from './const.js';
import { generateFilm } from './mock/film';
import { generateComment } from './mock/comment.js';

const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);
const films = new Array(FILMS_COUNT).fill().map(() => generateFilm(comments));

const filmFilters = createFilmsFilter(films);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const moviesListPresenter = new MoviesListPresenter(mainElement);

render(headerElement, new HeaderProfileView(filmFilters));
render(mainElement, new MainNavigationView(filmFilters));

moviesListPresenter.init(films);

render(footerElement, new FooterStatisticsView(films));

export { comments };
