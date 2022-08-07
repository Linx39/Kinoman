import SmartView from './smart.js';
import { convertDateToHumanFormat } from '../utils/common.js';

const createFilmDetailsTemplate = (filmComments) => {

  const createCommentTemplate = (filmComment) => {
    const {id, author, comment, date, emotion, isNewComment} = filmComment;
    if(isNewComment) {
      return;
    }
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

  const createCommentsTemplate = () => Object.values(filmComments)
    .map((filmComment) => createCommentTemplate(filmComment))
    .join('');

  const createNewCommentTemplate = () => {
    const {comment, emotion, imgAlt} = filmComments.newComment;
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

  const commentsTemplate = createCommentsTemplate();
  const newCommentsTemplate = createNewCommentTemplate();
  const commentsCount = Object.keys(filmComments).length - 1;

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
  constructor(film, filmComments) {
    super();
    this._state = FilmDetailsBottom.parseDataToState(filmComments);

    this._emojiListHandler = this._emojiListHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._state);
  }

  _emojiListHandler(evt) {
    if (evt.target.tagName !== 'IMG') {
      return;
    }

    evt.preventDefault();

    const newComment = {...this._state.newComment, emotion: evt.target.src, imgAlt: evt.target.parentElement.htmlFor};
    this.updateState({newComment});

    for (const input of evt.currentTarget.querySelectorAll('input')) {
      input.checked = false;
    }

    evt.currentTarget.querySelector(`#${evt.target.parentElement.htmlFor}`).checked = true;//или добавить это в if

  }

  _commentInputHandler(evt) {
    evt.preventDefault();

    const newComment = {
      ...this._state.newComment,
      comment: evt.target.value,
    };
    this.updateState({newComment}, true);

  }

  _commentDeleteHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    evt.preventDefault();

    const deletedCommentKey = Object
      .entries(this._state)
      .map(([key, comment]) => ({key: key, id: comment.id}))
      .find((item) => (item.id === evt.target.dataset.id)).key;// ппробовать вместо этого filter как в демонстрации

    delete this._state[deletedCommentKey];
    this.updateState(this._state);
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
      .querySelector('.film-details__comments-list')
      .addEventListener('click', this._commentDeleteHandler);

    this.getElement()
      .querySelectorAll('.film-details__comments-list')//зачем здесь all - убрать и проверить
      .forEach((buttonDelete) => buttonDelete.addEventListener('click', this._commentDeleteHandler));
  }

  static parseDataToState(data) {
    data = data.map((comment) => ({...comment, isNewComment: false}));

    data = Object.assign(
      {},
      data,
      {
        newComment: {
          id: null,
          author: null,
          comment: null,
          date: null,
          emotion: null,
          imgAlt: null,
          isNewComment: true,
        },
      },
    );

    return data;
  }

  static parseStateToData(state) {
    delete state.newComment;
    // state.pop(); удаление последнего элемкнта из масива
    // state = Object.assign(
    //   {},
    //   state,
    //   {},
    // );
    return state;
  }
}
