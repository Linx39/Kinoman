// import FilmsModel from './model/films.js';

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

// const Model = FilmsModel;
// const Url = {
//   MOVIES: 'movies',
//   COMMENTS: 'comments',
// };

export default class Api {
  constructor(apiUrl, authorization, url, model) {
    this._apiUrl = apiUrl;
    this._authorization = authorization;
    this._url = url;
    this._model = model;
  }

  getData() {
    return this._load({
      url: this._url,
    })
      .then(Api.toJSON)
      .then((data) => data.map(this._model.adaptToClient));
  }

  updateData(data) {
    return this._load({
      url: `${this._url}/${data.id}`,
      method: Method.PUT,
      body: JSON.stringify(this._model.adaptToServer(data)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(this._model.adaptToClient);
  }

  addData(data) {
    return this._load({
      url: this._url,
      method: Method.POST,
      body: JSON.stringify(this._model.adaptToServer(data)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(this._model.adaptToClient);
  }

  deleteData(data) {
    console.log (`${this._url}/${data.id}`);
    return this._load({
      url: `${this._url}/${data.id}`,
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
