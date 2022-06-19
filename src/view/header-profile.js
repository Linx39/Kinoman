import { createElement } from '../util.js';

const FILTER_NAME = 'history';

const ProfileRatingName = [
  {filmCountMin: 1, ratingName: 'Novice'},
  {filmCountMin: 11, ratingName: 'Fan'},
  {filmCountMin: 21, ratingName: 'Movie Buff'},
];

const getProfileRating = (filmCount) => ProfileRatingName
  .reverse()
  .find((item) => filmCount >= item.filmCountMin)
  .ratingName;


const createHeaderProfileTemplate = (filterItems) => {
  const itemCount = filterItems.find((item) => item.name === FILTER_NAME).count;
  let profileRatingTemplate = '';

  if (itemCount > 0) {
    const profileRatingName = getProfileRating(itemCount);
    profileRatingTemplate = `<p class="profile__rating">${profileRatingName}</p>`;
  }

  return `
  <section class="header__profile profile">
    ${profileRatingTemplate}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class HeaderProfile {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createHeaderProfileTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    console.log (this._element);
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
