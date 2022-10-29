import Observer from '../utils/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(update) {
    this._comments = [
      update,
      ...this._comments,
    ];
  }

  deleteComment(update) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment, update: ${update}`);
    }

    this._comments.splice(index, 1);
  }

  static adaptToClient(comment) {
    return {...comment};
  }

  static adaptToServer(comment) {
    return {...comment};
  }
}
