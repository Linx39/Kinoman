import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import { isEscEvent } from '../utils/common.js';
import { render, remove, close, open, replace } from '../utils/render.js';

const Mode = {
  CARD: 'CARD',
  DETAILS: 'DETAILS',
};

export default class Movie {
  constructor (filmCardContainer, changeData, changeMode) {
    this._filmCardContainer = filmCardContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmDetailsContainer = null;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._mode = Mode.CARD;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
  }

  init(film) {
    this._film = film;
    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmDetailsComponent = new FilmDetailsView(film);

    this._filmCardComponent.setClickFilmDetailsHandler(this._handleFilmCardClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmDetailsComponent.setClickButtonCloseHandler(this._handleButtonCloseClick);
    this._filmDetailsComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmDetailsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmCardComponent === null || prevFilmDetailsComponent === null) {
    // if (prevFilmCardComponent === null) {
      render(this._filmCardContainer, this._filmCardComponent);
      return;
    }

    replace(this._filmCardComponent, prevFilmCardComponent);

    if (this._mode === Mode.DETAILS) {
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmDetailsComponent);
  }

  resetView() {
    if (this._mode !== Mode.CARD) {
      this._closeFilmDetails();
    }
  }

  destroy() {
    this.resetView();
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
  }

  _closeFilmDetails(){
    close(this._filmDetailsComponent);
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._mode = Mode.CARD;
  }

  _openFilmDetails () {
    this._changeMode();
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
    this._openFilmDetails();
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign({}, this._film, {watchlist: !this._film.watchlist}),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      Object.assign({}, this._film, {watched: !this._film.watched}),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign({}, this._film, {favorite: !this._film.favorite}),
    );
  }

  _handleButtonCloseClick() {
    this._closeFilmDetails();
  }
}
