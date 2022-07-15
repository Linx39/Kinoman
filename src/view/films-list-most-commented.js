import AbstractView from './abstract.js';

const createFilmsListMostCommentedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
  </section>`);

export default class FilmsListMostCommented extends AbstractView {
  getTemplate() {
    return createFilmsListMostCommentedTemplate();
  }
}
