import { addClassName } from '../mock/util.js';

const controlActiveClass = 'film-card__controls-item--active';

export const createFilmCardTemplate = (film) => {
  const {
    title,
    rating,
    year,
    duration,
    genre,
    poster,
    description,
    comments,
    watchlist,
    watched,
    favorite,
  } = film;

  const watchlistClassName = addClassName(watchlist, controlActiveClass);
  const watchedClassName = addClassName(watched, controlActiveClass);
  const favoriteClassName = addClassName(favorite, controlActiveClass);

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>

  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${year}</span>
    <span class="film-card__duration">${duration}</span>
    <span class="film-card__genre">${genre}</span>
  </p>

  <img src="${poster}" alt="" class="film-card__poster">

  <p class="film-card__description">${description}</p>
  
  <a class="film-card__comments">${comments} comments</a>
  
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
  </div>
</article>`;
};
