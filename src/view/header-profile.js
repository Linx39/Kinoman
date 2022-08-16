import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const ProfileRatingName = [
  {watchedFilmsCountMin: 1, ratingName: 'Novice'},
  {watchedFilmsCountMin: 11, ratingName: 'Fan'},
  {watchedFilmsCountMin: 21, ratingName: 'Movie Buff'},
];

const getProfileRating = (filmsCount) => ProfileRatingName
  .slice()
  .reverse()
  .find((profile) => filmsCount >= profile.watchedFilmsCountMin)
  .ratingName;

const createHeaderProfileTemplate = (filmsCount) => {
  // const filmsCount = filter[FilterType.ALL](films).length;

  const profileTemplate = filmsCount > 0
    ? `<p class="profile__rating">${getProfileRating(filmsCount)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"></img>`
    : '';

  return (
    `<section class="header__profile profile">
      ${profileTemplate}
    </section>`);
};

export default class HeaderProfile extends AbstractView {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createHeaderProfileTemplate(this._filmsCount);
  }
}
