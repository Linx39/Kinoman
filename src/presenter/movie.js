import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import FilmDetailsFormView from '../view/film-details-form.js';
import FilmDetailsTopView from '../view/film-details-top.js';
import FilmDetailsBottomView from '../view/film-details-bottom.js';
import { isEscEvent } from '../utils/common.js';
import { render, remove, close, open, replace } from '../utils/render.js';
import { comments as filmsComments } from '../main.js';

const Mode = {
  CARD: 'CARD',
  DETAILS: 'DETAILS',
};

export default class Movie {
  constructor (filmCardContainer, changeFilm, changeMode) {
    this._filmCardContainer = filmCardContainer;
    this._changeFilm = changeFilm;
    this._changeMode = changeMode;

    this._filmDetailsContainer = null;           //зачем это?
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

    const filmComments = filmsComments
      .slice()
      .filter((comment) => film.comments.some((id) => id === comment.id));

    this._filmCardComponent = new FilmCardView(film);
    this._filmDetailsComponent = new FilmDetailsView();
    this._filmDetailsFormComponent = new FilmDetailsFormView();
    this._filmDetailsTopComponent = new FilmDetailsTopView(film);
    this._filmDetailsBottomComponent = new FilmDetailsBottomView(filmComments);

    this._filmCardComponent.setClickFilmDetailsHandler(this._handleFilmCardClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmDetailsTopComponent.setClickButtonCloseHandler(this._handleButtonCloseClick);
    this._filmDetailsTopComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmDetailsTopComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsTopComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    // if (prevFilmCardComponent === null || prevFilmDetailsComponent === null) {
    if (prevFilmCardComponent === null) {
      render(this._filmCardContainer, this._filmCardComponent);
      return;
    }

    replace(this._filmCardComponent, prevFilmCardComponent);

    if (this._mode === Mode.DETAILS) {
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
      this._renderFilmDetails();
    }

    remove(prevFilmCardComponent);
    remove(prevFilmDetailsComponent);
  }

  resetFilmDetailsView() {
    if (this._mode !== Mode.CARD) {
      this._closeFilmDetails();
    }
  }

  destroy() {
    this.resetFilmDetailsView();
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
  }

  _renderFilmDetails() {
    render(this._filmDetailsComponent, this._filmDetailsFormComponent);
    render(this._filmDetailsFormComponent, this._filmDetailsTopComponent);
    render(this._filmDetailsFormComponent, this._filmDetailsBottomComponent);
  }

  _closeFilmDetails() {
    close(this._filmDetailsComponent);
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._mode = Mode.CARD;
  }

  _openFilmDetails() {                  //сохранить открытый попап и передать его в _close, а там сделать параметр по умолчанию this
    this._changeMode();
    open(this._filmDetailsComponent);
    this._renderFilmDetails();
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
    this._changeFilm(
      Object.assign({}, this._film, {watchlist: !this._film.watchlist}),
    );
  }

  _handleWatchedClick() {
    this._changeFilm(
      Object.assign({}, this._film, {watched: !this._film.watched}),
    );
  }

  _handleFavoriteClick() {
    this._changeFilm(
      Object.assign({}, this._film, {favorite: !this._film.favorite}),
    );
  }

  _handleButtonCloseClick() {
    this._closeFilmDetails();
  }
}
