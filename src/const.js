// export const FILMS_COUNT = 5;
export const COMMENTS_COUNT = 20;

export const ProfileRating = [
  {name: 'Novice', count: 1},
  {name: 'Fan', count: 11},
  {name: 'Movie Buff', count: 21},
];

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RAITING: 'rating',
};

export const UserAction = {
  ADDCOMMENT: 'ADDCOMMENT',
  DELETECOMMENT: 'DELETECOMMENT',
  UPDATEFILM: 'UPDATEFILM',
};

export const UpdateType = {
  NOTHING: 'NOTHING',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
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

export const PopupAction = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

export const TopType = {
  TOPRATED: 'TOPRATED',
  MOSTCOMMENTED: 'MOSTCOMMENTED',
};
