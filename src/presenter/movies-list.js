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

const FILM_CARD_COUNT = 5;
const FILM_EXTRA_CARD_COUNT = 2;

export default class MoviesList {
  constructor(moviesListContainer) {
    this._moviesListContainer = moviesListContainer;
    this._renderFilmCardCount = FILM_CARD_COUNT;
    this._moviePresentersAllStorage = {};
    this._moviePresentersTopRatedStorage = {};
    this._moviePresentersMostCommentedStorage = {};

    this._sortComponent = new SortView();
    this._noMoviesComponent = new NoMoviesView();
    this._filmsComponent = new FilmsView();
    this._filmsListAllComponent = new FilmsListAllView();
    this._filmsListTopRatedComponent = new FilmsListTopRatedView();
    this._filmsListMostCommentedComponent = new FilmsListMostCommentedView();
    this._filmListAllContainerComponent = new FilmsListContainerView;
    this._filmListTopRatedContainerComponent = new FilmsListContainerView;
    this._filmListMostCommentedContainerComponent = new FilmsListContainerView;
    this._showMoreButtonComponent = new ShowMoreButtonView;

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films.slice();

    render(this._moviesListContainer, this._filmsComponent);

    render(this._filmsComponent, this._filmsListAllComponent);
    render(this._filmsListAllComponent, this._filmListAllContainerComponent);

    render(this._filmsComponent, this._filmsListTopRatedComponent);
    render(this._filmsListTopRatedComponent, this._filmListTopRatedContainerComponent);

    render(this._filmsComponent, this._filmsListMostCommentedComponent);
    render(this._filmsListMostCommentedComponent, this._filmListMostCommentedContainerComponent);

    this._renderMovieList();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);

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

  _renderSort() {
    render(this._moviesListContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilmCard(filmContainer, film) {
    const moviePresenter = new MoviePresenter(filmContainer, this._handleFilmChange);
    moviePresenter.init(film);

    if (filmContainer === this._filmListAllContainerComponent) {
      this._moviePresentersAllStorage[film.id] = moviePresenter;
    }
    if (filmContainer === this._filmListTopRatedContainerComponent) {
      this._moviePresentersTopRatedStorage[film.id] = moviePresenter;
    }
    if (filmContainer === this._filmListMostCommentedContainerComponent) {
      this._moviePresentersMostCommentedStorage[film.id] = moviePresenter;
    }
  }

  _renderFilmsCards(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(this._filmListAllContainerComponent, film));
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

  _clearFilmList() {
    Object
      .values(this._moviePresentersAllStorage)
      .forEach((presenter) => presenter.destroy());
    this._moviePresentersAllStorage = {};

    Object
      .values(this._moviePresentersTopRatedStorage)
      .forEach((presenter) => presenter.destroy());
    this._moviePresentersTopRatedStorage = {};

    Object
      .values(this._moviePresentersMostCommentedStorage)
      .forEach((presenter) => presenter.destroy());
    this._moviePresentersMostCommentedStorage = {};

    this._renderFilmCardCount = FILM_CARD_COUNT;
    remove(this._showMoreButtonComponent);
  }

  _renderFilmList() {
    this._renderFilmsCards(0, Math.min(this._films.length, FILM_CARD_COUNT));
    if (this._films.length > FILM_CARD_COUNT) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsListTopRated() {
    for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
      const index = getRandomInteger(0, this._films.length-1);
      this._renderFilmCard(this._filmListTopRatedContainerComponent, this._films[index]);
    }
  }

  _renderFilmsListMostCommented() {
    for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
      const index = getRandomInteger(0, this._films.length-1);
      this._renderFilmCard(this._filmListMostCommentedContainerComponent, this._films[index]);
    }
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

