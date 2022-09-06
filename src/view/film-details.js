import AbstractView from './abstract.js';

const createFilmDetailsTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
    </form>
  </section>`);

export default class FilmDetails extends AbstractView {
  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  getContainer() {
    return this.getElement().querySelector('.film-details__inner');
  }
}
