import AbstractView from './abstract.js';
import { formatDate, DateFormat } from '../utils/common.js';
import { getRuntimeTemplate } from '../utils/films.js';

const DESCRIPTON_LENGTH = 140;

const ITEM_ACTIVE_CLASS = 'film-card__controls-item--active';

const createFilmCardTemplate = (film) => {
  const {
    poster,
    title,
    rating,
    releaseDate,
    runtime,
    genres,
    description,
    comments,
    watchlist,
    watched,
    favorite,
  } = film;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>

      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formatDate(releaseDate, DateFormat.ONLY_YEAR)}</span>
        <span class="film-card__duration">${getRuntimeTemplate(runtime)}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>

      <img src="${poster}" alt="" class="film-card__poster">

      <p class="film-card__description">${description.length < DESCRIPTON_LENGTH? description : `${description.slice(0, DESCRIPTON_LENGTH-1)}...`}</p>
      
      <a class="film-card__comments">${comments.length} comments</a>
      
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlist? ITEM_ACTIVE_CLASS : ''}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watched? ITEM_ACTIVE_CLASS : ''}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favorite? ITEM_ACTIVE_CLASS : ''}" type="button">Mark as favorite</button>
      </div>
    </article>`);
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._onFilmCardClick = this._onFilmCardClick.bind(this);
    this._onWatchlistClick = this._onWatchlistClick.bind(this);
    this._onWatchedClick = this._onWatchedClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _onFilmCardClick(evt) {
    evt.preventDefault();
    this._callback.filmCardClick();
  }

  _onWatchlistClick(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _onWatchedClick(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _onFavoriteClick(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFilmCardClickListener(callback) {
    this._callback.filmCardClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._onFilmCardClick);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._onFilmCardClick);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._onFilmCardClick);
  }

  setWatchlistClickListener(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._onWatchlistClick);
  }

  setWatchedClickListener(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._onWatchedClick);
  }

  setFavoriteClickListener(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._onFavoriteClick);
  }
}
