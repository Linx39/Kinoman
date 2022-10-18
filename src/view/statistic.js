import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import { getRatingName, getDuration, getGenresSortByCount, getTopGenre } from '../utils/films.js';
import { convertTimeToHoursAndMinutes } from '../utils/common.js';
import { StatisticFilterType, StatisticFilterName, statisticFilter } from '../utils/statistic-filter.js';

const BAR_HEIGHT = 50;

const CHART_TYPE = 'horizontalBar';

const ChartColor = {
  BACKGROUND: '#ffe800',
  HOVER_BACKGROUND: '#ffe800',
  OPTION: '#ffffff',
  FONT:'#ffffff',
};

const Position = {
  START: 'start',
};

const ChartProperties = {
  FontSize: {
    DATALABELS: 20,
    TICKS: 20,
  },
  OFFSET: 40,
  PADDING: 100,
  BARTHICKNESS: 24,
};

const renderGenresChart = (statisticCtx, genres, counts) => new Chart(statisticCtx, {
  plugins: [ChartDataLabels],
  type: CHART_TYPE,
  data: {
    labels: genres,
    datasets: [{
      data: counts,
      backgroundColor: ChartColor.BACKGROUND,
      hoverBackgroundColor: ChartColor.HOVER_BACKGROUND,
      anchor: Position.START,
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: ChartProperties.FontSize.DATALABELS,
        },
        color: ChartColor.OPTION,
        anchor: Position.START,
        align: Position.START,
        offset: ChartProperties.OFFSET,
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: ChartColor.FONT,
          padding: ChartProperties.PADDING,
          fontSize: ChartProperties.FontSize.TICKS,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        barThickness: ChartProperties.BARTHICKNESS,
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

    this._onFiltersClick = this._onFiltersClick.bind(this);

    this._setFiltersClickListener();
    this._setCharts();

  }

  getTemplate() {
    return createStatisticTemplate(this._filmsCount, this._currentFilter, this._filterFilms);
  }

  restoreListeners() {
    this._setCharts();
    this._setFiltersClickListener();
  }

  removeElement() {
    this._resetChart();
    super.removeElement();
  }

  _onFiltersClick(evt) {
    if (!evt.target.classList.contains('statistic__filters-input')) {
      return;
    }
    evt.preventDefault();

    this._currentFilter = evt.target.value;
    this._filterFilms = statisticFilter[this._currentFilter](this._films);
    this.updateState(this._filterFilms);
  }

  _setFiltersClickListener() {
    this.getElement().querySelector('.statistic__filters').addEventListener('click', this._onFiltersClick);
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
