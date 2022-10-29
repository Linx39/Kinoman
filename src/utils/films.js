import { getDayDiff, convertTimeToHoursAndMinutes, getRandomElementFromArray } from './common.js';
import { ExtraType } from '../const.js';

const ProfileRating = [
  {name: 'Novice', count: 1},
  {name: 'Fan', count: 11},
  {name: 'Movie Buff', count: 21},
];

const ExtraFilter = {
  [ExtraType.TOP_RATED]:
    {
      maxValue: (films) => Math.max(...films.map((film) => film.rating)),
      filterFilms: (films) => films.filter((film) => film.rating === ExtraFilter[ExtraType.TOP_RATED].maxValue(films)),
    },
  [ExtraType.MOST_COMMENTED]:
    {
      maxValue: (films) => Math.max(...films.map((film) => film.comments.length)),
      filterFilms: (films) => films.filter((film) => film.comments.length === ExtraFilter[ExtraType.MOST_COMMENTED].maxValue(films)),
    },
};

export const sortFilmsDate = (filmA, filmB) => getDayDiff(filmB.releaseDate, filmA.releaseDate);

export const sortFilmsRating = (filmA, filmB) => filmB.rating - filmA.rating;

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
  const genresToCount = films
    .reduce((accumulator, film) => {
      film.genres.forEach((genre) => {
        accumulator = [genre] in accumulator
          ? {...accumulator, [genre]: accumulator[genre] += 1}
          : {...accumulator, [genre]: 1};
      });

      return accumulator;
    }, {});

  return Object.entries(genresToCount).map(([genre, count]) => ({genre, count}));
};

export const getGenresSortByCount = (films) => getUniqueGenresToCount(films).sort((elementA, elementB) => elementB.count - elementA.count);

export const getTopGenre = (films) => {
  if (films.length === 0) {
    return '';
  }

  return getGenresSortByCount(films)[0].genre;
};
