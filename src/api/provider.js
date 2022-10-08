import FilmsModel from '../model/films.js';
import CommentsModel from '../model/comments.js';
import { isOnline } from '../utils/common.js';

const getSyncedFilms = (items) => items
  .filter(({success}) => success)
  .map(({payload}) => payload.film);

const createStoreStructure = (items) => items
  .reduce((acc, current) => Object.assign({}, acc, {
    [current.id]: current,
  }), {});

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  getComments(film) {
    if (isOnline()) {
      return this._api.getComments(film);
    }

    return Promise.reject(new Error('Get comment failed'));
  }

  // getComments(film) {
    // if (isOnline()) {
      // return this._api.getComments(film)
        // .then((comments) => {
        //   const items = createStoreStructure(comments.map(CommentsModel.adaptToServer));
        //   this._store.setItems(items);
        //   return comments;
        // });
    // }

  //   //     const storeComments = Object.values(this._store.getItems());
  //   // console.log (storeComments);
  //   //     return Promise.resolve(storeComments.map(CommentsModel.adaptToClient));

  //   return Promise.reject(new Error('Get comment failed'));
  // }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  addComment(film, comment) {
    if (isOnline()) {
      return this._api.addComment(film, comment);
        // .then((newComment) => {
        //   this._store.setItem(newComment.id, CommentsModel.adaptToServer(newComment));
        //   return newComment;
        // });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(comment) {
    if (isOnline()) {
      return this._api.deleteComment(comment);
        // .then(() => this._store.removeItem(comment.id));
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdFilms = getSyncedFilms(response.created);
          const updatedFilms = getSyncedFilms(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdFilms, ...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
