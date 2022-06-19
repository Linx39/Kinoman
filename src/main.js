import HeaderProfileView from './view/header-profile.js';
import { createMainNavigationTemplate } from './view/main-navigation.js';
import { createSortTemplate } from './view/sort.js';
import { createFilmsTemplate } from './view/films.js';
import { createFilmsListTemplate } from './view/films-list.js';
import { createShowMoreTemplate } from './view/show-more.js';
import { createFilmsListExtraTemplate } from './view/films-list-extra.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createFooterStatisticsTemplate } from './view/footer-statistics.js';
import { createFilmDetailsTemplate } from './view/film-details.js';
import { createFilmsFilter, createCommentsFilter } from './view/filter.js';

import { getRandomInteger, renderTemplate, renderElement, RenderPosition } from './util.js';

import { FILMS_COUNT, COMMENTS_COUNT } from './const.js';

import { generateFilm } from './mock/film';
import { generateComment } from './mock/comment.js';

const FILM_CARD_COUNT = 5;
const FILM_EXTRA_CARD_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
films.forEach((film, index) => {
  film.id = index + 1;
});

const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);
comments.forEach((comment, index) => {
  comment.id = index + 1;
});

const filmFilters = createFilmsFilter(films);
// const commentsFilters = createCommentsFilter(films[0], comments);

const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const closeFilmDetails = () => {
  const filmDetailsElement = document.querySelector('.film-details');
  const filmDetailsCloseButton = filmDetailsElement.querySelector('.film-details__close-btn');
  filmDetailsCloseButton.addEventListener('click', () => bodyElement.removeChild(filmDetailsElement));
};

const openFilmDetails = (card) => {
  card.addEventListener('click', () => {
    renderTemplate(bodyElement, createFilmDetailsTemplate(films[0], createCommentsFilter(films[0], comments)));
    closeFilmDetails();
  });
};

// renderTemplate(headerElement, createHeaderProfileTemplate(filmFilters));
console.log (headerElement);
console.log (new HeaderProfileView(filmFilters).getElement());

renderElement(headerElement, new HeaderProfileView(filmFilters).getElement(), RenderPosition.BEFOREEND);

renderTemplate(mainElement, createMainNavigationTemplate(filmFilters));
renderTemplate(mainElement, createSortTemplate());
renderTemplate(mainElement, createFilmsTemplate());

const filmsElement = mainElement.querySelector('.films');

renderTemplate(filmsElement, createFilmsListTemplate());
renderTemplate(filmsElement,createShowMoreTemplate());
renderTemplate(filmsElement, createFilmsListExtraTemplate());

// const filmsListElement = filmsElement.querySelector('.films-list');
const filmsListContainerElement = filmsElement.querySelector('.films-list__container');
const filmsListTopRatedContainerElement = filmsElement.querySelector('[name="Top rated"] .films-list__container');
const filmsListMostCommentedContainerElement = filmsElement.querySelector('[name="Most commented"] .films-list__container');

const showMoreButton = filmsElement.querySelector('.films-list__show-more');

let filmCardElementsCount = 0;

const removeShowMoreButton = () => filmsElement.removeChild(showMoreButton);

const renderFilmList = (count = 0) => {
  filmCardElementsCount = Math.min(films.length, count + FILM_CARD_COUNT);

  for (let i = count; i < filmCardElementsCount; i++) {
    renderTemplate(filmsListContainerElement, createFilmCardTemplate(films[i]));
  }

  if (filmCardElementsCount === films.length) {
    removeShowMoreButton();
  }
};

const clickShowMoreButton = () => {
  showMoreButton.addEventListener('click', () => {
    if (filmCardElementsCount < films.length) {
      renderFilmList(filmCardElementsCount);
    }
  });
};

renderFilmList();
clickShowMoreButton();

for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
  renderTemplate(filmsListTopRatedContainerElement, createFilmCardTemplate(films[getRandomInteger(0, films.length-1)]));
}

for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
  renderTemplate(filmsListMostCommentedContainerElement, createFilmCardTemplate(films[getRandomInteger(0, films.length-1)]));
}

const filmCardElement = filmsElement.querySelectorAll('.film-card');
filmCardElement.forEach((card) => openFilmDetails(card));

renderTemplate(footerElement, createFooterStatisticsTemplate(films));
