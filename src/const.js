export const FILMS_COUNT = 5;
export const COMMENTS_COUNT = 200;

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
  EDITFILM: 'EDITFILM',
};

export const UpdateType = {
  NOTHING: 'NOTHING',
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

export const PopupAction = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};
