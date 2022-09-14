import FilmsModel from './model/films.js';
import CommentsModel from './model/comments';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

const Url = {
  MOVIES: 'movies',
  COMMENTS: 'comments',
};

export default class Api {
  constructor(apiUrl, authorization) {
    this._apiUrl = apiUrl;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({
      url: Url.MOVIES,
    })
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  getComments(film) {
    return this._load({
      url: `${Url.COMMENTS}/${film.id}`,
    })
      .then(Api.toJSON)
      .then((comments) => comments.map(CommentsModel.adaptToClient));
  }

  updateFilm(film) {
    return this._load({
      url: `${Url.MOVIES}/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  addComment(film, comment) {
    return this._load({
      url: `${Url.COMMENTS}/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(CommentsModel.adaptToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(({movie, comments}) => ({film: FilmsModel.adaptToClient(movie), filmComments: comments.map(CommentsModel.adaptToClient)}));
  }

  deleteComment(comment) {
    return this._load({
      url: `${Url.COMMENTS}/${comment.id}`,
      method: Method.DELETE,
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);
    return fetch(
      `${this._apiUrl}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
