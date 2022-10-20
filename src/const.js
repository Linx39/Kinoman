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

export const NavigationMode = {
  FILTER: 'FILTER',
  STATISTICS: 'STATISTICS',
};

export const PopupAction = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

export const ExtraType = {
  TOPRATED: 'TOPRATED',
  MOSTCOMMENTED: 'MOSTCOMMENTED',
};

export const PopupViewState = {
  ADDING: 'ADDING',
  DELETING: 'DELETING',
  ABORTING_ADD: 'ABORTING_ADD',
  ABORTING_DELETE: 'ABORTING_DELETE',
};

export const UpdateStage = {
  START: 'START',
  END: 'END',
};
