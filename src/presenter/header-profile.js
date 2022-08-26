import HeaderProfileView from '../view/header-profile.js';
import {render, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType} from '../const.js';

const ProfileRating = [
  {ratingName: 'Novice', watchedFilmsMinCount: 1},
  {ratingName: 'Fan', watchedFilmsMinCount: 11},
  {ratingName: 'Movie Buff', watchedFilmsMinCount: 21},
];

export default class HeaderProfile {
  constructor(headerProfileContainer, filmsModel) {
    this._headerProfileContainer = headerProfileContainer;
    this._filmsModel = filmsModel;

    this._headerProfileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const ratingName = this._getRatingName();
    const headerProfileComponent = this._headerProfileComponent;

    this._headerProfileComponent = new HeaderProfileView(ratingName);
    if (headerProfileComponent === null) {
      render(this._headerProfileContainer, this._headerProfileComponent);
      return;
    }

    replace(this._headerProfileComponent, headerProfileComponent);
    remove(headerProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _getRatingName() {
    const films = this._filmsModel.getFilms();
    const hystoryFilmsCount = filter[FilterType.HISTORY](films).length;

    if (hystoryFilmsCount === 0) {
      return null;
    }

    return ProfileRating
      .slice()
      .reverse()
      .find((profile) => hystoryFilmsCount >= profile.watchedFilmsMinCount)
      .ratingName;
  }
}
