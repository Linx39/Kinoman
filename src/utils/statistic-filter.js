import { isDateInRange } from './common.js';

const Period = {
  DAY: 1,
  WEEK: 6,
  MONTH: 30,
  YEAR: 365,
};

export const StatisticFilterType = {
  ALLTIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const StatisticFilterName = [
  {type: StatisticFilterType.ALLTIME, name: 'All time'},
  {type: StatisticFilterType.TODAY, name: 'Today'},
  {type: StatisticFilterType.WEEK, name: 'Week'},
  {type: StatisticFilterType.MONTH, name: 'Month'},
  {type: StatisticFilterType.YEAR, name: 'Year'},
];

export const statisticFilter = {
  [StatisticFilterType.ALLTIME]: (films) => films,
  [StatisticFilterType.TODAY]: (films) => films.filter((film) => isDateInRange(film.watchingDate, Period.DAY)),
  [StatisticFilterType.WEEK]: (films) => films.filter((film) => isDateInRange(film.watchingDate, Period.WEEK)),
  [StatisticFilterType.MONTH]: (films) => films.filter((film) => isDateInRange(film.watchingDate, Period.MONTH)),
  [StatisticFilterType.YEAR]: (films) => films.filter((film) => isDateInRange(film.watchingDate, Period.YEAR)),
};
