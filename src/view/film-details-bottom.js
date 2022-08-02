import SmartView from './smart.js';
import { formatDate, DateFormats } from '../utils/film.js';

const createFilmDetailsTemplate = (filmComments, newComment) => {

  const createCommentTemplate = (filmComment) => {
    const {author, comment, date, emotion} = filmComment;

    return (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="${emotion}" width="55" height="55" alt="emoji-smile">
        </span>
        <div>
          <p class="film-details__comment-text">${comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${formatDate(date, DateFormats.DATE_AND_TIME)}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`);
  };

  const createCommentsTemplate = () => filmComments
    .map((filmComment) => createCommentTemplate(filmComment))
    .join('');

  const createNewCommentTemplate = () => {
    const {author, comment, date, emotion} = newComment;

    const emotiomTemplate = emotion !== null? `<img src="${emotion}" width="55" height="55" alt="emoji-smile"></img>` : '';
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

  const commentsTemplate = createCommentsTemplate();
  const newCommentsTemplate = createNewCommentTemplate();
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
  constructor(film, filmsComments) {
    super();
    this._film = film;

    this._newComment = {
      id: null,
      author: null,
      comment: null,
      date: null,
      emotion: null,
      isNewComment: true,
    };

    this._stateFilmsComments = FilmDetailsBottom.parseFilmsCommentsToState(filmsComments, this._newComment);

    this._filmComments = this._stateFilmsComments
      .slice()
      .filter((comment) => film.comments.some((id) => id === comment.id && !comment.isNewComment));

    this._emojiListHandler = this._emojiListHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);

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
    this.updateData(
      this._newComment,
      {
        emotion: evt.target.src,
      });
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData(
      this._newComment,
      {
        comment: evt.target.value,
      },
      true);
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emojiListHandler);

    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);

    this.getElement()
      .querySelectorAll('.film-details__comment-delete')
      .forEach((buttonDelete) => buttonDelete.addEventListener('click', this._commentDeleteHandler));
  }

  static parseFilmsCommentsToState(filmsComments, newComment) {
    filmsComments = filmsComments
      .map((filmComment) => ({...filmComment, isNewComment: false}));// объединить со следующим

    filmsComments.push(newComment);

    return filmsComments;
  }

  static parseStateToFilmComments(stateFilmsComments) {
    stateFilmsComments.splice(stateFilmsComments.length - 1);

    stateFilmsComments = stateFilmsComments
      .forEach((filmComment) => delete filmComment.isNewComment);
    return stateFilmsComments;
  }
}
