import FilmsModel from '../model/films.js';
import CommentsModel from '../model/comments.js';
import { isOnline } from '../utils/common.js';

const createStoreStructure = (items) => items
  .reduce((accumulator, item) => ({...accumulator, [item.id]: item}), {});

export default class Provider {
  constructor(api, storeFilms, storeComments) {
    this._api = api;
    this._storeFilms = storeFilms;
    this._storeComments = storeComments;

    this._isSync = false;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._storeFilms.setItems(items);

          return films;
        });
    }

    const store = Object.values(this._storeFilms.getItems());

    return Promise.resolve(store.map(FilmsModel.adaptToClient));
  }

  getComments(film) {
    if (isOnline()) {
      return this._api.getComments(film)
        .then((comments) => {
          const prevStore = this._storeComments.getItems();
          const item = {[film.id]: createStoreStructure(comments.map(CommentsModel.adaptToServer))};
          const updatedStore = {...prevStore, ...item};
          this._storeComments.setItems(updatedStore);

          return comments;
        });
    }

    const store = Object.values(this._storeComments.getItem(film.id));

    if (Object.keys(store).length !== 0) {
      return Promise.resolve(store.map(CommentsModel.adaptToClient));
    }

    return Promise.reject(new Error('Get comment failed'));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._storeFilms.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));

          return updatedFilm;
        });
    }

    this._storeFilms.setItem(film.id, FilmsModel.adaptToServer({...film}));
    this._isSync = true;

    return Promise.resolve(film);
  }

  addComment(film, comment) {
    if (isOnline()) {
      return this._api.addComment(film, comment)
        .then((response) => {
          this._storeComments.setItem(response.film.id, createStoreStructure(response.filmComments.map(CommentsModel.adaptToServer)));
          this._storeFilms.setItem(response.film.id, FilmsModel.adaptToServer(response.film));

          return response;
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(film, comment) {
    if (isOnline()) {
      return this._api.deleteComment(comment)
        .then(() => {
          const updatedComments = this._storeComments.getItem(film.id);
          delete updatedComments[comment.id];
          this._storeComments.setItem(film.id, updatedComments);

          const updatedFilm = this._storeFilms.getItem(film.id);
          const index = updatedFilm.comments.findIndex((id) => id === comment.id);
          updatedFilm.comments.splice(index, 1);
          this._storeFilms.setItem(updatedFilm.id, updatedFilm);
        });
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._storeFilms.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const items = createStoreStructure(response.updated);
          this._storeFilms.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }

  getIsSinc() {
    return this._isSync;
  }
}
