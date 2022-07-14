import HeaderProfileView from './view/header-profile.js';
import MainNavigationView from './view/main-navigation.js';
import FooterStatisticsView from './view/footer-statistics.js';


import MoviesPresenter from './presenter/movies-list.js';
import { createFilmsFilter, createCommentsFilter } from './view/filter.js';

import { render } from './utils/render.js';
import { FILMS_COUNT, COMMENTS_COUNT } from './const.js';

import { generateFilm } from './mock/film';
import { generateComment } from './mock/comment.js';

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
films.forEach((film, index) => {
  film.id = index + 1;
});

const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);
comments.forEach((comment, index) => {
  comment.id = index + 1;
});

const filmFilters = createFilmsFilter(films);

const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const moviesPresenter = new MoviesPresenter(mainElement);

render(headerElement, new HeaderProfileView(filmFilters));
render(mainElement, new MainNavigationView(filmFilters));

moviesPresenter.init(films);

render(footerElement, new FooterStatisticsView(films));

export { comments };
