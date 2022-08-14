import SmartView from './smart.js';
import { convertDateToHumanFormat } from '../utils/common.js';

const createCommentTemplate = (filmComment) => {
  const {id, author, comment, date, emotion } = filmComment;
  const dateTemplate = convertDateToHumanFormat(date);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${emotion}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dateTemplate}</span>
          <button class="film-details__comment-delete" data-id = "${id}">Delete</button>
        </p>
      </div>
    </li>`);
};

const createCommentsTemplate = (filmComments) => Object.values(filmComments)
  .map((filmComment) => createCommentTemplate(filmComment))
  .join('');

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
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentTemplate}</textarea>
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
  const commentsTemplate = createCommentsTemplate(filmComments);
  const newCommentsTemplate = createNewCommentTemplate(newComment);
  const commentsCount = filmComments.length;

  return (
    `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
        <ul class="film-details__comments-list">
          ${commentsTemplate}
        </ul>
        ${newCommentsTemplate}
      </section>
    </div>`);
};

export default class FilmDetailsBottom extends SmartView {
  constructor(filmComments) {
    super();
    this._filmComments = filmComments;

    this._newComment = {
      id: null,
      author: null,
      comment: null,
      date: null,
      emotion: null,
      imgAlt: null,
    },

    this._emojiListHandler = this._emojiListHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._filmComments, this._newComment);
  }

  _emojiListHandler(evt) {
    if (evt.target.tagName !== 'IMG') {
      return;
    }
    evt.preventDefault();

    this._newComment = {...this._newComment, emotion: evt.target.src, imgAlt: evt.target.parentElement.htmlFor};
    this.updateState(this._newComment);

    for (const input of evt.currentTarget.querySelectorAll('input')) {
      input.checked = false;
    }

    evt.currentTarget.querySelector(`#${evt.target.parentElement.htmlFor}`).checked = true;//или добавить это в if
  }

  _commentInputHandler(evt) {
    evt.preventDefault();

    this._newComment = {
      ...this._newComment,
      comment: evt.target.value,
    };
    this.updateState(this._newComment, true);

  }

  _commentDeleteClickHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    evt.preventDefault();

    this._callback.commentDeleteClick(evt.target.dataset.id);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCommentDeleteClickHandler(this._callback.commentDeleteClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('click', this._emojiListHandler);
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentInputHandler);
  }

  setCommentDeleteClickHandler(callback) {
    this._callback.commentDeleteClick = callback;
    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._commentDeleteClickHandler);
  }
}
