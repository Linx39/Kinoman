import AbstractView from './abstract.js';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _onShowMoreButtonClick(evt) {
    evt.preventDefault();
    this._callback.showMoreButtonClick();
  }

  setShowMoreButtonClickListener(callback) {
    this._callback.showMoreButtonClick = callback;
    this.getElement().addEventListener('click', this._onShowMoreButtonClick);
  }
}
