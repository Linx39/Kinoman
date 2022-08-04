import AbstractView from './abstract.js';

const FILTER_NAME = 'history';

const ProfileRatingName = [
  {watchedFilmsCountMin: 1, ratingName: 'Novice'},
  {watchedFilmsCountMin: 11, ratingName: 'Fan'},
  {watchedFilmsCountMin: 21, ratingName: 'Movie Buff'},
];

const getProfileRating = (filmsCount) => ProfileRatingName
  .reverse()
  .find((profile) => filmsCount >= profile.watchedFilmsCountMin)
  .ratingName;


const createHeaderProfileTemplate = (filters) => {
  const filmsCount = filters.find((filter) => filter.name === FILTER_NAME).count;

  const profileRatingTemplate = filmsCount > 0
    ? `<p class="profile__rating">${getProfileRating(filmsCount)}</p>`
    : '';

  const profileAvatarTemplate = filmsCount > 0
    ? '<img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"></img>'
    : '';

  return (
    `<section class="header__profile profile">
      ${profileRatingTemplate}
      ${profileAvatarTemplate}
    </section>`);
};

export default class HeaderProfile extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createHeaderProfileTemplate(this._filters);
  }
}
