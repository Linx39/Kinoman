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
