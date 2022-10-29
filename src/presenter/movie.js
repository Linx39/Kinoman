import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import { isEscEvent, throwSwitchError } from '../utils/common.js';
import { render, remove, replace, removePopup, renderPopup } from '../utils/render.js';
import { UserAction, UpdateType, PopupAction, ViewState, UpdateStage } from '../const.js';

export default class Movie {
  constructor (changeData, changePopupMode) {
    this._changeData = changeData;
    this._changePopupMode = changePopupMode;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._onDocumentKeydown = this._onDocumentKeydown.bind(this);
    this._handleCommentDelete = this._handleCommentDelete.bind(this);
    this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
  }

  initFilmCard(filmCardContainer, film) {
    this._filmCardContainer = filmCardContainer;
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(this._film);
    this._filmCardComponent.setFilmCardClickListener(this._handleFilmCardClick);
    this._filmCardComponent.setWatchlistClickListener(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedClickListener(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickListener(this._handleFavoriteClick);

    if (prevFilmCardComponent === null) {
      render(this._filmCardContainer, this._filmCardComponent);
      return;
    }

    replace(this._filmCardComponent, prevFilmCardComponent);
    remove(prevFilmCardComponent);
  }

  initFilmDetails(film, filmComments, isCommentLoading) {
    this._film = film;
    this._filmComments = filmComments;

    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmDetailsComponent = new FilmDetailsView(this._film, this._filmComments, isCommentLoading);
    this._filmDetailsComponent.setButtonCloseClickListener(this._handleButtonCloseClick);
    this._filmDetailsComponent.setWatchlistClickListener(this._handleWatchlistClick);
    this._filmDetailsComponent.setWatchedClickListener(this._handleWatchedClick);
    this._filmDetailsComponent.setFavoriteClickListener(this._handleFavoriteClick);

    if (isCommentLoading) {
      this._filmDetailsComponent.setCommentDeleteClickListener(this._handleCommentDelete);
      this._filmDetailsComponent.setCommentSubmitListener(this._handleCommentSubmit);
    }

    if (prevFilmDetailsComponent !== null) {
      const scrollPosition = prevFilmDetailsComponent.getElement().scrollTop;

      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
      remove(prevFilmDetailsComponent);

      this._filmDetailsComponent.getElement().scrollTo(0, scrollPosition);
    }
  }

  destroyFilmCard() {
    remove(this._filmCardComponent);
  }

  destroyFilmDetails() {
    remove(this._filmDetailsComponent);
  }

  setViewState(state) {
    switch (state) {
      case ViewState.CARD_UPDATE:
        this._filmCardComponent.updateFilmState();
        break;
      case ViewState.POPUP_UPDATE:
        this._filmDetailsComponent.updateFilmState();
        break;
      case ViewState.COMMENT_DELETING:
        this._filmDetailsComponent.updateFilmCommentsState();
        break;
      case ViewState.COMMENT_ADDING:
        this._filmDetailsComponent.updateNewCommentState();
        break;
      case ViewState.ABORTING_CARD_UPDATE:
        this._filmCardComponent.abortFilmState();
        break;
      case ViewState.ABORTING_POPUP_UPDATE:
        this._filmDetailsComponent.abortFilmState();
        break;
      case ViewState.ABORTING_COMMENT_DELETE:
        this._filmDetailsComponent.abortFilmCommentsState();
        break;
      case ViewState.ABORTING_COMMENT_ADD:
        this._filmDetailsComponent.abortNewCommentState();
        break;
      default:
        throwSwitchError(state);
    }
  }

  setUpdateStage(stage) {
    switch (stage) {
      case UpdateStage.START:
        this._isUpdating = true;
        break;
      case UpdateStage.END:
        this._isUpdating = false;
        break;
      default:
        throwSwitchError(stage);
    }
  }

  closeFilmDetails() {
    removePopup(this._filmDetailsComponent);
    document.removeEventListener('keydown', this._onDocumentKeydown);
    this._filmDetailsComponent.removeCtrlEnterDownListener();
    this.destroyFilmDetails();
  }

  _handleButtonCloseClick() {
    if (this._isUpdating) {
      return;
    }

    this._changePopupMode(PopupAction.CLOSE);
  }

  _onDocumentKeydown(evt) {
    if (this._isUpdating) {
      return;
    }

    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._changePopupMode(PopupAction.CLOSE);
    }
  }

  openFilmDetails() {
    renderPopup(this._filmDetailsComponent);
    document.addEventListener('keydown', this._onDocumentKeydown);
  }

  _handleFilmCardClick () {
    if (this._isUpdating) {
      return;
    }

    this._changePopupMode(PopupAction.OPEN, this._film);
  }

  _handleWatchlistClick() {
    if (this._isUpdating) {
      return;
    }

    this._changeData(
      UserAction.EDIT_FILM,
      UpdateType.MINOR,
      {...this._film, watchlist: !this._film.watchlist},
    );
  }

  _handleWatchedClick() {
    if (this._isUpdating) {
      return;
    }

    this._changeData(
      UserAction.EDIT_FILM,
      UpdateType.MINOR,
      {...this._film, watched: !this._film.watched, watchingDate: !this._film.watched? Date() : null },
    );
  }

  _handleFavoriteClick() {
    if (this._isUpdating) {
      return;
    }

    this._changeData(
      UserAction.EDIT_FILM,
      UpdateType.MINOR,
      {...this._film, favorite: !this._film.favorite},
    );
  }

  _handleCommentDelete(filmComment) {
    if (this._isUpdating) {
      return;
    }

    const index = this._film.comments.findIndex((id) => id === filmComment.id);
    const updatedComments = this._film.comments.slice();
    updatedComments.splice(index, 1);

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {...this._film, comments: updatedComments},
      filmComment,
    );
  }

  _handleCommentSubmit(newComment) {
    if (newComment.emotion === null || newComment.comment === null) {
      return;
    }

    if (this._isUpdating) {
      return;
    }

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      this._film,
      newComment,
    );
  }
}
