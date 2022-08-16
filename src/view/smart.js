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

    // this._state = Object.assign(
    //   {},
    //   this._state,
    //   update,
    // );

    this._state = {...this._state, update};

    if (justStateUpdating) {
      return;
    }

    this.updateElement();
    this.restoreHandlers();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
