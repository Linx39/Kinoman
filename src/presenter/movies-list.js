import SortView from '../view/sort';
import NoMoviesView from '../view/no-movies.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListTopRatedView from '../view/films-list-top-rated.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented';

import MoviePresenter from './movie';

import { RenderPosition, render, remove} from '../utils/render.js';

const FILM_CARD_COUNT = 5;
const FILM_EXTRA_CARD_COUNT = 2;

export default class MoviesList {
  constructor(moviesListContainer) {
    this._moviesListContainer = moviesListContainer;
    this._renderCardCount = FILM_CARD_COUNT;
    this._moviePresenter = {};

    this._sortComponent = new SortView();
    this._noMoviesComponent = new NoMoviesView();
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListTopRatedComponent = new FilmsListTopRatedView();
    this._filmsListMostCommentedComponent = new FilmsListMostCommentedView();
    this._showMoreButtonComponent = new ShowMoreButtonView;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films.slice();

    render(this._moviesListContainer, this._filmsComponent);
    render(this._filmsComponent, this._filmsListComponent);
    render(this._filmsComponent, this._filmsListTopRatedComponent);
    render(this._filmsComponent, this._filmsListMostCommentedComponent);

    this._renderMovieList();
  }

  _renderSort() {
    render(this._moviesListContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCard(container, card) {
    const moviePresenter = new MoviePresenter(container);
    moviePresenter.init(card);
    this._moviePresenter[card.id] = moviePresenter;
  }

  _renderCards(container, from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderCard(container, film));
  }

  _renderNoMovies() {
    render(this._moviesListContainer, new NoMoviesView());
  }

  _handleShowMoreButtonClick() {
    this._renderCards(this._filmsListComponent.getContainer(), this._renderCardCount, this._renderCardCount + FILM_CARD_COUNT);
    this._renderCardCount += FILM_CARD_COUNT;

    if (this._renderCardCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmList() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};
    this._renderCardCount = FILM_CARD_COUNT;
    remove(this._showMoreButtonComponent);
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

