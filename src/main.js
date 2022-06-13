import { createHeaderProfileTemplate } from './view/header-profile';
import { createMainNavigationTemplate } from './view/main-navigation';
import { createSortTemplate } from './view/sort';
import { createFilmsTemplate } from './view/films';
import { createFilmCardTemplate } from './view/film-card';
import { createFooterStatisticsTemplate } from './view/footer-statistics';
import { createFilmDetailsTemplate } from './view/film-details';

import { generateFilm } from './mock/film';

const PLACE_DEFAULT = 'beforeend';

const FILMS_COUNT = 30;
const FILM_CARD_COUNT = 5;
const FILM_EXTRA_CARD_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);

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

render(headerElement, createHeaderProfileTemplate(films));
render(mainElement, createMainNavigationTemplate());
render(mainElement, createSortTemplate());
render(mainElement, createFilmsTemplate());

const filmsList = mainElement.querySelector('.films-list');

const filmsListContainer = filmsList.querySelector('.films-list__container');
const renderFilmList = () => {
  for (let i = 0; i < FILM_CARD_COUNT; i++) {
    render(filmsListContainer, createFilmCardTemplate(films[i]));
  }
};

renderFilmList();

const filmsListTopRatedContainer = mainElement.querySelector('[name="Top rated"] .films-list__container');
for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
  render(filmsListTopRatedContainer, createFilmCardTemplate(films[i]));
}

const filmsListMostCommentedContainer = mainElement.querySelector('[name="Most commented"] .films-list__container');
for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
  render(filmsListMostCommentedContainer, createFilmCardTemplate(films[i]));
}

const filmCardElement = document.querySelectorAll('.film-card');
filmCardElement.forEach((card) => openFilmDetails(card));

render(footerElement, createFooterStatisticsTemplate());

