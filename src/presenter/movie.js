import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';

import { createCommentsFilter } from '../view/filter.js';
import { isEscEvent } from '../utils/common.js';
import { comments } from '../main.js';
import { render, remove, close, open, replace } from '../utils/render.js';

export default class Movie {
  constructor (filmContainer) {
    this._filmContainer = filmContainer;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(card) {
    this._card = card;
    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardView(this._card);
    this._filmDetailsComponent = new FilmDetailsView(this._card, createCommentsFilter(this._card, comments));

    this._filmCardComponent.setClickFilmDetailsHandler(this._handleFilmCardClick);
    this._filmDetailsComponent.setClickButtonCloseHandler(this._handleButtonCloseClick);

    if (prevFilmCardComponent === null || prevFilmDetailsComponent === null) {
      render(this._filmContainer, this._filmCardComponent);
      return;
    }

    if (this._filmContainer.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._filmContainer.contains(prevFilmDetailsComponent.getElement())) {
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmDetailsComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
  }

  _closeFilmDetails(){
    close(this._filmDetailsComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _openFilmDetails () {
    open(this._filmDetailsComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFilmCardClick () {
    this._openFilmDetails();
  }

  _handleButtonCloseClick() {
    this._closeFilmDetails();
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent) {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }
}
