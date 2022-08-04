import SortView from '../view/sort';
import NoMoviesView from '../view/no-movies.js';
import FilmsView from '../view/films.js';
import FilmsListAllView from '../view/films-list-all.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListTopRatedView from '../view/films-list-top-rated.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented';
import FilmsListContainerView from '../view/films-list-container';
import MoviePresenter from './movie';
import { render, remove } from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import { sortFilmsDate, sortFilmsRating, sortFilmsComments } from '../utils/film.js';
import { SortType } from '../const.js';

const FILM_CARD_COUNT = 5;
const FILM_EXTRA_CARD_COUNT = 2;

export default class MoviesBlock {
  constructor(moviesBlockContainer) {
    this._moviesBlockContainer = moviesBlockContainer;
    this._renderFilmCardCount = FILM_CARD_COUNT;
    this._moviePresentersAllStorage = {};
    this._moviePresentersTopRatedStorage = {};
    this._moviePresentersMostCommentedStorage = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._noMoviesComponent = new NoMoviesView();
    this._filmsComponent = new FilmsView();
    this._filmsListAllComponent = new FilmsListAllView();
    this._filmsListTopRatedComponent = new FilmsListTopRatedView();
    this._filmsListMostCommentedComponent = new FilmsListMostCommentedView();
    this._filmListAllContainer = new FilmsListContainerView();
    this._filmListTopRatedContainer = new FilmsListContainerView();
    this._filmListMostCommentedContainer = new FilmsListContainerView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films, filmsComments) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._filmsComments = filmsComments;

    this._renderMoviesBlock();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    if (this._moviePresentersAllStorage[updatedFilm.id]) {
      this._moviePresentersAllStorage[updatedFilm.id].init(updatedFilm, this._filmsComments);
    }
    if (this._moviePresentersTopRatedStorage[updatedFilm.id]) {
      this._moviePresentersTopRatedStorage[updatedFilm.id].init(updatedFilm, this._filmsComments);
    }
    if (this._moviePresentersMostCommentedStorage[updatedFilm.id]) {
      this._moviePresentersMostCommentedStorage[updatedFilm.id].init(updatedFilm, this._filmsComments);
    }
  }

  _handleModeChange() {
    Object
      .values(this._moviePresentersAllStorage)
      .forEach((presenter) => presenter.resetFilmDetailsView());

    Object
      .values(this._moviePresentersTopRatedStorage)
      .forEach((presenter) => presenter.resetFilmDetailsView());

    Object
      .values(this._moviePresentersMostCommentedStorage)
      .forEach((presenter) => presenter.resetFilmDetailsView());
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortFilmsDate);
        break;
      case SortType.RAITING:
        this._films.sort(sortFilmsRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmsListAll();
    this._renderFilmsListAll();
  }

  _renderSort() {
    render(this._moviesBlockContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilms() {
    render(this._moviesBlockContainer, this._filmsComponent);
    render(this._filmsComponent, this._filmsListAllComponent);
    render(this._filmsListAllComponent, this._filmListAllContainer);

    render(this._filmsComponent, this._filmsListTopRatedComponent);
    render(this._filmsListTopRatedComponent, this._filmListTopRatedContainer);

    render(this._filmsComponent, this._filmsListMostCommentedComponent);
    render(this._filmsListMostCommentedComponent, this._filmListMostCommentedContainer);
  }

  _renderFilmCard(filmContainer, film) {
    const moviePresenter = new MoviePresenter(filmContainer, this._handleFilmChange, this._handleModeChange);
    moviePresenter.init(film, this._filmsComments);

    switch (filmContainer) {
      case this._filmListAllContainer:
        this._moviePresentersAllStorage[film.id] = moviePresenter;
        break;
      case this._filmListTopRatedContainer:
        this._moviePresentersTopRatedStorage[film.id] = moviePresenter;
        break;
      case this._filmListMostCommentedContainer:
        this._moviePresentersMostCommentedStorage[film.id] = moviePresenter;
        break;
    }
  }

  _renderFilmsCards(container, films, from, to) {
    films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(container, film));
  }

  _renderNoMovies() {
    render(this._moviesBlockContainer, new NoMoviesView());
  }

  _handleShowMoreButtonClick() {
    this._renderFilmsCards(this._filmListAllContainer, this._films, this._renderFilmCardCount, this._renderFilmCardCount + FILM_CARD_COUNT);
    this._renderFilmCardCount += FILM_CARD_COUNT;

    if (this._renderFilmCardCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListAllComponent, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmsListAll() {
    Object
      .values(this._moviePresentersAllStorage)
      .forEach((presenter) => presenter.destroy());
    this._moviePresentersAllStorage = {};

    this._renderFilmCardCount = FILM_CARD_COUNT;
    remove(this._showMoreButtonComponent);
  }

  _clearFilmsListTopRated() {//нигде не используется
    Object
      .values(this._moviePresentersTopRatedStorage)
      .forEach((presenter) => presenter.destroy());
    this._moviePresentersTopRatedStorage = {};
  }

  _clearFilmsListMostCommented() {//нигде не используется
    Object
      .values(this._moviePresentersMostCommentedStorage)
      .forEach((presenter) => presenter.destroy());
    this._moviePresentersMostCommentedStorage = {};
  }

  _renderFilmsListAll() {
    this._renderFilmsCards(this._filmListAllContainer, this._films, 0, Math.min(this._films.length, FILM_CARD_COUNT));
    if (this._films.length > FILM_CARD_COUNT) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsListTopRated() {
    this._renderFilmsCards(this._filmListTopRatedContainer, this._films.slice().sort(sortFilmsRating), 0, FILM_EXTRA_CARD_COUNT);
  }

  _renderFilmsListMostCommented() {
    this._renderFilmsCards(this._filmListMostCommentedContainer, this._films.slice().sort(sortFilmsComments), 0, FILM_EXTRA_CARD_COUNT);
  }

  _renderMoviesBlock() {
    if (this._films.length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();
    this._renderFilms();
    this._renderFilmsListAll();
    this._renderFilmsListTopRated();
    this._renderFilmsListMostCommented();
  }
}

