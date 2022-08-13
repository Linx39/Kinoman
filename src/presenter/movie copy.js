import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import FilmDetailsFormView from '../view/film-details-form.js';
import FilmDetailsTopView from '../view/film-details-top.js';
import FilmDetailsBottomView from '../view/film-details-bottom.js';
import { isEscEvent } from '../utils/common.js';
import { render, remove, close, open, replace } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  CARD: 'CARD',
  DETAILS: 'DETAILS',
};

export default class Movie {
  constructor (filmCardContainer, changeData, changeMode, getFilmId) {
    this._filmCardContainer = filmCardContainer;
    this._changeData = changeData;

    this._changeMode = changeMode;
    this._getFilmId = getFilmId;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._filmDetailsTopComponent = null;
    this._mode = Mode.CARD;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
  }

  init(film, filmComments) {
    this._film = film;
    this._filmComments = filmComments;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmCardComponent.setClickFilmDetailsHandler(this._handleFilmCardClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmCardComponent === null) {
      render(this._filmCardContainer, this._filmCardComponent);
      return;
    }

    replace(this._filmCardComponent, prevFilmCardComponent);
    remove(prevFilmCardComponent);

    if (this._mode === Mode.DETAILS) {
      const prevFilmDetailsComponent = this._filmDetailsComponent;
      this._initFilmDetails();
      this._renderFilmDetails();
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
      remove(prevFilmDetailsComponent);
    }
  }

  _initFilmDetails() {
    this._filmDetailsComponent = new FilmDetailsView();
    this._filmDetailsFormComponent = new FilmDetailsFormView();

    this._initFilmDetailsTop();
    this._initFilmDetailsBottom();
  }

  _initFilmDetailsTop() {
    this._filmDetailsTopComponent = new FilmDetailsTopView(this._film);
    this._filmDetailsTopComponent.setClickButtonCloseHandler(this._handleButtonCloseClick);
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

  resetFilmDetailsView() {
    if (this._mode !== Mode.CARD) {
      this._closeFilmDetails();
    }
  }

  destroy() {
    
    this.resetFilmDetailsView();
    if (this._filmDetailsComponent !== null) {
      remove(this._filmDetailsComponent);
    }

    remove(this._filmCardComponent);
  }

  _closeFilmDetails() {
    close(this._filmDetailsComponent);
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._mode = Mode.CARD;
  }

  _openFilmDetails() {
    this._changeMode();
    this._initFilmDetails();
    this._renderFilmDetails();
    open(this._filmDetailsComponent);
    document.addEventListener('keydown', this._handleEscKeyDown);
    this._mode = Mode.DETAILS;
  }

  _handleEscKeyDown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }

  _handleFilmCardClick () {
    this._getFilmId(this._film);
    this._openFilmDetails();
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.EDITFILM,
      UpdateType.PATCH,
      Object.assign({}, this._film, {watchlist: !this._film.watchlist}),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      UserAction.EDITFILM,
      UpdateType.PATCH,
      Object.assign({}, this._film, {watched: !this._film.watched}),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.EDITFILM,
      UpdateType.PATCH,
      Object.assign({}, this._film, {favorite: !this._film.favorite}),
    );
  }

  _handleCommentDeleteClick(film, comment) {
    this._changeData(
      UserAction.DELETECOMMENT,
      UpdateType.MINOR,
      film,
      comment,
    );
  }

  _handleButtonCloseClick() {
    this._closeFilmDetails();
  }
}
