import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import { isEscEvent } from '../utils/common.js';
import { render, remove, close, open, replace } from '../utils/render.js';

export default class Movie {
  constructor (filmContainer) {
    this._filmContainer = filmContainer;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
  }

  init(filmCard) {
    // this._filmCard = filmCard;
    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardView(filmCard);
    this._filmDetailsComponent = new FilmDetailsView(filmCard);

    this._filmCardComponent.setClickFilmDetailsHandler(this._handleFilmCardClick);
    this._filmDetailsComponent.setClickButtonCloseHandler(this._handleButtonCloseClick);

    if (prevFilmCardComponent === null || prevFilmDetailsComponent === null) {
      render(this._filmContainer, this._filmCardComponent);
      return;
    }

    if (this._filmContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._filmContainer.getElement().contains(prevFilmDetailsComponent.getElement())) {
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
    document.removeEventListener('keydown', this._handleEscKeyDown);
  }

  _openFilmDetails () {
    open(this._filmDetailsComponent);
    document.addEventListener('keydown', this._handleEscKeyDown);
  }

  _handleFilmCardClick () {
    this._openFilmDetails();
  }

  _handleButtonCloseClick() {
    this._closeFilmDetails();
  }

  _handleEscKeyDown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._closeFilmDetails();
    }
  }
}
