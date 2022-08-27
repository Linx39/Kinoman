import SortView from '../view/sort';
import FilmsView from '../view/films.js';
import FilmsListAllView from '../view/films-list-all.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListTopRatedView from '../view/films-list-top-rated.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented';
import FilmsListContainerView from '../view/films-list-container';
import MoviePresenter from './movie';
import NoMoviesPresenter from './no-movies.js';
import {render, remove} from '../utils/render.js';
import {sortFilmsDate, sortFilmsRating, sortFilmsComments} from '../utils/film.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import {filter} from '../utils/filter.js';

const CARD_COUNT_STEP = 5;
const EXTRA_CARD_COUNT = 2;
const Mode = {
  CARDS: 'CARDS',
  POPUP: 'POPUP',
};

const StorageType = {
  ALL: 'all',
  TOPRATED: 'topRated',
  MOSTCOMMENTED: 'mostCommented',
};

const MoviePresentersStorage = {
  [StorageType.ALL]: {},
  [StorageType.TOPRATED]: {},
  [StorageType.MOSTCOMMENTED]: {},
};

export default class MoviesBlock {
  constructor(moviesBlockContainer, filmsModel, commentsModel, filterModel) {
    this._moviesBlockContainer = moviesBlockContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._renderedCardsCount = CARD_COUNT_STEP;
    this._moviePresentersStorage = MoviePresentersStorage;
    this._currentSortType = SortType.DEFAULT;
    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._noMoviesPresenter = null;
    this._mode = Mode.CARDS;

    this._filmsComponent = new FilmsView();
    this._filmsListAllComponent = new FilmsListAllView();
    this._filmsListTopRatedComponent = new FilmsListTopRatedView();
    this._filmsListMostCommentedComponent = new FilmsListMostCommentedView();
    this._filmListAllContainer = new FilmsListContainerView();
    this._filmListTopRatedContainer = new FilmsListContainerView();
    this._filmListMostCommentedContainer = new FilmsListContainerView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlePopupOpening = this._handlePopupOpening.bind(this);
    this._handlePopupClosing = this._handlePopupClosing.bind(this);
    this._handleShowMoreButton = this._handleShowMoreButton.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent); //onModelEvent переименовать
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderMoviesBlock();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms().slice(); //в демо проекте здесь нет slice
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortFilmsDate);
      case SortType.RAITING:
        return filtredFilms.sort(sortFilmsRating);
    }

    return filtredFilms;
  }

  _getComments(film = null) {
    if (film === null) {
      return this._commentsModel.getComments();
    }

    return this._commentsModel.getComments()
      .slice()
      .filter((comment) => film.comments.some((id) => id === comment.id));
  }

  _renderNoMovies() {
    this._noMoviesPresenter = new NoMoviesPresenter(this._filmsComponent, this._filterModel);
    this._noMoviesPresenter.init();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeClickListener(this._handleSortTypeChange);

    render(this._moviesBlockContainer, this._sortComponent);
  }

  _renderCard(container, film) {
    const filmComments = this._getComments(film);
    const moviePresenter = new MoviePresenter(this._handleViewAction, this._handlePopupOpening, this._handlePopupClosing);

    moviePresenter.initFilmCard(container, film, filmComments);

    switch (container) {
      case this._filmListAllContainer:
        this._moviePresentersStorage[StorageType.ALL][film.id] = moviePresenter;
        break;
      case this._filmListTopRatedContainer:
        this._moviePresentersStorage[StorageType.TOPRATED][film.id] = moviePresenter;
        break;
      case this._filmListMostCommentedContainer:
        this._moviePresentersStorage[StorageType.MOSTCOMMENTED][film.id] = moviePresenter;
        break;
    }
  }

  _renderCards(container, films) {
    films.forEach((film) => this._renderCard(container, film));
  }

  _renderFilmsListAll() {
    render(this._filmsComponent, this._filmsListAllComponent);
    render(this._filmsListAllComponent, this._filmListAllContainer);

    const films = this._getFilms();
    const filmsCount = films.length;
    this._renderCards(this._filmListAllContainer, films.slice(0, Math.min(filmsCount, this._renderedCardsCount)));

    if (filmsCount > this._renderedCardsCount) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsListTopRated() {
    render(this._filmsComponent, this._filmsListTopRatedComponent);
    render(this._filmsListTopRatedComponent, this._filmListTopRatedContainer);

    const films = this._filmsModel.getFilms().slice().sort(sortFilmsRating).slice(0, EXTRA_CARD_COUNT);
    this._renderCards(this._filmListTopRatedContainer, films);
  }

  _renderFilmsListMostCommented() {
    render(this._filmsComponent, this._filmsListMostCommentedComponent);
    render(this._filmsListMostCommentedComponent, this._filmListMostCommentedContainer);

    const films = this._filmsModel.getFilms().slice().sort(sortFilmsComments).slice(0, EXTRA_CARD_COUNT);
    this._renderCards(this._filmListMostCommentedContainer, films);
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setShowMoreButtonClickListener(this._handleShowMoreButton);

    render(this._filmsListAllComponent, this._showMoreButtonComponent);
  }

  _handleShowMoreButton() {
    const filmsCount = this._getFilms().length;
    const newRenderedCardsCount = Math.min(filmsCount, this._renderedCardsCount + CARD_COUNT_STEP);
    const films = this._getFilms().slice(this._renderedCardsCount, newRenderedCardsCount);

    this._renderCards(this._filmListAllContainer, films);

    this._renderedCardsCount = newRenderedCardsCount;
    if (this._renderedCardsCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _clearFilmsLists() {
    Object
      .keys(this._moviePresentersStorage)
      .forEach((key) => Object
        .values(this._moviePresentersStorage[key])
        .forEach((presenter) => presenter.destroyFilmCard()));

    this._moviePresentersStorage = MoviePresentersStorage;
  }

  _renderMoviesBlock() {
    const filmsCount = this._getFilms().length;
    const totalFilmsCount = this._filmsModel.getFilms().length;

    if (filmsCount !== 0) {
      this._renderSort();
    }

    render(this._moviesBlockContainer, this._filmsComponent);

    if (filmsCount === 0) {
      this._renderNoMovies();
    } else {
      this._renderFilmsListAll();
    }

    if (totalFilmsCount !== 0) {
      this._renderFilmsListTopRated();
      this._renderFilmsListMostCommented();
    }

    if (this._mode === Mode.POPUP) {
      const popupFilmId = this._popupFilm.id;
      const popupFilm = this._filmsModel.getFilms().find((film) => film.id === popupFilmId);
      this._popupMoviePresenter.initFilmDetails(popupFilm, this._getComments(popupFilm));
    }
  }

  _clearMoviesBlock({resetRenderedCardsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    remove(this._sortComponent);
    this._clearFilmsLists();
    remove(this._showMoreButtonComponent);
    remove(this._filmsComponent);

    if (resetRenderedCardsCount) {
      this._renderedCardsCount = CARD_COUNT_STEP;
    } else {
      if (filmsCount < this._renderedCardsCount) {
        this._renderedCardsCount = filmsCount;
      } else {
        this._renderedCardsCount = this._renderedCardsCount%CARD_COUNT_STEP === 0
          ? this._renderedCardsCount
          : this._renderedCardsCount + 1;
      }
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMoviesBlock({resetRenderedCardsCount: true});
    this._renderMoviesBlock();
  }

  _handlePopupOpening(popupFilm) {
    if (this._mode === Mode.POPUP) {
      this._popupMoviePresenter.closeFilmDetails();
    }
    this._mode = Mode.POPUP;
    this._popupFilm = popupFilm;

    this._popupMoviePresenter = new MoviePresenter(this._handleViewAction, this._handlePopupOpening, this._handlePopupClosing);
    this._popupMoviePresenter.initFilmDetails(this._popupFilm, this._getComments(this._popupFilm));
    this._popupMoviePresenter.openFilmDetails();
  }

  _handlePopupClosing() {
    this._mode = Mode.CARDS;
    this._popupMoviePresenter = null;
  }

  _handleViewAction(actionType, updateType, updateFilm, updateComment) {
    switch (actionType) {
      case UserAction.EDITFILM:
        this._filmsModel.editFilm(updateType, updateFilm);
        break;
      case UserAction.ADDCOMMENT:
        this._commentsModel.addComment(UpdateType.NOTHING, updateComment);
        this._filmsModel.editFilm(updateType, updateFilm);
        break;
      case UserAction.DELETECOMMENT:
        this._commentsModel.deleteComment(UpdateType.NOTHING, updateComment);
        this._filmsModel.editFilm(updateType, updateFilm);
        break;
    }
  }

  _handleModelEvent(updateType, film) {
    switch (updateType) {
      case UpdateType.NOTHING:
        break;
      case UpdateType.PATCH:
        Object
          .keys(this._moviePresentersStorage)
          .forEach((key) => {
            const storage = this._moviePresentersStorage[key];
            if (storage[film.id]) {
              storage[film.id].initFilmCard(film, this._getComments(film));//тут неправильные параметры, первый - контейнер
            }
          });
        this._popupMoviePresenter.initFilmDetails(film, this._getComments(film));
        break;
      case UpdateType.MINOR:
        this._clearMoviesBlock();
        this._renderMoviesBlock();
        break;
      case UpdateType.MAJOR:
        this._clearMoviesBlock({resetRenderedCardsCount: true, resetSortType: true});
        this._renderMoviesBlock();
        break;
    }
  }
}

