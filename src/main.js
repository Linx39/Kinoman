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
import FilmDetailsView from './view/film-details.js';
import { createFilmsFilter, createCommentsFilter } from './view/filter.js';

import { render, RenderPosition } from './util.js';

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

const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

//отрисовка шапки и навигации
render(headerElement, new HeaderProfileView(filmFilters).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new MainNavigationView(filmFilters).getElement(), RenderPosition.BEFOREEND);

//отрисовка сортировки
render(mainElement, new SortView().getElement(), RenderPosition.BEFOREEND);

//отрисовка секции фильмов
const filmsElement = new FilmsView().getElement();
render(mainElement, filmsElement, RenderPosition.BEFOREEND);

//отрисовка секции общего списка фильмов
render(filmsElement, new FilmsListView().getElement(), RenderPosition.BEFOREEND);

//отрисовка кнопки "Show more"
const showMoreComponent = new ShowMoreView();
const showMoreButton = showMoreComponent.getElement();
render(filmsElement, showMoreButton, RenderPosition.BEFOREEND);

//отрисовка секций списков фильмов экстра
render(filmsElement, new FilmsListTopRatedView().getElement(), RenderPosition.BEFOREEND);
render(filmsElement, new FilmsListMostCommentedView().getElement(), RenderPosition.BEFOREEND);

const filmsListContainer = filmsElement.querySelector('.films-list__container');
const filmsListTopRatedContainer = filmsElement.querySelector('[name="Top rated"] .films-list__container');
const filmsListMostCommentedContainer = filmsElement.querySelector('[name="Most commented"] .films-list__container');

//функция отрисовки карточки с фильмом
const renderFilm = (filmsContainer, film) => {
  const filmComponent = new FilmCardView(film);
  const filmDetailsComponent = new FilmDetailsView(film, createCommentsFilter(film, comments));

  let onEscKeyDown = null;

  const openFilmDetails = () => {
    bodyElement.appendChild(filmDetailsComponent.getElement());
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);
  };

  const closeFilmDetails =() => {
    bodyElement.removeChild(filmDetailsComponent.getElement());
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  };

  onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeFilmDetails();
    }
  };

  filmComponent.getElement().querySelector('.film-card__poster').addEventListener('click', () => openFilmDetails());
  filmComponent.getElement().querySelector('.film-card__title').addEventListener('click', () => openFilmDetails());
  filmComponent.getElement().querySelector('.film-card__comments').addEventListener('click', () => openFilmDetails());

  filmDetailsComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => closeFilmDetails());

  render(filmsContainer, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

//функция отрисовки общего списка фильмов
let filmCardElementsCount = 0;
const renderFilmList = (count = 0) => {
  filmCardElementsCount = Math.min(films.length, count + FILM_CARD_COUNT);

  for (let i = count; i < filmCardElementsCount; i++) {
    renderFilm(filmsListContainer, films[i]);
  }

  if (filmCardElementsCount === films.length) {
    showMoreButton.remove();
    showMoreComponent.removeElement();
  }
};

//функция отрисовки фильмов по нажатию кнопки "Show more"
const clickShowMoreButton = () => {
  showMoreButton.addEventListener('click', () => {
    if (filmCardElementsCount < films.length) {
      renderFilmList(filmCardElementsCount);
    }
  });
};

renderFilmList();
clickShowMoreButton();

//отрисовка списков фильмов экстра
for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
  renderFilm(filmsListTopRatedContainer, films[i]);
}
for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
  renderFilm(filmsListMostCommentedContainer, films[i+2]);
}

//отрисовка подвала
render(footerElement, new FooterStatisticsView(films).getElement(), RenderPosition.BEFOREEND);
