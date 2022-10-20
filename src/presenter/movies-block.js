import SortView from '../view/sort.js';
import FilmsView from '../view/films.js';
import FilmsListAllView from '../view/films-list-all.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListTopRatedView from '../view/films-list-top-rated.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented.js';
import LoadingView from '../view/loading.js';
import MoviePresenter from './movie.js';
import NoMoviesPresenter from './no-movies.js';
import CommentsModel from '../model/comments.js';
import { render, remove } from '../utils/render.js';
import { sortFilmsDate, sortFilmsRating, getExtraFilms } from '../utils/films.js';
import { SortType, UpdateType, UserAction, PopupAction, ExtraType, PopupViewState, UpdateStage } from '../const.js';
import { filter } from '../utils/filter.js';
import { isOnline } from '../utils/common.js';
import { toast } from '../utils/toast.js';

const CARD_COUNT_STEP = 5;
const EXTRA_CARD_COUNT = 2;

const ListType = {
  ALL: 'all',
  TOPRATED: 'topRated',
  MOSTCOMMENTED: 'mostCommented',
};

const Warning = {
  NOT_ACTUAL: 'Offline mode! List of comments may not be actual.',
  NOT_LOADED: 'Offline mode! Comments have not been loaded.',
  NOT_DELETE: 'You can\'t delete comment offline',
  NOT_SUBMIT: 'You can\'t submit comment offline',
};

