import { createHeaderProfileTemplate } from './view/header-profile.js';
import { createMainNavigationTemplate } from './view/main-navigation.js';
import { createSortTemplate } from './view/sort.js';
import { createFilmsTemplate } from './view/films.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createFooterStatisticsTemplate } from './view/footer-statistics.js';
import { createFilmDetailsTemplate } from './view/film-details.js';
import { getRandomInteger, removeAllChildren } from './util/util.js';

import { generateFilm } from './mock/film';
import { generateComment } from './mock/comment.js';
import { createFilmsFilter, createCommentsFilter } from './view/filter.js';

import { FILMS_COUNT, COMMENTS_COUNT } from './mock/const.js';

const PLACE_DEFAULT = 'beforeend';
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

const render = (container, template, place = PLACE_DEFAULT) => {
  container.insertAdjacentHTML(place, template);
};

const closeFilmDetails = () => {
  const filmDetailsElement = document.querySelector('.film-details');
  const filmDetailsCloseButton = filmDetailsElement.querySelector('.film-details__close-btn');
  filmDetailsCloseButton.addEventListener('click', () => bodyElement.removeChild(filmDetailsElement));
};

const openFilmDetails = (card) => {
  card.addEventListener('click', () => {
    render(bodyElement, createFilmDetailsTemplate(films[0], createCommentsFilter(films[0], comments)));
    closeFilmDetails();
  });
};

render(headerElement, createHeaderProfileTemplate(filmFilters));
render(mainElement, createMainNavigationTemplate(filmFilters));
render(mainElement, createSortTemplate());
render(mainElement, createFilmsTemplate());

const filmsElement = mainElement.querySelector('.films');
const filmsListElement = mainElement.querySelector('.films-list');
const filmsListContainerElement = mainElement.querySelector('.films-list__container');
const filmsListTopRatedContainerElement = mainElement.querySelector('[name="Top rated"] .films-list__container');
const filmsListMostCommentedContainerElement = mainElement.querySelector('[name="Most commented"] .films-list__container');

const showMoreButton = filmsElement.querySelector('.films-list__show-more');

const removeShowMoreButton = () => {
  const filmCardElementsCount = filmsListElement.querySelectorAll('.film-card').length;

  if (filmCardElementsCount === FILMS_COUNT) {
    filmsElement.removeChild(showMoreButton);
  }
};

const renderFilmList = (count) => {
  if (count > FILMS_COUNT) {
    count = FILMS_COUNT;
  }

  for (let i = 0; i < count; i++) {
    render(filmsListContainerElement, createFilmCardTemplate(films[i]));
  }

  removeShowMoreButton();
};

const clickShowMoreButton = () => {
  showMoreButton.addEventListener('click', () => {
    const filmCardElementsCount = filmsListElement.querySelectorAll('.film-card').length;

    if (filmCardElementsCount < FILMS_COUNT) {
      removeAllChildren(filmsListContainerElement);
      renderFilmList(filmCardElementsCount + FILM_CARD_COUNT);
    }
  });
};

renderFilmList(FILM_CARD_COUNT);
clickShowMoreButton();

for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
  render(filmsListTopRatedContainerElement, createFilmCardTemplate(films[getRandomInteger(0, FILMS_COUNT-1)]));
}

for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
  render(filmsListMostCommentedContainerElement, createFilmCardTemplate(films[getRandomInteger(0, FILMS_COUNT-1)]));
}

const filmCardElement = filmsElement.querySelectorAll('.film-card');
filmCardElement.forEach((card) => openFilmDetails(card));

render(footerElement, createFooterStatisticsTemplate(films));

export { FILMS_COUNT};
