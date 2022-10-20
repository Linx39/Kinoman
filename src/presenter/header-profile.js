import HeaderProfileView from '../view/header-profile.js';
import { render, replace, remove } from '../utils/render.js';
import { filter} from '../utils/filter.js';
import { FilterType } from '../const.js';
import { getRatingName } from '../utils/films.js';


export default class HeaderProfile {
  constructor(headerProfileContainer, filmsModel) {
    this._headerProfileContainer = headerProfileContainer;
    this._filmsModel = filmsModel;

    this._headerProfileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const films = this._filmsModel.getFilms();
    const filmsCount = filter[FilterType.HISTORY](films).length;
    const ratingName = getRatingName(filmsCount);

    const prevHeaderProfileComponent = this._headerProfileComponent;
    this._headerProfileComponent = new HeaderProfileView(ratingName);

    if (prevHeaderProfileComponent === null) {
      render(this._headerProfileContainer, this._headerProfileComponent);
      return;
    }

    replace(this._headerProfileComponent, prevHeaderProfileComponent);
    remove(prevHeaderProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
