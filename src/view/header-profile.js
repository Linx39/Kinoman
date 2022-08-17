import AbstractView from './abstract.js';

const createHeaderProfileTemplate = (ratingName) => {
  const profileTemplate = ratingName !== null
    ? `<p class="profile__rating">${ratingName}</p>
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
