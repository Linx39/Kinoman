import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import FilmDetailsTopView from '../view/film-details-top.js';
import FilmDetailsBottomView from '../view/film-details-bottom.js';
import { isEscEvent} from '../utils/common.js';
import { render, remove, replace, removePopup, renderPopup } from '../utils/render.js';
import { UserAction, UpdateType, PopupAction } from '../const.js';

export default class Movie {
  constructor (changeData, changeModePopup) {
    this._changeData = changeData;
    this._changeModePopup = changeModePopup;

    this._film = null;
    this._filmComments = null;
    this._filmCardComponent = null;
    // this._filmDetailsComponent = null;
    this._filmDetailsTopComponent = null;
    this._filmDetailsBottomComponent = null;

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

    const filmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(this._film);
    this._filmCardComponent.setFilmCardClickListener(this._handleFilmCardClick);
    this._filmCardComponent.setWatchlistClickListener(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedClickListener(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickListener(this._handleFavoriteClick);

    if (filmCardComponent === null) {
      render(this._filmCardContainer, this._filmCardComponent);
      return;
    }

    replace(this._filmCardComponent, filmCardComponent);
    remove(filmCardComponent);
  }

  initFilmDetails(film, filmComments) {
    this._film = film;
    this._filmComments = filmComments;
    this._newComment = {
      comment: null,
      emotion: null,
    };

    const filmDetailsTopComponent = this._filmDetailsTopComponent;
    const filmDetailsBottomComponent = this._filmDetailsBottomComponent;

    this._filmDetailsTopComponent = new FilmDetailsTopView(this._film);
    this._filmDetailsTopComponent.setButtonCloseClickListener(this._handleButtonCloseClick);
    this._filmDetailsTopComponent.setWatchlistClickListener(this._handleWatchlistClick);
    this._filmDetailsTopComponent.setWatchedClickListener(this._handleWatchedClick);
    this._filmDetailsTopComponent.setFavoriteClickListener(this._handleFavoriteClick);

    this._filmDetailsBottomComponent = new FilmDetailsBottomView(this._filmComments, this._newComment);
    this._filmDetailsBottomComponent.setCommentDeleteClickListener(this._handleCommentDelete);
    this._filmDetailsBottomComponent.setCommentSubmitListener(this._handleCommentSubmit);

    if (filmDetailsTopComponent === null || filmDetailsBottomComponent === null) {
      this._filmDetailsComponent = new FilmDetailsView();
      const filmDetailsContainer = this._filmDetailsComponent.getContainer();
      render(filmDetailsContainer, this._filmDetailsTopComponent);
      render(filmDetailsContainer, this._filmDetailsBottomComponent);
      return;
    }

    replace(this._filmDetailsTopComponent, filmDetailsTopComponent);
    replace(this._filmDetailsBottomComponent, filmDetailsBottomComponent);
    remove(filmDetailsTopComponent);
    remove(filmDetailsBottomComponent);
  }

  destroyFilmCard() {
    remove(this._filmCardComponent);
  }

  destroyFilmDetails() {
    remove(this._filmDetailsComponent);
  }

  closeFilmDetails() {
    this._changeModePopup(PopupAction.CLOSE);
    removePopup(this._filmDetailsComponent);
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._filmDetailsBottomComponent.removeCtrlEnterDownListener();
    this.destroyFilmDetails();
  }

  _handleButtonCloseClick() {
    this.closeFilmDetails();
  }

  _handleEscKeyDown(evt) {
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
    this._changeModePopup(PopupAction.OPEN, this._film);
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.EDIT_FILM,
      UpdateType.MINOR,
      {...this._film, watchlist: !this._film.watchlist},
    );
  }

  _handleWatchedClick() {
    this._changeData(
      UserAction.EDIT_FILM,
      UpdateType.MINOR,
      {...this._film, watched: !this._film.watched, watchingDate: !this._film.watched? Date() : null },
    );
  }

  _handleFavoriteClick() {
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
