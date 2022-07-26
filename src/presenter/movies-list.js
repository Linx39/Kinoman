import SortView from '../view/sort';
import NoMoviesView from '../view/no-movies.js';
import FilmsView from '../view/films.js';
import FilmsListAllView from '../view/films-list-all.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListTopRatedView from '../view/films-list-top-rated.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented';
import FilmsListContainerView from '../view/film-list-container';
import MoviePresenter from './movie';
import { RenderPosition, render, remove} from '../utils/render.js';
import { getRandomInteger, updateItem } from '../utils/common.js';
import { sortFilmsDate, sortFilmsRating } from '../utils/film.js';
import { SortType } from '../const.js';

const FILM_CARD_COUNT = 5;
const FILM_EXTRA_CARD_COUNT = 2;

export default class MoviesList {
  constructor(moviesListContainer) {
    this._moviesListContainer = moviesListContainer;
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

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();

    render(this._moviesListContainer, this._filmsComponent);

    render(this._filmsComponent, this._filmsListAllComponent);
    render(this._filmsListAllComponent, this._filmListAllContainer);

    render(this._filmsComponent, this._filmsListTopRatedComponent);
    render(this._filmsListTopRatedComponent, this._filmListTopRatedContainer);

    render(this._filmsComponent, this._filmsListMostCommentedComponent);
    render(this._filmsListMostCommentedComponent, this._filmListMostCommentedContainer);

    this._renderMovieList();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);

    if (this._moviePresentersAllStorage[updatedFilm.id]) {
      this._moviePresentersAllStorage[updatedFilm.id].init(updatedFilm);
    }
    if (this._moviePresentersTopRatedStorage[updatedFilm.id]) {
      this._moviePresentersTopRatedStorage[updatedFilm.id].init(updatedFilm);
    }
    if (this._moviePresentersMostCommentedStorage[updatedFilm.id]) {
      this._moviePresentersMostCommentedStorage[updatedFilm.id].init(updatedFilm);
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
    this._clearFilmsListTopRated();
    this._clearFilmsListMostCommented();
    this._renderFilmsListAll();
    this._renderFilmsListTopRated();          //надо подумать как сделать по другому, тут не надо заново рендерить
    this._renderFilmsListMostCommented();
  }

  _renderSort() {
    render(this._moviesListContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmCard(filmContainer, film) {
    const moviePresenter = new MoviePresenter(filmContainer, this._handleFilmChange, this._handleModeChange);
    moviePresenter.init(film);

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

  _renderFilmsCards(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(this._filmListAllContainer, film));
  }

  _renderNoMovies() {
    render(this._moviesListContainer, new NoMoviesView());
  }

  _handleShowMoreButtonClick() {
    this._renderFilmsCards(this._renderFilmCardCount, this._renderFilmCardCount + FILM_CARD_COUNT);
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

  _clearFilmsListTopRated() {
    Object
      .values(this._moviePresentersTopRatedStorage)
      .forEach((presenter) => presenter.destroy());
    this._moviePresentersTopRatedStorage = {};
  }

  _clearFilmsListMostCommented() {
    Object
      .values(this._moviePresentersMostCommentedStorage)
      .forEach((presenter) => presenter.destroy());
    this._moviePresentersMostCommentedStorage = {};
  }

  _renderFilmsListAll() {
    this._renderFilmsCards(0, Math.min(this._films.length, FILM_CARD_COUNT));
    if (this._films.length > FILM_CARD_COUNT) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsListTopRated() {
    for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
      const index = getRandomInteger(0, this._films.length-1);
      this._renderFilmCard(this._filmListTopRatedContainer, this._films[index]);
    }
  }

  _renderFilmsListMostCommented() {
    for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
      const index = getRandomInteger(0, this._films.length-1);
      this._renderFilmCard(this._filmListMostCommentedContainer, this._films[index]);
    }
  }

  _renderMovieList() {
    if (this._films.length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();
    this._renderFilmsListAll();
    this._renderFilmsListTopRated();
    this._renderFilmsListMostCommented();
  }
}

