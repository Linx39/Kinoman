import AbstractView from './abstract.js';

const createFilmsListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container">
    </div>  
  </section>`);

export default class FilmsListAll extends AbstractView {
  getTemplate() {
    return createFilmsListTemplate();
  }

  getContainer() {
    return this.getElement().querySelector('.films-list__container');
  }
}
