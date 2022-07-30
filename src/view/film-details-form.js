import AbstractView from './abstract.js';

const createFilmDetailsFormTemplate = () => (
  `<form class="film-details__inner" action="" method="get">
  </form>`);

export default class FilmDetailsForm extends AbstractView {
  getTemplate() {
    return createFilmDetailsFormTemplate(this._film);
  }
}
