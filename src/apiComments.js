import CommentsModel from './model/comments';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(apiUrl, authorization) {
    this._apiUrl = apiUrl;
    this._authorization = authorization;
  }

  getComments(film) {
    return this._load({url: `comments/${film.id}`})
      .then(Api.toJSON);
      // .then((comments) => comments.map(CommentsModel.adaptToClient));
  }

  updateComment(film) {
    return this._load({
      url: `comments/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(CommentsModel.adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(CommentsModel.adaptToClient);
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
