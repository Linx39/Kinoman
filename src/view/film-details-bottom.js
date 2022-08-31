import he from 'he';
import SmartView from './smart.js';
import { convertDateToHumanFormat } from '../utils/common.js';
import { isCtrlEnterEvent } from '../utils/common.js';

const NO_COMMENT = '(the author left no comment)';

const createCommentTemplate = (filmComment) => {
  const {id, author, comment, date, emotion } = filmComment;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${emotion}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${(comment !== null && comment.trim() !== '')? comment : NO_COMMENT}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${convertDateToHumanFormat(date)}</span>
          <button class="film-details__comment-delete" data-id = "${id}">Delete</button>
        </p>
      </div>
    </li>`);
};

const createNewCommentTemplate = (newComment) => {
  const {comment, emotion, imgAlt} = newComment;
  const emotiomTemplate = emotion !== null? `<img src="${emotion}" width="55" height="55" alt="${imgAlt}"></img>` : '';
  const commentTemplate = comment !== null? comment : '';

  return (
    `<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
          ${emotiomTemplate}
        </div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(commentTemplate)}</textarea>
        </label>
        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>`);
};

const createFilmDetailsTemplate = (filmComments, newComment) => {
  const commentsTemplate = Object.values(filmComments)
    .map((filmComment) => createCommentTemplate(filmComment))
    .join('');

  const newCommentsTemplate = createNewCommentTemplate(newComment);

  return (
    `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmComments.length}</span></h3>
        <ul class="film-details__comments-list">
          ${commentsTemplate}
        </ul>
        ${newCommentsTemplate}
      </section>
    </div>`);
};

export default class FilmDetailsBottom extends SmartView {
  constructor(filmComments, newComment) {
    super();
    this._filmComments = filmComments;

    this._newCommentState = FilmDetailsBottom.parseCommentToState(newComment);

    this._onEmojiListClick = this._onEmojiListClick.bind(this);
    this._onCommentInput = this._onCommentInput.bind(this);
    this._onCommentDeleteClick = this._onCommentDeleteClick.bind(this);
    this._onCtrlEnterDown = this._onCtrlEnterDown.bind(this);

    this._setInnerListeners();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._filmComments, this._newCommentState);
  }

  _onEmojiListClick(evt) {
    if (evt.target.tagName !== 'IMG') {
      return;
    }
    evt.preventDefault();

    this._newCommentState = {...this._newCommentState, emotion: evt.target.src, imgAlt: evt.target.parentElement.htmlFor};
    this.updateState(this._newCommentState);

    for (const input of evt.currentTarget.querySelectorAll('input')) {
      input.checked = false;
    }

    evt.currentTarget.querySelector(`#${evt.target.parentElement.htmlFor}`).checked = true;//или добавить это в if
  }

  _onCommentInput(evt) {
    evt.preventDefault();
    this._newCommentState = {
      ...this._newCommentState,
      comment: evt.target.value,
    };
    this.updateState(this._newCommentState, true);
  }

  restoreListeners() {
    this._setInnerListeners();
    this.setCommentDeleteClickListener(this._callback.commentDeleteClick);
    this.setCommentSubmitListener(this._callback.commentSubmit);
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
    this._callback.commentDeleteClick(evt.target.dataset.id);
  }

  setCommentDeleteClickListener(callback) {
    this._callback.commentDeleteClick = callback;
    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._onCommentDeleteClick);
  }

  _onCtrlEnterDown(evt) {
    if (isCtrlEnterEvent(evt)) {
      evt.preventDefault();
      this._callback.commentSubmit(FilmDetailsBottom.parseStateToComment(this._newCommentState));
      document.removeEventListener('keydown', this._onCtrlEnterDown);// еще надо отписаться при закрытии
    }
  }

  setCommentSubmitListener(callback) {
    this._callback.commentSubmit = callback;
    // this.getElement().querySelector('.film-details__comment-input')
    document
      .addEventListener('keydown', this._onCtrlEnterDown);
  }

  static parseCommentToState(comment) {
    return {...comment, imgAlt: null};
  }

  static parseStateToComment(state) {
    state = {...state};
    delete state.imgAlt;
    return state;
  }
}
