import AbstractView from './abstract.js';
import { addClassName, convertTime, formatDate, DateFormat } from '../utils/film.js';

const DESCRIPTON_LENGTH = 139;

const controlActiveClass = 'film-card__controls-item--active';

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

  const filmReleaseDate = formatDate(releaseDate, DateFormat.ONLY_YEAR);
  const filmRuntime = convertTime(runtime);
  const descriptionText = description.length < DESCRIPTON_LENGTH
    ? description
    : `${description.substring(0, DESCRIPTON_LENGTH-1)}...`;

  const commentsCount = comments.length;

  const watchlistClassName = addClassName(watchlist, controlActiveClass);
  const watchedClassName = addClassName(watched, controlActiveClass);
  const favoriteClassName = addClassName(favorite, controlActiveClass);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>

      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${filmReleaseDate}</span>
        <span class="film-card__duration">${filmRuntime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>

      <img src="${poster}" alt="" class="film-card__poster">

      <p class="film-card__description">${descriptionText}</p>
      
      <a class="film-card__comments">${commentsCount} comments</a>
      
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
      </div>
    </article>`);
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._clickFilmDetailsHandler = this._clickFilmDetailsHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _clickFilmDetailsHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setClickFilmDetailsHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._clickFilmDetailsHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._clickFilmDetailsHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._clickFilmDetailsHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }
}
