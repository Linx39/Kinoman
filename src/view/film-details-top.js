import AbstractView from './abstract.js';
import { formatDate, DateFormats } from '../utils/common.js';
import { getRuntimeTemplate } from '../utils/film.js';

const BUTTON_ACTIVE_CLASS = 'film-details__control-button--active';
const GENRE = 'Genre';

const createFilmDetailsTemplate = (film) => {
  const {
    poster,
    title,
    alternativeTitle,
    rating,
    director,
    writers,
    actors,
    releaseDate,
    runtime,
    country,
    genres,
    description,
    ageRating,
    watchlist,
    watched,
    favorite,
  } = film;

  const genresTemplate = genres
    .map((genre) => `<span class="film-details__genre">${genre}</span>`)
    .join('');

  return (
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${`${ageRating}+`}</p>
        </div    >      

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formatDate(releaseDate, DateFormats.FULL_DATE)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getRuntimeTemplate(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genres.length > 1 ? `${GENRE}s` : GENRE}</td>
              <td class="film-details__cell">
                ${genresTemplate}
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlist? BUTTON_ACTIVE_CLASS : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${watched? BUTTON_ACTIVE_CLASS : ''}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${favorite? BUTTON_ACTIVE_CLASS : ''}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`);
};

export default class FilmDetailsTop extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._onButtonCloseClick = this._onButtonCloseClick.bind(this);
    this._onWatchlistClick = this._onWatchlistClick.bind(this);
    this._onWatchedClick = this._onWatchedClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  _onButtonCloseClick(evt) {
    evt.preventDefault();
    this._callback.click(this._film);
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

  setButtonCloseClickListener(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._onButtonCloseClick);
  }

  setWatchlistClickListener(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._onWatchlistClick);
  }

  setWatchedClickListener(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._onWatchedClick);
  }

  setFavoriteClickListener(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._onFavoriteClick);
  }
}
