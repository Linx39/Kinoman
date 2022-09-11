import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  editFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedProperties = {
      ageRating: film.film_info.age_rating,
      alternativeTitle: film.film_info.alternative_title,
      genres: film.film_info.genre,
      releaseDate: film.film_info.release.date,
      country: film.film_info.release.release_country,
      rating: film.film_info.total_rating,
      actors: film.film_info.actors,
      description: film.film_info.description,
      director: film.film_info.director,
      poster: film.film_info.poster,
      runtime: film.film_info.runtime,
      title: film.film_info.title,
      writers: film.film_info.writers,
      watchlist: film.user_details.watchlist,
      watched: film.user_details.already_watched,
      watchingDate: film.user_details.watching_date,
      favorite: film.user_details.favorite,
    };

    const adaptedFilm = {...film, ...adaptedProperties};

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedProperties = {
      'film_info.age_rating': film.ageRating,
      'film_info.alternative_title': film.alternativeTitle,
      'film_info.genre': film.genres,
      'film_info.release.date': film.releaseDate,
      'film_info.release.release_country': film.country,
      'film_info.total_rating': film.rating,
      'film_info.actors': film.actors,
      'film_info.description': film.description,
      'film_info.director': film.director,
      'film_info.poster': film.poster,
      'film_info.runtime': film.runtime,
      'film_info.title': film.title,
      'film_info.writers': film.writers,
      'user_details.watchlist': film.watchlist,
      'user_details.already_watched': film.watched,
      'user_details.watching_date': film.watchingDate,
      'user_details.favorite': film.favorite,
    };

    const adaptedFilm = {...film, ...adaptedProperties};

    delete adaptedFilm.ageRating;
    delete adaptedFilm.alternativeTitle;
    delete adaptedFilm.genres;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.country;
    delete adaptedFilm.rating;
    delete adaptedFilm.actors;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.poster;
    delete adaptedFilm.runtime;
    delete adaptedFilm.title;
    delete adaptedFilm.writers;
    delete adaptedFilm.watchlist;
    delete adaptedFilm.watched;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.favorite;

    return adaptedFilm;
  }
}
