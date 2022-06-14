import { createHeaderProfileTemplate } from './view/header-profile.js';
import { createMainNavigationTemplate } from './view/main-navigation.js';
import { createSortTemplate } from './view/sort.js';
import { createFilmsTemplate } from './view/films.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createFooterStatisticsTemplate } from './view/footer-statistics.js';
import { createFilmDetailsTemplate } from './view/film-details.js';
import { getRandomInteger } from './util/util.js';

import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter.js';

const PLACE_DEFAULT = 'beforeend';

const FILMS_COUNT = 22;
const FILM_CARD_COUNT = 5;
const FILM_EXTRA_CARD_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

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
    render(bodyElement, createFilmDetailsTemplate(films[0]));
    closeFilmDetails();
  });
};

render(headerElement, createHeaderProfileTemplate(filters));
render(mainElement, createMainNavigationTemplate(filters));
render(mainElement, createSortTemplate());
render(mainElement, createFilmsTemplate());

const filmsElement = mainElement.querySelector('.films');
const filmsListElement = mainElement.querySelector('.films-list');
const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

const showMoreButton = filmsElement.querySelector('.films-list__show-more');

const removeShowMoreButton = () => {
  const filmCardElements = filmsListElement.querySelectorAll('.film-card');
  const filmCardElementsCount = filmCardElements.length;

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
    const filmCardElements = filmsListElement.querySelectorAll('.film-card');
    const filmCardElementsCount = filmCardElements.length;

    if (filmCardElementsCount < FILMS_COUNT) {
      filmCardElements.forEach ((card) => filmsListContainerElement.removeChild(card));

      renderFilmList(filmCardElementsCount + FILM_CARD_COUNT);
    }
  });
};

renderFilmList(FILM_CARD_COUNT);
clickShowMoreButton();

const filmsListTopRatedContainerElement = mainElement.querySelector('[name="Top rated"] .films-list__container');
for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
  render(filmsListTopRatedContainerElement, createFilmCardTemplate(films[getRandomInteger(0, FILMS_COUNT-1)]));
}

const filmsListMostCommentedContainerElement = mainElement.querySelector('[name="Most commented"] .films-list__container');
for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
  render(filmsListMostCommentedContainerElement, createFilmCardTemplate(films[getRandomInteger(0, FILMS_COUNT-1)]));
}

const filmCardElement = document.querySelectorAll('.film-card');
filmCardElement.forEach((card) => openFilmDetails(card));

render(footerElement, createFooterStatisticsTemplate(films));
