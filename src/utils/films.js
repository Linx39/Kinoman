import { getDayDiff, convertTimeToHoursAndMinutes, getRandomElementFromArray } from './common.js';
import { ExtraType } from '../const.js';

const ProfileRating = [
  {name: 'Novice', count: 1},
  {name: 'Fan', count: 11},
  {name: 'Movie Buff', count: 21},
];

const ExtraFilter = {
  [ExtraType.TOPRATED]:
    {
      maxValue: (films) => Math.max(...films.map((film) => film.rating)),
      filterFilms: (films) => films.filter((film) => film.rating === ExtraFilter[ExtraType.TOPRATED].maxValue(films)),
    },
  [ExtraType.MOSTCOMMENTED]:
    {
      maxValue: (films) => Math.max(...films.map((film) => film.comments.length)),
      filterFilms: (films) => films.filter((film) => film.comments.length === ExtraFilter[ExtraType.MOSTCOMMENTED].maxValue(films)),
    },
};

const getWeightForNullData = (dataA, dataB) => {
  if (dataA === null && dataB === null) {
    return 0;
  }

  if (dataA === null) {
    return 1;
  }

  if (dataB === null) {
    return -1;
  }

  return null;
};

export const sortFilmsDate = (filmA, filmB) => {
  const weight = getWeightForNullData(filmA.releaseDate, filmB.releaseDate);
  if (weight !== null) {
    return -weight;
  }

  return -getDayDiff(filmA.releaseDate, filmB.releaseDate);
};

export const sortFilmsRating = (filmA, filmB) => {
  const weight = getWeightForNullData(filmA.rating, filmB.rating);
  if (weight !== null) {
    return -weight;
  }

  return -(filmA.rating - filmB.rating);
};

export const getRatingName = (count) => {
  if (count === 0) {
    return null;
  }

  return ProfileRating
    .slice()
    .reverse()
    .find((profile) => count >= profile.count)
    .name;
};

export const getRuntimeTemplate = (time) => {
  const hoursAndMinutes = convertTimeToHoursAndMinutes(time);

  const hoursTemplate = hoursAndMinutes.hours !== 0? `${hoursAndMinutes.hours}h` : '';
  const minutesTemplate = hoursAndMinutes.minutes.lenght === 1? `0${hoursAndMinutes.minutes}m` : `${hoursAndMinutes.minutes}m`;

  return `${hoursTemplate} ${minutesTemplate}`;
};

export const getExtraFilms = (films, count, type) => {
  const copyFilms = films.slice();

  const extraFilms = new Array(count).fill().map(() => {
    const filteredCopyFilms = ExtraFilter[type].filterFilms(copyFilms);

    if (filteredCopyFilms.length === 0) {
      return null;
    }

    const extraFilm = getRandomElementFromArray(filteredCopyFilms);
    const index = copyFilms.findIndex((film) => film.id === extraFilm.id);
    copyFilms.splice(index, 1);

    return extraFilm;
  });

  return extraFilms.filter((film) => film !== null);
};

export const getSumDuration = (films) => films.reduce((sum, film) => sum + film.runtime, 0);

export const getUniqueGenresToCount = (films) => {
  let allGenres = [];

  films.forEach((film) => allGenres = [...allGenres, ...film.genres]);

  const uniqueGenresToCount = Array.from(new Set(allGenres))
    .map((genre) => ({genre, count: allGenres.filter((item) => item === genre).length}));

  return uniqueGenresToCount;
};

export const getGenresSortByCount = (films) => getUniqueGenresToCount(films).sort((elementA, elementB) => elementB.count - elementA.count);

export const getTopGenre = (films) => {
  if (films.length === 0) {
    return '';
  }

  return getGenresSortByCount(films)[0].genre;
};
