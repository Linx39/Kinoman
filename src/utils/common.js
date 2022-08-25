import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const HOUR = 60;
export const DateFormats = {
  ONLY_YEAR: 'YYYY',
  FULL_DATE: 'DD MMMM YYYY',
  DATE_AND_TIME: 'YYYY/MM/DD hh:mm',
};

export const getDayDiff = (dateA, dateB) => dayjs(dateA).diff(dayjs(dateB));

export const formatDate = (date, dateFormat) => dayjs(date).format(dateFormat);

export const convertDateToHumanFormat = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

export const convertTimeToHoursAndMinutes = (time) => {
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

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElementFromArray = (array) => array[getRandomInteger(0, array.length - 1)];

export const getRandomArrayFromArray = (array, arrayLengthMin = 0, arrayLengthMax = array.length) => {
  const copyArray = array.slice();

  return new Array(getRandomInteger(arrayLengthMin, arrayLengthMax))
    .fill(null)
    .map((element) => {
      const index = getRandomInteger(0, copyArray.length-1);
      element = copyArray[index];
      copyArray.splice(index, 1);
      return element;
    });
};

export const getRandomDate = (dateA, dateB = Date(), isMinute = false) => {
  const unitOfTime = isMinute ? 'minute' : 'day';
  const dateDiff = dayjs(dateB).diff(dayjs(dateA), unitOfTime) + 1;
  const dateAdd = getRandomInteger(1, dateDiff);

  return dayjs(dateA).add(dateAdd, unitOfTime).toDate();
};

export const generateRandomText = (arrayTexts, textCountMin = 1, textCountMax = 1) => new Array(getRandomInteger(textCountMin, textCountMax))
  .fill()
  .map(() => getRandomElementFromArray(arrayTexts))
  .join(' ');

export const isEscEvent = (evt) => (evt.key === 'Escape' || evt.key === 'Esc');

export const isCtrlEnterEvent = (evt) => (evt.ctrlKey && evt.keyCode === 13);