const filmsToFilterMap = {
  all: (films) => films.length,
  watchlist: (films) => films.filter((film) => film.watchlist).length,
  history: (films) => films.filter((film) => film.watched).length,
  favorites: (films) => films.filter((film) => film.favorite).length,
};

const createFilmsFilter = (films) => Object
  .entries(filmsToFilterMap)
  .map(([filterName, filmsCount]) => ({
    name: filterName,
    count: filmsCount(films),
  }),
  );

const createCommentsFilter = (film, commentsData) => {
  const {comments} = film;
  return commentsData.slice().filter((comment) => comments.some((id) => id === comment.id));
};

export { createFilmsFilter, createCommentsFilter };
