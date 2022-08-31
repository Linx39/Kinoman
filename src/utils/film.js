import { getDayDiff } from './common.js';
import { ProfileRating } from '../const.js';

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

export const sortFilmsComments = (filmA, filmB) => {
  const weight = getWeightForNullData(filmA.comments.length, filmB.comments.length);
  if (weight !== null) {
    return -weight;
  }

  return -(filmA.comments.length - filmB.comments.length);
};

export const getRatingName = (filmsCount) => {
  if (filmsCount === 0) {
    return null;
  }

  return ProfileRating
    .slice()
    .reverse()
    .find((profile) => filmsCount >= profile.count)
    .name;
};
