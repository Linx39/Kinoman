import { comments as filmComments } from '../main.js';

const filmsToFilterMap = {
  all: (films) => films.length,
  watchlist: (films) => films.filter((film) => film.watchlist).length,
  history: (films) => films.filter((film) => film.watched).length,
  favorites: (films) => films.filter((film) => film.favorite).length,
};

export const createFilmsFilter = (films) =>
  Object
    .entries(filmsToFilterMap)
    .map(([filterName, filmsCount]) => ({name: filterName, count: filmsCount(films)}));

export const createCommentsFilter = (film) => {
  const {comments} = film;
  return filmComments.slice().filter((comment) => comments.some((id) => id === comment.id));
};
