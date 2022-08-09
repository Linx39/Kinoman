import AbstractView from './abstract.js';
import { addClassName } from '../utils/film.js';
import { formatDate, DateFormats, convertTimeToHoursAndMinutes } from '../utils/common.js';

const CONTROL_ACTIVE_CLASS = 'film-details__control-button--active';
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

  const createGenresTemplate = () => genres
    .map((genre) => `<span class="film-details__genre">${genre}</span>`)
    .join('');

  const ageRatingFilm = `${ageRating}+`;
  const filmReleaseDate = formatDate(releaseDate, DateFormats.FULL_DATE);
  const filmRuntime = convertTimeToHoursAndMinutes(runtime);
  const watchlistClassName = addClassName(watchlist, CONTROL_ACTIVE_CLASS);
  const watchedClassName = addClassName(watched, CONTROL_ACTIVE_CLASS);
  const favoriteClassName = addClassName(favorite, CONTROL_ACTIVE_CLASS);
  const genresTitle = genres.length > 1 ? `${GENRE}s` : GENRE;
  const genresTemplate = createGenresTemplate();

  return (
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRatingFilm}</p>
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
              <td class="film-details__cell">${filmReleaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${filmRuntime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genresTitle}</td>
              <td class="film-details__cell">
                ${genresTemplate}
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`);
};

export default class FilmDetailsTop extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._clickButtonCloseHandler = this._clickButtonCloseHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  _clickButtonCloseHandler(evt) {
    evt.preventDefault();
    this._callback.click(this._film);
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

  setClickButtonCloseHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._clickButtonCloseHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteClickHandler);
  }
}