import NoMoviesView from '../view/no-movies.js';
import { render, replace, remove } from '../utils/render.js';

export default class NoMovies {
  constructor(noMoviesContainer, filterModel) {
    this._noMoviesContainer = noMoviesContainer;
    this._filterModel = filterModel;

    this._noMoviesComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const noMoviesComponent = this._noMoviesComponent;

    this._noMoviesComponent = new NoMoviesView(this._filterModel.getFilter());
    if (noMoviesComponent === null) {
      render(this._noMoviesContainer, this._noMoviesComponent);
      return;
    }

    replace(this._noMoviesComponent, noMoviesComponent);
    remove(noMoviesComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
