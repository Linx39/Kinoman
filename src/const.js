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
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  EDIT_FILM: 'EDIT_FILM',
};

export const UpdateType = {
  NOTHING: 'NOTHING',//вроде я его удалила
  PATCH: 'PATCH',
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

export const PopupViewState = {
  EDITING: 'EDITING',
  ADDING: 'ADDING',
  DELETING: 'DELETING',
  ABORTING_ADD: 'ABORTING_ADD',
  ABORTING_DELETE: 'ABORTING_DELETE',
  ABORTING_EDIT: 'ABORTING_EDIT',
};

export const UpdateStage = {
  START: 'START',
  END: 'END',
};
