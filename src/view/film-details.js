import AbstractView from './abstract.js';

const createFilmDetailsTemplate = () => (
  `<section class="film-details">
  </section>`);

export default class FilmDetails extends AbstractView {
  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }
}
