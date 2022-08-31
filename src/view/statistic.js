import SmartView from './smart.js';
import { getRatingName } from '../utils/film.js';
import { isDateInPeriod, convertTimeToHoursAndMinutes } from '../utils/common.js';

const Period = {
  DAY: 1,
  WEEK: 6,
  MONTH: 30,
  YEAR: 365,
};

const StatisticFilterType = {
  ALLTIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const StatisticFilterName = [
  {type: StatisticFilterType.ALLTIME, name: 'All time'},
  {type: StatisticFilterType.TODAY, name: 'Today'},
  {type: StatisticFilterType.WEEK, name: 'Week'},
  {type: StatisticFilterType.MONTH, name: 'Month'},
  {type: StatisticFilterType.YEAR, name: 'Year'},
];

const statisticFilter = {
  [StatisticFilterType.ALLTIME]: (films) => films,
  [StatisticFilterType.TODAY]: (films) => films.filter((film) => isDateInPeriod(film.watchingDate, Period.DAY)),
  [StatisticFilterType.WEEK]: (films) => films.filter((film) => isDateInPeriod(film.watchingDate, Period.WEEK)),
  [StatisticFilterType.MONTH]: (films) => films.filter((film) => isDateInPeriod(film.watchingDate, Period.MONTH)),
  [StatisticFilterType.YEAR]: (films) => films.filter((film) => isDateInPeriod(film.watchingDate, Period.YEAR)),
};

const getDuration = (films) => films.reduce((sum, film) => sum + film.runtime, 0);

const getTopGenre = (films) => {
  if (films.length === 0) {
    return '';
  }

  let genresList = new Array();
  films.forEach((film) => genresList = [...genresList, ...film.genres]);

  const genres = Array.from(new Set(genresList))
    .map((genre) => ({genre, count: genresList.filter((value) => value === genre).length}));

  return genres.find((value) => value.count = Math.max(...genres.map((element) => element.count))).genre;
};

const createStatisticFiltersTemplate = (item, currentFilter) => {
  const {type, name} = item;
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${type === currentFilter ? 'checked' : ''}>
    <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`);
};

const createStatisticTemplate = (films, currentFilter) => {
  const statisticFiltersTemplate = StatisticFilterName
    .map((item) => createStatisticFiltersTemplate(item, currentFilter))
    .slice()
    .join('');

  const filterFilms = statisticFilter[currentFilter](films);

  const totalDuration = convertTimeToHoursAndMinutes(getDuration(filterFilms));

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${getRatingName(films.length)}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${statisticFiltersTemplate}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${filterFilms.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDuration.hours} <span class="statistic__item-description">h</span> ${totalDuration.minutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${getTopGenre(filterFilms)}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`);
};

export default class Statistic extends SmartView {
  constructor(films) {
    super();
    this._films = films.filter((film) => film.watched);

    this._filters = StatisticFilterName;
    this._currentFilter = StatisticFilterType.ALLTIME;

    this._onStatisticFiltersClick = this._onStatisticFiltersClick.bind(this);

    this._setStatisticFilters();
    this._setCharts();

  }

  removeElement() {
    super.removeElement();// это не нужно, если не буду добавлять что то в метод
  }

  getTemplate() {
    return createStatisticTemplate(this._films, this._currentFilter);
  }

  restoreListeners() {
    this._setCharts();
    this._setStatisticFilters();
  }

  _onStatisticFiltersClick(evt) {
    if (!evt.target.classList.contains('statistic__filters-input')) {
      return;
    }
    evt.preventDefault();

    this._currentFilter = evt.target.value;
    this.updateState(this._filters);
  }

  _setStatisticFilters() {
    this.getElement()
      .querySelector('.statistic__filters')
      .addEventListener('click', this._onStatisticFiltersClick);
  }

  _setCharts() {
    // Нужно отрисовать два графика
  }
}
