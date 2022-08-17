import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import FilmDetailsFormView from '../view/film-details-form.js';
import FilmDetailsTopView from '../view/film-details-top.js';
import FilmDetailsBottomView from '../view/film-details-bottom.js';
import { isEscEvent } from '../utils/common.js';
import { render, remove, close, open } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';

// const Mode = {
//   CARD: 'CARD',
//   DETAILS: 'DETAILS',
// };

export default class Movie {
  constructor (filmCardContainer, changeData, openPopup, closePopup, changeModePopup) {
    this._filmCardContainer = filmCardContainer;
    this._changeData = changeData;
    this._openPopup = openPopup;
    this._closePopup = closePopup;
    this._changeModePopup = changeModePopup;

    this._film = null;
    this._filmComments = null;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
  }

  initFilmCard(film, filmComments) {
    this._film = film;
    this._filmComments = filmComments;

    this._filmCardComponent = new FilmCardView(this._film);
    this._filmCardComponent.setFilmDetailsClickHandler(this._handleFilmCardClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    render(this._filmCardContainer, this._filmCardComponent);
  }

  initFilmDetails(film, filmComments) {
    this._film = film;
    this._filmComments = filmComments;

    this._filmDetailsComponent = new FilmDetailsView();
    this._filmDetailsFormComponent = new FilmDetailsFormView();

    this._initFilmDetailsTop();
    this._initFilmDetailsBottom();

    this._renderFilmDetails();
  }

  _initFilmDetailsTop() {
    this._filmDetailsTopComponent = new FilmDetailsTopView(this._film);
    this._filmDetailsTopComponent.setButtonCloseClickHandler(this._handleButtonCloseClick);
    this._filmDetailsTopComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmDetailsTopComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsTopComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _initFilmDetailsBottom() {
    this._filmDetailsBottomComponent = new FilmDetailsBottomView(this._filmComments);
    this._filmDetailsBottomComponent.setCommentDeleteClickHandler(this._handleCommentDeleteClick);
  }

  _renderFilmDetails() {
    render(this._filmDetailsComponent, this._filmDetailsFormComponent);
    render(this._filmDetailsFormComponent, this._filmDetailsTopComponent);
    render(this._filmDetailsFormComponent, this._filmDetailsBottomComponent);
  }

  destroyFilmCard() {
    remove(this._filmCardComponent);
  }

  closeFilmDetails() {
    this._closePopup();
    close(this._filmDetailsComponent);
    document.removeEventListener('keydown', this._handleEscKeyDown);
    remove(this._filmDetailsComponent);
  }

  openFilmDetails() {
    open(this._filmDetailsComponent);
    document.addEventListener('keydown', this._handleEscKeyDown);
  }

  _handleEscKeyDown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.closeFilmDetails();
    }
  }

  _handleFilmCardClick () {
    this._openPopup(this._film);
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
