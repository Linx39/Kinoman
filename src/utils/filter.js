import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATHLIST]: (films) => films.filter((film) => film.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.watched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.favorite),
};
