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
  TOP_RATED: 'TOP_RATED',
  MOST_COMMENTED: 'MOST_COMMENTED',
};

export const ViewState = {
  CARD_UPDATE: 'CARD_UPDATE',
  POPUP_UPDATE: 'POPUP_UPDATE',
  COMMENT_ADDING: 'COMMENT_ADDING',
  COMMENT_DELETING: 'COMMENT_DELETING',
  ABORTING_CARD_UPDATE: 'ABORTING_CARD_UPDATE',
  ABORTING_POPUP_UPDATE: 'ABORTING_POPUP_UPDATE',
  ABORTING_COMMENT_ADD: 'ABORTING_COMMENT_ADD',
  ABORTING_COMMENT_DELETE: 'ABORTING_COMMENT_DELETE',
};

export const UpdateStage = {
  START: 'START',
  END: 'END',
};
