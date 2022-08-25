import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import FilmDetailsFormView from '../view/film-details-form.js';
import FilmDetailsTopView from '../view/film-details-top.js';
import FilmDetailsBottomView from '../view/film-details-bottom.js';
import {isEscEvent, isCtrlEnterEvent} from '../utils/common.js';
import {render, remove, replace, close, open} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class Movie {
  constructor (changeData, changeModeOpenedPopup, changeModeClosedPopup) {
    this._changeData = changeData;
    this._changeModeOpenedPopup = changeModeOpenedPopup;
    this._changeModeClosedPopup = changeModeClosedPopup;

    this._film = null;
    this._filmComments = null;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._filmDetailsTopComponent = null;
    this._filmDetailsBottomComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
    this._handleCtrlEnterDown = this._handleCtrlEnterDown.bind(this);
  }

  initFilmCard(filmCardContainer, film, filmComments) {
    this._filmCardContainer = filmCardContainer;
    this._film = film;
    this._filmComments = filmComments;

    const filmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(this._film);
    this._filmCardComponent.setFilmDetailsClickHandler(this._handleFilmCardClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

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

    const filmDetailsTopComponent = this._filmDetailsTopComponent;
    const filmDetailsBottomComponent = this._filmDetailsBottomComponent;

    this._filmDetailsTopComponent = new FilmDetailsTopView(this._film);
    this._filmDetailsTopComponent.setButtonCloseClickHandler(this._handleButtonCloseClick);
    this._filmDetailsTopComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmDetailsTopComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsTopComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmDetailsBottomComponent = new FilmDetailsBottomView(this._filmComments);
    this._filmDetailsBottomComponent.setCommentDeleteClickHandler(this._handleCommentDeleteClick);

    if (filmDetailsTopComponent === null || filmDetailsBottomComponent === null) {
      this._filmDetailsComponent = new FilmDetailsView();
      this._filmDetailsFormComponent = new FilmDetailsFormView();
      render(this._filmDetailsComponent, this._filmDetailsFormComponent);
      render(this._filmDetailsFormComponent, this._filmDetailsTopComponent);
      render(this._filmDetailsFormComponent, this._filmDetailsBottomComponent);
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

  closeFilmDetails() {
    this._changeModeClosedPopup();
    close(this._filmDetailsComponent);
    document.removeEventListener('keydown', this._handleEscKeyDown);
    document.removeEventListener('keydown', this._handleCtrlEnterDown);
    remove(this._filmDetailsComponent);
  }

  openFilmDetails() {
    open(this._filmDetailsComponent);
    document.addEventListener('keydown', this._handleEscKeyDown);
    document.addEventListener('keydown', this._handleCtrlEnterDown);
  }

  _handleEscKeyDown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.closeFilmDetails();
    }
  }

  _handleFilmCardClick () {
    this._changeModeOpenedPopup(this._film);
  }

  _handleCtrlEnterDown(evt) {
    if (isCtrlEnterEvent(evt)) {
      evt.preventDefault();
      console.log ('CtrEnter');
    }
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.EDITFILM,
      UpdateType.MINOR,
      {...this._film, watchlist: !this._film.watchlist},
    );
  }

  _handleWatchedClick() {
    this._changeData(
      UserAction.EDITFILM,
      UpdateType.MINOR,
      {...this._film, watched: !this._film.watched},
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.EDITFILM,
      UpdateType.MINOR,
      {...this._film, favorite: !this._film.favorite},
    );
  }

  _handleCommentDeleteClick(commentId) {
    const index = this._film.comments.findIndex((id) => id === commentId);
    this._film.comments = [
      ...this._film.comments.slice(0, index),
      ...this._film.comments.slice(index + 1),
    ];

    this._changeData(
      UserAction.DELETECOMMENT,
      UpdateType.MINOR,
      this._film,
      commentId,
    );
  }

  _handleButtonCloseClick() {
    this.closeFilmDetails();
  }
}
