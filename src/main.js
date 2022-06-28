import HeaderProfileView from './view/header-profile.js';
import MainNavigationView from './view/main-navigation.js';
import SortView from './view/sort.js';
import FilmsView from './view/films.js';
import FilmsListView from './view/films-list.js';
import ShowMoreView from './view/show-more.js';
import FilmsListTopRatedView from './view/films-list-top-rated.js';
import FilmsListMostCommentedView from './view/films-list-most-commented';
import FilmCardView from './view/film-card.js';
import FooterStatisticsView from './view/footer-statistics.js';
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

renderElement(headerElement, new HeaderProfileView(filmFilters).getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new MainNavigationView(filmFilters).getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new FilmsView().getElement(), RenderPosition.BEFOREEND);

const filmsElement = mainElement.querySelector('.films');

renderElement(filmsElement, new FilmsListView().getElement(), RenderPosition.BEFOREEND);
renderElement(filmsElement, new ShowMoreView().getElement(), RenderPosition.BEFOREEND);
renderElement(filmsElement, new FilmsListTopRatedView().getElement(), RenderPosition.BEFOREEND);
renderElement(filmsElement, new FilmsListMostCommentedView().getElement(), RenderPosition.BEFOREEND);

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
    renderElement(filmsListContainerElement, new FilmCardView(films[i]).getElement(), RenderPosition.BEFOREEND);
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
  renderElement(filmsListTopRatedContainerElement, new FilmCardView(films[getRandomInteger(0, films.length-1)]).getElement(), RenderPosition.BEFOREEND);
}

for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
  renderElement(filmsListMostCommentedContainerElement, new FilmCardView(films[getRandomInteger(0, films.length-1)]).getElement(), RenderPosition.BEFOREEND);
}

const filmCardElement = filmsElement.querySelectorAll('.film-card');
filmCardElement.forEach((card) => openFilmDetails(card));

renderElement(footerElement, new FooterStatisticsView(films).getElement(), RenderPosition.BEFOREEND);
