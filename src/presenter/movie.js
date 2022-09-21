import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import { isEscEvent} from '../utils/common.js';
import { render, remove, replace, removePopup, renderPopup } from '../utils/render.js';
import { UserAction, UpdateType, PopupAction, PopupViewState } from '../const.js';

export default class Movie {
  constructor (changeData, changeModePopup) {
    this._changeData = changeData;
    this._changeModePopup = changeModePopup;

    // this._film = null;//зачем это и следующая строчка?
    // this._filmComments = null;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
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
      const scrollPositionTop = prevFilmDetailsComponent.getElement().scrollTop;

      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
      remove(prevFilmDetailsComponent);

      this._filmDetailsComponent.getElement().scrollTo(0, scrollPositionTop);
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
      case PopupViewState.EDITING:
        this._filmDetailsComponent.updateFilmState();
        break;
      case PopupViewState.DELETING:
        this._filmDetailsComponent.updateFilmCommentsState();
        break;
      case PopupViewState.ADDING:
        this._filmDetailsComponent.updateNewCommentState();
        break;
      case PopupViewState.ABORTING_EDIT:
        this._filmDetailsComponent.abbortingFilmState();
        break;
      case PopupViewState.ABORTING_DELETE:
        this._filmDetailsComponent.abbortingFilmCommentsState();
        break;
      case PopupViewState.ABORTING_ADD:
        this._filmDetailsComponent.abbortingNewCommentState();
        break;
    }
  }

  setModeUpdateStart() {
    this._updating = true;
  }

  setModeUpdateEnd() {
    this._updating = false;
  }

  closeFilmDetails() {
    this._changeModePopup(PopupAction.CLOSE);
    removePopup(this._filmDetailsComponent);
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._filmDetailsComponent.removeCtrlEnterDownListener();
    this.destroyFilmDetails();
  }

  _handleButtonCloseClick() {
    this.closeFilmDetails();
  }

  _handleEscKeyDown(evt) {
    if (this._updating) {
      return;
    }

    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.closeFilmDetails();
    }
  }

  openFilmDetails() {
    renderPopup(this._filmDetailsComponent);
    document.addEventListener('keydown', this._handleEscKeyDown);
  }

  _handleFilmCardClick () {
    if (this._updating) {
      return;
    }

    this._changeModePopup(PopupAction.OPEN, this._film);
  }

  _handleWatchlistClick() {
    if (this._updating) {
      return;
    }

    this._changeData(
      UserAction.EDIT_FILM,
      UpdateType.MINOR,
      {...this._film, watchlist: !this._film.watchlist},
    );
  }

  _handleWatchedClick() {
    if (this._updating) {
      return;
    }

    this._changeData(
      UserAction.EDIT_FILM,
      UpdateType.MINOR,
      {...this._film, watched: !this._film.watched, watchingDate: !this._film.watched? Date() : null },
    );
  }

  _handleFavoriteClick() {
    if (this._updating) {
      return;
    }

    this._changeData(
      UserAction.EDIT_FILM,
      UpdateType.MINOR,
      {...this._film, favorite: !this._film.favorite},
    );
  }

  _handleCommentDelete(filmComment) {
    const index = this._film.comments.findIndex((id) => id === filmComment.id);
    this._film.comments = [
      ...this._film.comments.slice(0, index),
      ...this._film.comments.slice(index + 1),
    ];

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      this._film,
      filmComment,
    );
  }

  _handleCommentSubmit(newComment) {
    if (newComment.emotion === null || newComment.comment === null) {
      return;
    }

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      this._film,
      newComment,
    );
  }
}
