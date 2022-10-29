import SmartView from './smart.js';
import he from 'he';
import { getRuntimeTemplate } from '../utils/films.js';
import { formatDate, DateFormat, convertDateToHumanFormat, isCtrlEnterEvent } from '../utils/common.js';

const BUTTON_ACTIVE_CLASS = 'film-details__control-button--active';
const EMOJI_PATH = '../images/emoji/';
const Emoji = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

const getIsDisabled = (filmComments, newComment) => filmComments
  .reduce(((accumulator, comment) => accumulator || comment.isDeleting), false)
  || newComment.isSubmiting;

const createFilmDetailsTopTemplate = (film) => {
  const {
    poster,
    title,
    alternativeTitle,
    rating,
    director,
    writers,
    actors,
    releaseDate,
    runtime,
    country,
    genres,
    description,
    ageRating,
    watchlist,
    watched,
    favorite,
  } = film;

  const genresTemplate = genres
    .map((genre) => `<span class="film-details__genre">${genre}</span>`)
    .join('');

  const writersTemplate = writers
    .map((writer) => `${writer}`)
    .join(', ');

  const actorsTemplate = actors
    .map((actor) => `${actor}`)
    .join(', ');

  return (
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${`${ageRating}+`}</p>
        </div    >      

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writersTemplate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actorsTemplate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formatDate(releaseDate, DateFormat.FULL_DATE)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getRuntimeTemplate(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell">
                ${genresTemplate}
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlist? BUTTON_ACTIVE_CLASS : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${watched? BUTTON_ACTIVE_CLASS : ''}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${favorite? BUTTON_ACTIVE_CLASS : ''}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`);
};

const createCommentTemplate = (filmComment) => {
  const {id, author, comment, date, emotion, isDeleting } = filmComment;

  return (
    `<li class="film-details__comment" data-id = "${id}">
      <span class="film-details__comment-emoji">
        <img src="${EMOJI_PATH}${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${convertDateToHumanFormat(date)}</span>
          <button class="film-details__comment-delete" data-id = "${id}">
            ${isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </p>
      </div>
    </li>`);
};

const createEmojiListTemplate = (emoji, emotion, isDisabled) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${emotion === `${emoji}` && `${!isDisabled}` ? 'checked' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="${EMOJI_PATH}${emoji}.png" width="30" height="30" alt="emoji" data-emotion = "${emoji}">
  </label>`);


const createNewCommentTemplate = (newComment, isDisabled) => {
  const {comment, emotion} = newComment;

  const emotiomTemplate = emotion !== null
    ? `<img src="${EMOJI_PATH}${emotion}.png" width="55" height="55" alt="emoji-${emotion}"></img>`
    : '';

  const commentTemplate = he.encode(comment !== null? comment : '');

  const emojiListTemplate = Object.values(Emoji)
    .map((emoji) => createEmojiListTemplate(emoji, emotion, isDisabled))
    .join('');

  return (
    `<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
          ${emotiomTemplate}
        </div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${commentTemplate}</textarea>
        </label>
        <div class="film-details__emoji-list">
          ${emojiListTemplate}
        </div>
      </div>`);
};

const createFilmDetailsBottomTemplate = (filmComments, newComment, isCommentLoading) => {
  let commentListTemplate = '<h3 class="film-details__comments-title">Oops... The comments weren\'t loaded. Please refresh the page.</h3>';

  if (isCommentLoading) {
    const isDisabled = getIsDisabled(filmComments, newComment);

    const commentsTemplate = Object.values(filmComments)
      .map((filmComment) => createCommentTemplate(filmComment))
      .join('');

    const newCommentsTemplate = createNewCommentTemplate(newComment, isDisabled);

    commentListTemplate =
      `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmComments.length}</span></h3>
        <ul class="film-details__comments-list">
          ${commentsTemplate}
        </ul>
        ${newCommentsTemplate}`;
  }

  return (
    `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        ${commentListTemplate}   
      </section>
    </div>`);
};

const createFilmDetailsTemplate = (film, filmComments, newComment, isCommentLoading) => {
  const filmDetailsTopTemplate = createFilmDetailsTopTemplate(film);
  const filmDetailsBottomTemplate = createFilmDetailsBottomTemplate(filmComments, newComment, isCommentLoading);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        ${filmDetailsTopTemplate}       
        ${filmDetailsBottomTemplate}
      </form>
    </section>`);
};

export default class FilmDetails extends SmartView {
  constructor(film, filmComments, isCommentLoading) {
    super();
    this._filmState = FilmDetails.parseFilmToState(film);
    this._filmCommentsState = FilmDetails.parseCommentsToState(filmComments);
    this._isCommentLoading = isCommentLoading;

    this._newComment = {
      comment: null,
      emotion: null,
    };
    this._newCommentState = FilmDetails.parseNewCommentToState(this._newComment);

    this._onButtonCloseClick = this._onButtonCloseClick.bind(this);
    this._onWatchlistClick = this._onWatchlistClick.bind(this);
    this._onWatchedClick = this._onWatchedClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);

    this._onEmojiListClick = this._onEmojiListClick.bind(this);
    this._onCommentInput = this._onCommentInput.bind(this);
    this._onCommentDeleteClick = this._onCommentDeleteClick.bind(this);
    this._onCtrlEnterDown = this._onCtrlEnterDown.bind(this);

    if (this._isCommentLoading) {
      this._setInnerListeners();
    }
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._filmState, this._filmCommentsState, this._newCommentState, this._isCommentLoading);
  }

  restoreListeners() {
    this.setButtonCloseClickListener(this._callback.closeClick);
    this.setWatchlistClickListener(this._callback.watchlistClick) ;
    this.setWatchedClickListener(this._callback.watchedClick);
    this.setFavoriteClickListener(this._callback.favoriteClick);

    if (this._isCommentLoading) {
      this._setInnerListeners();
      this.setCommentDeleteClickListener(this._callback.commentDeleteClick);
      this.setCommentSubmitListener(this._callback.commentSubmit);
    }
  }

  _onButtonCloseClick(evt) {
    evt.preventDefault();
    this._callback.closeClick(FilmDetails.parseStateToFilm(this._filmState));
  }

  setButtonCloseClickListener(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._onButtonCloseClick);
  }

  _onWatchlistClick(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setWatchlistClickListener(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._onWatchlistClick);
  }

  _onWatchedClick(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  setWatchedClickListener(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._onWatchedClick);
  }

  _onFavoriteClick(evt) {
    evt.preventDefault();

    this._callback.favoriteClick();
  }

  setFavoriteClickListener(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._onFavoriteClick);
  }

  _onEmojiListClick(evt) {
    if (evt.target.tagName !== 'IMG') {
      return;
    }

    evt.preventDefault();

    if (!getIsDisabled(this._filmCommentsState, this._newCommentState)) {
      this._newCommentState = {
        ...this._newCommentState,
        emotion: evt.target.dataset.emotion,
      };
      this.updateState(this._newCommentState);
    }
  }

  _onCommentInput(evt) {
    evt.preventDefault();

    this._newCommentState = {
      ...this._newCommentState,
      comment: evt.target.value,
    };

    this.updateState(this._newCommentState, true);
  }

  _setInnerListeners() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('click', this._onEmojiListClick);
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._onCommentInput);
  }

  _onCommentDeleteClick(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    evt.preventDefault();

    this._deletetingFilmComment = this._filmCommentsState.find((comment) => comment.id === evt.target.dataset.id);
    this._callback.commentDeleteClick(FilmDetails.parseStateToComment(this._deletetingFilmComment));
  }

  setCommentDeleteClickListener(callback) {
    this._callback.commentDeleteClick = callback;
    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._onCommentDeleteClick);
  }

  _onCtrlEnterDown(evt) {
    if (isCtrlEnterEvent(evt)) {
      evt.preventDefault();

      this._callback.commentSubmit(FilmDetails.parseStateToNewComment(this._newCommentState));
      this.removeCtrlEnterDownListener();
    }
  }

  setCommentSubmitListener(callback) {
    this._callback.commentSubmit = callback;
    document.addEventListener('keydown', this._onCtrlEnterDown);
  }

  removeCtrlEnterDownListener() {
    document.removeEventListener('keydown', this._onCtrlEnterDown);
  }

  updateFilmState() {
    this.updateState(this._filmState);
  }

  updateFilmCommentsState() {
    this._deletetingFilmComment.isDeleting = true;

    this.updateState(this._filmCommentsState);
  }

  updateNewCommentState() {
    this._newCommentState = {
      ...this._newCommentState,
      isSubmiting: true,
    };

    this.updateState(this._newCommentState);
  }

  abortFilmState() {
    const element = this.getElement();

    this.shake(element, () => {
      this.updateState(this._filmState);
    });
  }

  abortFilmCommentsState() {
    const element = this.getElement().querySelector(`.film-details__comment[data-id="${this._deletetingFilmComment.id}"]`);

    this.shake(element, () => {
      this._deletetingFilmComment.isDeleting = false;
      this.updateState(this._filmCommentsState);
    });
  }

  abortNewCommentState() {
    const element = this.getElement().querySelector('.film-details__new-comment');

    this.shake(element, () => {
      this._newCommentState = {
        ...this._newCommentState,
        isSubmiting: false,
      };
      this.updateState(this._newCommentState);
    });
  }

  static parseFilmToState(film) {
    return {...film};
  }

  static parseStateToFilm(state) {
    return {...state};
  }

  static parseCommentsToState(comments) {
    return comments.map((comment) => ({...comment, isDeleting: false}));
  }

  static parseStateToComment(state) {
    state = {...state};
    delete state.isDeleting;

    return state;
  }

  static parseNewCommentToState(newComment) {
    return {...newComment, isSubmiting: false};
  }

  static parseStateToNewComment(state) {
    state = {...state};
    delete state.isSubmiting;

    return state;
  }
}
