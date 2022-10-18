import { getDayDiff, convertTimeToHoursAndMinutes, getRandomElementFromArray } from './common.js';
import { ProfileRating, TopType } from '../const.js';

const topFilter = {
  [TopType.TOPRATED]:
    {
      max: (films) => Math.max(...films.map((film) => film.rating)),
      filter: (films) => films.filter((film) => film.rating === topFilter[TopType.TOPRATED].max(films)),
    },
  [TopType.MOSTCOMMENTED]:
    {
      max: (films) => Math.max(...films.map((film) => film.comments.length)),
      filter: (films) => films.filter((film) => film.comments.length === topFilter[TopType.MOSTCOMMENTED].max(films)),
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

export const getTopFilms = (films, count, topType) => {
  const topFilms = new Array();
  const copyFilms = films.slice();

  for (let i = 0; i < count; i++) {
    const filteredCopyFilms = topFilter[topType].filter(copyFilms);

    if (filteredCopyFilms.length !== 0) {
      const topFilm = getRandomElementFromArray(filteredCopyFilms);
      const index = copyFilms.findIndex((film) => film.id === topFilm.id);
      copyFilms.splice(index, 1);
      topFilms.push(topFilm);
    }
  }

  return topFilms;
};

export const getDuration = (films) => films.reduce((sum, film) => sum + film.runtime, 0);

export const getUniqueGenresToCount = (films) => {
  let allGenres = [];
  films.forEach((film) => allGenres = [...allGenres, ...film.genres]);
  const uniqueGenresToCount = Array.from(new Set(allGenres))
    .map((genre) => ({genre, count: allGenres.filter((value) => value === genre).length}));

  return uniqueGenresToCount;
};

export const getGenresSortByCount = (films) => getUniqueGenresToCount(films).sort((elementA, elementB) => elementB.count - elementA.count);

export const getTopGenre = (films) => {
  if (films.length === 0) {
    return '';
  }

  return getGenresSortByCount(films)[0].genre;
};
