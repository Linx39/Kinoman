import dayjs from 'dayjs';

const HOUR = 60;

export const DateFormat = {
  ONLY_YEAR: 'YYYY',
  FULL_DATE: 'DD MMMM YYYY',
  DATE_AND_TIME: 'YYYY/MM/DD hh:mm',
};

export const formatDate = (date, dateFormat) => dayjs(date).format(dateFormat);

export const convertTime = (time) => {
  const hours = Math.floor(time / HOUR);
  let minutes = time - hours * HOUR;

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
};

export const addClassName = (isAdd, className) => isAdd ? className : '';

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
    return weight;
  }

  return dayjs(filmA.releaseDate).diff(dayjs(filmB.releaseDate));
};

export const sortFilmsRating = (filmA, filmB) => {
  const weight = getWeightForNullData(filmA.rating, filmB.rating);
  if (weight !== null) {
    return weight;
  }

  return filmA.rating - filmB.rating;
};
