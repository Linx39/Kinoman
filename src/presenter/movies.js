import SortView from '../view/sort';
import NoMoviesView from '../view/no-movies.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import ShowMoreView from '../view/show-more.js';
import FilmsListTopRatedView from '../view/films-list-top-rated.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';

import { createFilmsFilter, createCommentsFilter } from '../view/filter.js';

import { RenderPosition, render, remove, close, open } from '../utils/render.js';

import { isEscEvent } from '../utils/common.js';

import { comments } from '../main.js';

const FILM_CARD_COUNT = 5;
const FILM_EXTRA_CARD_COUNT = 2;

export default class Movies {
  constructor(moviesContainer) {
    this._moviesContainer = moviesContainer;

    this._sortComponent = new SortView();
    this._noMoviesComponent = new NoMoviesView();
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListTopRatedComponent = new FilmsListTopRatedView();
    this._filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  }

  init(films) {
    this._films = films.slice();

    render(this._moviesContainer, this._filmsComponent);
    render(this._filmsComponent, this._filmsListComponent);
    render(this._filmsComponent, this._filmsListTopRatedComponent);
    render(this._filmsComponent, this._filmsListMostCommentedComponent);

    this._renderMovieList();

  }

  _renderSort() {
    render(this._moviesContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCard(container, card) {
    const filmCardComponent = new FilmCardView(card);
    const filmDetailsComponent = new FilmDetailsView(card, createCommentsFilter(card, comments));

    let onEscKeyDown = null;

    const closeFilmDetails =() => {
      close(filmDetailsComponent);
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const openFilmDetails = () => {
      open(filmDetailsComponent);
      document.addEventListener('keydown', onEscKeyDown);
    };

    onEscKeyDown = (evt) => {
      if (isEscEvent) {
        evt.preventDefault();
        closeFilmDetails();
      }
    };

    filmCardComponent.setClickFilmDetailsHandler(openFilmDetails);
    filmDetailsComponent.setClickButtonCloseHandler(closeFilmDetails);

    render(container, filmCardComponent);
  }

  _renderCards(container, from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderCard(container, film));
  }

  _renderNoMovies() {
    render(this._moviesContainer, new NoMoviesView());
  }

  _renderShowMoreButton() {
    const showMoreComponent = new ShowMoreView();
    render(this._filmsListComponent, showMoreComponent);

    let renderCountStart = FILM_CARD_COUNT;
    const renderList = () => {
      const renderCountEnd = Math.min(this._films.length, renderCountStart + FILM_CARD_COUNT);

      this._renderCards(this._filmsListComponent.getContainer(), renderCountStart, renderCountEnd);

      if (renderCountEnd === this._films.length) {
        remove(showMoreComponent);
      }

      renderCountStart = renderCountEnd;
    };

    showMoreComponent.setClickHandler(renderList);
  }

  _renderFilmList() {
    this._renderCards(this._filmsListComponent.getContainer(), 0, Math.min(this._films.length, FILM_CARD_COUNT));
    if (this._films.length > FILM_CARD_COUNT) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsListTopRated() {
    this._renderCards(this._filmsListTopRatedComponent.getContainer(), 0, FILM_EXTRA_CARD_COUNT);
  }

  _renderFilmsListMostCommented() {
    this._renderCards(this._filmsListMostCommentedComponent.getContainer(), 2, FILM_EXTRA_CARD_COUNT + 2);
  }

  _renderMovieList() {
    if (this._films.length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();
    this._renderFilmList();
    this._renderFilmsListTopRated();
    this._renderFilmsListMostCommented();

  }
}

