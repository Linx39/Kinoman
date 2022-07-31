import SmartView from './smart.js';
import { formatDate, DateFormats } from '../utils/film.js';

const createFilmDetailsTemplate = (filmComments) => {
// console.log (filmComments);
  const createCommentTemplate = (filmComment) => {
    const {author, comment, date, emotion, isNewComment} = filmComment;

    if (!isNewComment) {
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
    }
  };

  const createCommentsTemplate = () => filmComments
    .map((filmComment) => createCommentTemplate(filmComment))
    .join('');

  const createNewCommentTemplate = (filmComment) => {
    const {author, comment, date, emotion} = filmComment;

    const emotiomTemplate = emotion? `<img src="${emotion}" width="55" height="55" alt="emoji-smile"></img>` : '';
    const commentTemplate = comment? comment : '';

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
  const newFilmComment = filmComments.find((filmComment) => filmComment.isNewComment);
  const newCommentsTemplate = createNewCommentTemplate(newFilmComment);
  const commentsCount = filmComments.length - 1;

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

    this._state = FilmDetailsBottom.parseFilmCommentsToState(filmComments);

    this._newComment = this._state.find((element) => element.isNewComment);

    this._emojiListToggleHandler = this._emojiListToggleHandler.bind(this);
    this._descriptionInputHandler = this._descriptionInputHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._state);
  }

  reset(film) {
    this.updateData(
      FilmDetailsBottom.parseStateToFilmComments(film),
    );
  }

  _emojiListToggleHandler(evt) {
    evt.preventDefault();
    this.updateData(
      this._newComment,
      {
        emotion: evt.target.src,
      });
  }

  _descriptionInputHandler(evt) {
    evt.preventDefault();
    this.updateData(
      this._newComment,
      {
        comment: evt.target.value,
      },
      true);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    // this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emojiListToggleHandler);

    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._descriptionInputHandler);
  }

  static parseFilmCommentsToState(filmComments) {
    filmComments = filmComments
      .slice()
      .map((filmComment) => ({...filmComment, isNewComment: false}));

    filmComments.push(
      {
        id: null,
        author: null,
        comment: null,
        date: null,
        emotion: null,
        isNewComment: true,
      },
    );

    return filmComments;
  }

  static parseStateToFilmComments(state) {
    console.log (state);
    state.splice(state.length - 1);

    state = state
      .map((filmComment) => delete filmComment.isNewComment);

    return state;
  }
}
