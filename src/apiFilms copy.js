import FilmsModel from './model/films.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

const Model = FilmsModel;
const URL = 'movies';

export default class Api {
  constructor(apiUrl, authorization) {
    this._apiUrl = apiUrl;
    this._authorization = authorization;
  }

  getData() {
    return this._load({url: URL})
      .then(Api.toJSON)
      .then((data) => data.map(Model.adaptToClient));
  }

  updateData(data) {
    return this._load({
      url: `${URL}/${data.id}`,
      method: Method.PUT,
      body: JSON.stringify(Model.adaptToServer(data)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(Model.adaptToClient);
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
