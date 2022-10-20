import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(relativeTime);
dayjs.extend(isBetween);

const HOUR = 60;

const DAY = 'day';

export const DateFormat = {
  ONLY_YEAR: 'YYYY',
  FULL_DATE: 'DD MMMM YYYY',
  DATE_AND_TIME: 'YYYY/MM/DD hh:mm',
};

export const getDayDiff = (dateA, dateB) => dayjs(dateA).diff(dayjs(dateB));

export const formatDate = (date, dateFormat) => dayjs(date).format(dateFormat);

export const convertDateToHumanFormat = (date) => dayjs(date).fromNow();

export const isDateInRange = (date, range) => dayjs(date).isBetween(dayjs().subtract(range, DAY), dayjs().add(1, DAY));

export const convertTimeToHoursAndMinutes = (time) => {
  const hours = Math.floor(time / HOUR);
  const minutes = time - hours * HOUR;
  return {hours, minutes};
};

export const getRandomInteger = (a = 0, b = 1) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(min + Math.random() * (max - min + 1));
};

export const getRandomElementFromArray = (array) => array[getRandomInteger(0, array.length - 1)];

export const isEscEvent = (evt) => (evt.key === 'Escape' || evt.key === 'Esc');

export const isCtrlEnterEvent = (evt) => (evt.ctrlKey && evt.keyCode === 13);

export const isOnline = () => window.navigator.onLine;
