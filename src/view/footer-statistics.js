import { createElement } from '../util.js';

const createFooterStatisticsTemplate = (films) => {
  const moviesInside = films.length;

  return (
    `<section class="footer__statistics">
      <p>${moviesInside} movies inside</p>
    </section>`);
};

export default class FooterStatistics {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._films);
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
