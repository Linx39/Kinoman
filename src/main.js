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
import NoMoviesView from './view/no-movies.js';
import FilmDetailsView from './view/film-details.js';
import { createFilmsFilter, createCommentsFilter } from './view/filter.js';

import { isEscEvent } from './utils/common.js';
import { render, removeComponent } from './utils/render.js';
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

//функция рендеринга карточки с фильмом
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
    if (isEscEvent) {
      evt.preventDefault();
      closeFilmDetails();
    }
  };

  filmComponent.setClickFilmDetailsHandler(openFilmDetails);

  filmDetailsComponent.setClickButtonCloseHandler(closeFilmDetails);

  render(filmsContainer, filmComponent);
};

//функция рендеринга основного списка фильмов
const renderFilmsList = (container, button) => {
  let renderCountStart = 0;
  const renderList = () => {
    const renderCountEnd = Math.min(films.length, renderCountStart + FILM_CARD_COUNT);

    films.slice(renderCountStart, renderCountEnd).map((film) => renderFilm(container, film));

    if (renderCountEnd === films.length) {
      removeComponent(button);
    }

    renderCountStart = renderCountEnd;
  };

  renderList();

  button.setClickHandler(renderList);
};

const renderPage = () => {
  render(headerElement, new HeaderProfileView(filmFilters));
  render(mainElement, new MainNavigationView(filmFilters));
  render(footerElement, new FooterStatisticsView(films));

  if (films.length === 0) {
    render(mainElement, new NoMoviesView());
    return;
  }

  render(mainElement, new SortView());

  const filmsElement = new FilmsView();
  render(mainElement, filmsElement);

  const filmsListComponent = new FilmsListView();
  render(filmsElement, filmsListComponent);

  const showMoreComponent = new ShowMoreView();
  render(filmsElement, showMoreComponent);

  const filmsListTopRatedComponent = new FilmsListTopRatedView();
  render(filmsElement, filmsListTopRatedComponent);
  const filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  render(filmsElement, filmsListMostCommentedComponent);

  renderFilmsList(filmsListComponent.getContainer(), showMoreComponent);

  films.slice(0, FILM_EXTRA_CARD_COUNT).map((film) => renderFilm(filmsListTopRatedComponent.getContainer(), film));
  films.slice(2, FILM_EXTRA_CARD_COUNT + 2).map((film) => renderFilm(filmsListMostCommentedComponent.getContainer(), film));
};

renderPage();
