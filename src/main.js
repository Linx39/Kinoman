import HeaderProfileView from './view/header-profile.js';
import MainNavigationView from './view/main-navigation.js';
import FooterStatisticsView from './view/footer-statistics.js';
import MoviesBlockPresenter from './presenter/movies-block.js';
import { createFilmsFilter } from './view/filter.js';
import { render } from './utils/render.js';
import { FILMS_COUNT, COMMENTS_COUNT } from './const.js';
import { generateFilm } from './mock/film';
import { generateComment } from './mock/comment.js';

const filmsComments = new Array(COMMENTS_COUNT).fill().map(generateComment);
const films = new Array(FILMS_COUNT).fill().map(() => generateFilm(filmsComments));

const filmFilters = createFilmsFilter(films);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new HeaderProfileView(filmFilters));

const mainNavigationComponent =  new MainNavigationView(filmFilters);
render(mainElement, mainNavigationComponent);
mainNavigationComponent.setNavigationItemChangeHandler();

const moviesBlockPresenter = new MoviesBlockPresenter(mainElement);
moviesBlockPresenter.init(films, filmsComments);

render(footerElement, new FooterStatisticsView(films));

export { filmsComments };
