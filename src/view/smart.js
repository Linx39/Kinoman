import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._state = {};
  }

  updateState(update, justStateUpdating) {
    if (!update) {
      return;
    }

    this._state = {...this._state, update};

    if (justStateUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const scrollPosition = this.getElement().scrollTop;

    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this.getElement().scrollTo(0, scrollPosition);

    this.restoreListeners();
  }

  restoreListeners() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
