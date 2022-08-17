import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const NoMoviesMessage = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoMoviesTemplate = (currentFilter) => (
  `<section class="films-list">
    <h2 class="films-list__title">${NoMoviesMessage[currentFilter]}</h2>

    <!--
      Значение отображаемого текста зависит от выбранного фильтра:
        * All movies – 'There are no movies in our database'
        * Watchlist — 'There are no movies to watch now';
        * History — 'There are no watched movies now';
        * Favorites — 'There are no favorite movies now'.
    -->
  </section>`);

export default class NoMovies extends AbstractView {
  constructor(currentFilter) {
    super();
    this._currentFilter = currentFilter;
  }

  getTemplate() {
    return createNoMoviesTemplate(this._currentFilter);
  }
}
