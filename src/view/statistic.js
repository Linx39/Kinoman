import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import { getRatingName } from '../utils/films.js';
import { isDateInRange, convertTimeToHoursAndMinutes } from '../utils/common.js';

const BAR_HEIGHT = 50;

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
  [StatisticFilterType.TODAY]: (films) => films.filter((film) => isDateInRange(film.watchingDate, Period.DAY)),
  [StatisticFilterType.WEEK]: (films) => films.filter((film) => isDateInRange(film.watchingDate, Period.WEEK)),
  [StatisticFilterType.MONTH]: (films) => films.filter((film) => isDateInRange(film.watchingDate, Period.MONTH)),
  [StatisticFilterType.YEAR]: (films) => films.filter((film) => isDateInRange(film.watchingDate, Period.YEAR)),
};

const getDuration = (films) => films.reduce((sum, film) => sum + film.runtime, 0);

const getUniqueGenresToCount = (films) => {
  let allGenres = [];
  films.forEach((film) => allGenres = [...allGenres, ...film.genres]);
  const uniqueGenresToCount = Array.from(new Set(allGenres))
    .map((genre) => ({genre, count: allGenres.filter((value) => value === genre).length}));

  return uniqueGenresToCount;
};

const getGenresSortByCount = (films) => getUniqueGenresToCount(films).sort((elementA, elementB) => elementB.count - elementA.count);

const getTopGenre = (films) => {
  if (films.length === 0) {
    return '';
  }

  return getGenresSortByCount(films)[0].genre;
};

const renderGenresChart = (statisticCtx, genres, counts) => new Chart(statisticCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: genres,
    datasets: [{
      data: counts,
      backgroundColor: '#ffe800',
      hoverBackgroundColor: '#ffe800',
      anchor: 'start',
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 20,
        },
        color: '#ffffff',
        anchor: 'start',
        align: 'start',
        offset: 40,
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#ffffff',
          padding: 100,
          fontSize: 20,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        barThickness: 24,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

const createStatisticFiltersTemplate = (item, currentFilter) => {
  const {type, name} = item;
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${type === currentFilter ? 'checked' : ''}>
    <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`);
};

const createStatisticTemplate = (filmsCount, currentFilter, filterFilms) => {
  const statistiRankTemplate = filmsCount !== 0
    ? `<img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getRatingName(filmsCount)}</span>`
    : '';

  const statisticFiltersTemplate = StatisticFilterName
    .map((item) => createStatisticFiltersTemplate(item, currentFilter))
    .slice()
    .join('');

  const totalDuration = convertTimeToHoursAndMinutes(getDuration(filterFilms));

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        ${statistiRankTemplate}
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
    this._filmsCount = this._films.length;

    this._currentFilter = StatisticFilterType.ALLTIME;
    this._filterFilms = this._films;

    this._onStatisticFiltersClick = this._onStatisticFiltersClick.bind(this);

    this._setStatisticFilters();
    this._setCharts();

  }

  getTemplate() {
    return createStatisticTemplate(this._filmsCount, this._currentFilter, this._filterFilms);
  }

  restoreListeners() {
    this._setCharts();
    this._setStatisticFilters();
  }

  removeElement() {
    this._resetChart();
    super.removeElement();
  }

  _onStatisticFiltersClick(evt) {
    if (!evt.target.classList.contains('statistic__filters-input')) {
      return;
    }
    evt.preventDefault();

    this._currentFilter = evt.target.value;
    this._filterFilms = statisticFilter[this._currentFilter](this._films);
    this.updateState(this._filterFilms);
  }

  _setStatisticFilters() {
    this.getElement()
      .querySelector('.statistic__filters')
      .addEventListener('click', this._onStatisticFiltersClick);
  }

  _resetChart() {
    if (this._genresChart !== null) {
      this._genresChart === null;
    }
  }

  _setCharts() {
    this._resetChart();

    const genresToCount = getGenresSortByCount(this._filterFilms);
    const genres = genresToCount.map((value) => value.genre);
    const counts = genresToCount.map((value) => value.count);

    const statisticCtxElement = this.getElement().querySelector('.statistic__chart');
    statisticCtxElement.height = BAR_HEIGHT * genres.length;

    this._genresChart = renderGenresChart(statisticCtxElement, genres, counts);
  }
}
