import { isDateInRange } from './common.js';

const Range = {
  DAY: 1,
  WEEK: 7,
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
  [StatisticFilterType.TODAY]: (films) => films.filter((film) => isDateInRange(film.watchingDate, Range.DAY)),
  [StatisticFilterType.WEEK]: (films) => films.filter((film) => isDateInRange(film.watchingDate, Range.WEEK)),
  [StatisticFilterType.MONTH]: (films) => films.filter((film) => isDateInRange(film.watchingDate, Range.MONTH)),
  [StatisticFilterType.YEAR]: (films) => films.filter((film) => isDateInRange(film.watchingDate, Range.YEAR)),
};
