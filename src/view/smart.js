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
    this.restoreListeners();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
  }

  restoreListeners() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
