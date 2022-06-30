import { createElement } from '../utils.js';

const createFilmsListMostCommentedTemplate = () => (
  `<section class="films-list films-list--extra" name="Most commented">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container">
    </div>
  </section>`);

export default class FilmsListMostCommented {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsListMostCommentedTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
