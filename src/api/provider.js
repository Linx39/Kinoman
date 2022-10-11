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

const createCommentsStoreStructure = (id, items) => ({[id]: createStoreStructure(items)});

export default class Provider {
  constructor(api, storeFilms, storeComments) {
    this._api = api;
    this._storeFilms = storeFilms;
    this._storeComments = storeComments;
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
          const items = createCommentsStoreStructure(film.id, comments.map(CommentsModel.adaptToServer));
          const updatedStore = {...prevStore, ...items};
          this._storeComments.setItems(updatedStore);
          return comments;
        });
    }

    const store = Object.values(this._storeComments.getItems());

    if ([film.id] in store) {
      return Promise.resolve(store[film.id].map(CommentsModel.adaptToClient));
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

    this._storeFilms.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));
    return Promise.resolve(film);
  }

  addComment(film, comment) {
    if (isOnline()) {
      return this._api.addComment(film, comment)
        .then((response) => {
          this._storeComments.setItem(response.film.id, CommentsModel.adaptToServer(response.filmComments));
          return response;
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(film, comment) {
    if (isOnline()) {
      return this._api.deleteComment(comment)
        .then(() => {
          const mykey = `[${film.id}][${comment.id}]`;
          console.log (film.id, comment.id, mykey);
          this._storeComments.removeItem(mykey);
        });
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._storeFilms.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {

          //посмотреть что тут в респонзе и работу getSyncedFilms

          // Забираем из ответа синхронизированные задачи
          const createdFilms = getSyncedFilms(response.created);//похоже, это не нужно
          const updatedFilms = getSyncedFilms(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdFilms, ...updatedFilms]);

          this._storeFilms.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