export default class MoviesBlock {
  constructor(moviesBlockContainer, filmsModel, filterModel, api) {
    this._moviesBlockContainer = moviesBlockContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._commentsModel = new CommentsModel();

    this._renderedCardsCount = CARD_COUNT_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._moviePresentersStorage = {
      [ListType.ALL]: {},
      [ListType.TOPRATED]: {},
      [ListType.MOSTCOMMENTED]: {},
    };

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._noMoviesPresenter = null;
    this._popupMoviePresenter = null;
    this._topRatedFilms = null;
    this._mostCommentedFilms = null;

    this._filmsComponent = new FilmsView();
    this._filmsListAllComponent = new FilmsListAllView();
    this._filmsListTopRatedComponent = new FilmsListTopRatedView();
    this._filmsListMostCommentedComponent = new FilmsListMostCommentedView();
    this._loadingComponent = new LoadingView();

    this._filmsListContainer = {
      [ListType.ALL]: this._filmsListAllComponent.getContainer(),
      [ListType.TOPRATED]: this._filmsListTopRatedComponent.getContainer(),
      [ListType.MOSTCOMMENTED]: this._filmsListMostCommentedComponent.getContainer(),
    };

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlePopupMode = this._handlePopupMode.bind(this);
    this._handleShowMoreButton = this._handleShowMoreButton.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._renderMoviesBlock();

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearMoviesBlock({resetRenderedCardsCount: true, resetSortType: true});

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms().slice();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortFilmsDate);
      case SortType.RAITING:
        return filtredFilms.sort(sortFilmsRating);
    }

    return filtredFilms;
  }

  _getComments() {
    return this._commentsModel.getComments();
  }

  _getExtraFilms(extraFilms, count, extraType){
    const allFilms = this._filmsModel.getFilms();

    if (extraFilms === null) {
      return getExtraFilms(allFilms, count, extraType);
    }

    return extraFilms.map((extraFilm) => allFilms.find((film) => film.id === extraFilm.id));
  }

  _renderLoading() {
    render(this._moviesBlockContainer, this._loadingComponent);
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

  _renderCard(listType, film) {
    const moviePresenter = new MoviePresenter(this._handleViewAction, this._handlePopupMode);
    moviePresenter.initFilmCard(this._filmsListContainer[listType], film);

    this._moviePresentersStorage[listType][film.id] = moviePresenter;
  }

  _renderCards(listType, films) {
    films.forEach((film) => this._renderCard(listType, film));
  }

  _renderFilmsListAll() {
    render(this._filmsComponent, this._filmsListAllComponent);
    render(this._filmsListAllComponent, this._filmsListContainer[ListType.ALL]);

    const films = this._getFilms();
    const filmsCount = films.length;
    this._renderCards(ListType.ALL, films.slice(0, Math.min(filmsCount, this._renderedCardsCount)));

    if (filmsCount > this._renderedCardsCount) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmsListExtra(films, filmsListExtraComponent, listType) {
    render(this._filmsComponent, filmsListExtraComponent);

    if (films.length !== 0) {
      render(filmsListExtraComponent, this._filmsListContainer[listType]);
      this._renderCards(listType, films);
    }
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

    this._renderCards(ListType.ALL, films);

    this._renderedCardsCount = newRenderedCardsCount;
    if (this._renderedCardsCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _clearMoviesPresenters(listType) {
    Object
      .values(this._moviePresentersStorage[listType])
      .forEach((presenter) => presenter.destroyFilmCard());

    this._moviePresentersStorage[listType] = {};
  }

  _clearMoviePresentersStorage() {
    Object
      .keys(this._moviePresentersStorage)
      .forEach((listType) => this._clearMoviesPresenters(listType));
  }

  _renderMoviesBlock() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const filmsCount = this._getFilms().length;
    const allFilms = this._filmsModel.getFilms();

    if (filmsCount !== 0) {
      this._renderSort();
    }

    render(this._moviesBlockContainer, this._filmsComponent);

    if (filmsCount === 0) {
      this._renderNoMovies();
    } else {
      this._renderFilmsListAll();
    }

    if (allFilms.length !== 0) {
      this._topRatedFilms = this._getExtraFilms(this._topRatedFilms, EXTRA_CARD_COUNT, ExtraType.TOPRATED);
      this._mostCommentedFilms = this._getExtraFilms(this._mostCommentedFilms, EXTRA_CARD_COUNT, ExtraType.MOSTCOMMENTED);

      if (this._topRatedFilms.length !== 0 || this._mostCommentedFilms.length !== 0) {
        this._renderFilmsListExtra(this._topRatedFilms, this._filmsListTopRatedComponent, ListType.TOPRATED);
        this._renderFilmsListExtra(this._mostCommentedFilms, this._filmsListMostCommentedComponent, ListType.MOSTCOMMENTED);
      }
    }

    if (this._popupMoviePresenter !== null) {
      const popupFilm = allFilms.find((film) => film.id === this._popupFilm.id);
      this._popupMoviePresenter.initFilmDetails(popupFilm, this._getComments(), this._isCommentLoading);
    }
  }

  _clearMoviesBlock({resetRenderedCardsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    remove(this._loadingComponent);
    remove(this._sortComponent);
    remove(this._filmsComponent);
    remove(this._showMoreButtonComponent);
    this._clearMoviePresentersStorage();

    if (resetRenderedCardsCount) {
      this._renderedCardsCount = CARD_COUNT_STEP;
    } else {
      if (filmsCount < this._renderedCardsCount) {
        this._renderedCardsCount = filmsCount;
      }
      if (filmsCount > this._renderedCardsCount) {
        this._renderedCardsCount = this._renderedCardsCount % CARD_COUNT_STEP === 0 && this._renderedCardsCount !== 0
          ? this._renderedCardsCount
          : this._renderedCardsCount + filmsCount;
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

  _handlePopupMode(actionType, popupFilm) {
    switch (actionType) {
      case PopupAction.OPEN:
        if (this._popupFilm === popupFilm) {
          return;
        }

        if (this._popupMoviePresenter !== null) {
          this._popupMoviePresenter.closeFilmDetails();
        }

        this._popupFilm = popupFilm;

        this._api.getComments(this._popupFilm)
          .then((comments) => {
            if (!isOnline()) {
              toast(Warning.NOT_ACTUAL);
            }

            this._commentsModel.setComments(comments);
            this._isCommentLoading = true;
          })
          .catch(() => {
            if (!isOnline()) {
              toast(Warning.NOT_LOADED);
            }

            this._commentsModel.setComments([]);
            this._isCommentLoading = false;
          })
          .then(() => {
            this._popupMoviePresenter = new MoviePresenter(this._handleViewAction, this._handlePopupMode);
            this._popupMoviePresenter.initFilmDetails(this._popupFilm, this._getComments(), this._isCommentLoading);
            this._popupMoviePresenter.openFilmDetails();
          });
        break;

      case PopupAction.CLOSE:
        this._popupMoviePresenter.closeFilmDetails();
        this._popupFilm = null;
        this._popupMoviePresenter = null;
        break;
    }
  }

  _handleUpdateStage(stage) {
    Object
      .keys(this._moviePresentersStorage)
      .forEach((listType) => Object
        .values(this._moviePresentersStorage[listType])
        .forEach((presenter) => presenter.setUpdateStage(stage)));

    if (this._popupMoviePresenter !== null) {
      this._popupMoviePresenter.setUpdateStage(stage);
    }
  }

  _handleViewAction(actionType, updateType, updateFilm, updateComment) {
    this._handleUpdateStage(UpdateStage.START);

    switch (actionType) {
      case UserAction.EDIT_FILM:
        this._api
          .updateFilm(updateFilm)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
            this._handleUpdateStage(UpdateStage.END);
          });
        break;

      case UserAction.DELETE_COMMENT:
        this._popupMoviePresenter.setViewState(PopupViewState.DELETING);

        this._api
          .deleteComment(updateFilm, updateComment)
          .then(() => {
            this._commentsModel.deleteComment(updateComment);
            this._filmsModel.updateFilm(updateType, updateFilm);
          })
          .catch(() => {
            if (!isOnline()) {
              toast(Warning.NOT_DELETE);
            }

            this._popupMoviePresenter.setViewState(PopupViewState.ABORTING_DELETE);
          })
          .then(() => {
            this._handleUpdateStage(UpdateStage.END);
          });
        break;

      case UserAction.ADD_COMMENT:
        this._popupMoviePresenter.setViewState(PopupViewState.ADDING);

        this._api
          .addComment(updateFilm, updateComment)
          .then(({film, filmComments}) => {
            this._commentsModel.setComments(filmComments);
            this._filmsModel.updateFilm(updateType, film);
          })
          .catch(() => {
            if (!isOnline()) {
              toast(Warning.NOT_SUBMIT);
            }

            this._popupMoviePresenter.setViewState(PopupViewState.ABORTING_ADD);
          })
          .then(() => {
            this._handleUpdateStage(UpdateStage.END);
          });
        break;
    }
  }

  _handleModelEvent(updateType, film) {
    switch (updateType) {
      case UpdateType.PATCH:
        Object
          .keys(this._moviePresentersStorage)
          .forEach((listType) => {
            if (this._moviePresentersStorage[listType][film.id]) {
              this._moviePresentersStorage[listType][film.id].initFilmCard(this._filmsListContainer[listType], film);
            }
          });

        this._clearMoviesPresenters(ListType.MOSTCOMMENTED);
        remove(this._filmsListMostCommentedComponent);
        this._mostCommentedFilms = getExtraFilms(this._filmsModel.getFilms(), EXTRA_CARD_COUNT, ExtraType.MOSTCOMMENTED);
        this._renderFilmsListExtra(this._mostCommentedFilms, this._filmsListMostCommentedComponent, ListType.MOSTCOMMENTED);

        if (this._popupMoviePresenter !== null) {
          this._popupMoviePresenter.initFilmDetails(film, this._getComments(), this._isCommentLoading);
        }
        break;

      case UpdateType.MINOR:
        this._clearMoviesBlock();
        break;

      case UpdateType.MAJOR:
        this._clearMoviesBlock({resetRenderedCardsCount: true, resetSortType: true});
        break;

      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        break;
    }

    if (updateType !== UpdateType.PATCH) {
      this._renderMoviesBlock();
    }
  }
}

