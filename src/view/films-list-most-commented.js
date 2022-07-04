import AbstractView from './abstract.js';

const createFilmsListMostCommentedTemplate = () => (
  `<section class="films-list films-list--extra" name="Most commented">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container">
    </div>
  </section>`);

export default class FilmsListMostCommented extends AbstractView {
  getTemplate() {
    return createFilmsListMostCommentedTemplate();
  }

  getContainer() {
    return this.getElement().querySelector('.films-list__container');
  }
}
