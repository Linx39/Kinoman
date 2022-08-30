export const FILMS_COUNT = 24;
export const COMMENTS_COUNT = 100;

export const ProfileRating = [
  {ratingName: 'Novice', watchedFilmsMinCount: 1},
  {ratingName: 'Fan', watchedFilmsMinCount: 11},
  {ratingName: 'Movie Buff', watchedFilmsMinCount: 21},
];

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RAITING: 'rating',
};

export const UserAction = {
  ADDCOMMENT: 'ADDCOMMENT',
  DELETECOMMENT: 'DELETECOMMENT',
  EDITFILM: 'EDITFILM',
};

export const UpdateType = {
  NOTHING: 'NOTHING',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  ALL: 'all',
  WATHLIST: 'watchlist',
  HISTORY: 'watched',
  FAVORITES: 'favorites',
};

export const ModeNavigation = {
  FILTER: 'FILTER',
  STATISTICS: 'STATISTICS',
};
