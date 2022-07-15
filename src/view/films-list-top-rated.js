import AbstractView from './abstract.js';

const createFilmsListTopRatedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
  </section>`);

export default class FilmsListTopRated extends AbstractView {
  getTemplate() {
    return createFilmsListTopRatedTemplate();
  }
}
