import AbstractView from './abstract.js';

const createFooterStatisticsTemplate = (films) => (
  `<section class="footer__statistics">
    <p>${films.length} movies inside</p>
  </section>`);

export default class FooterStatistics extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._films);
  }
}
