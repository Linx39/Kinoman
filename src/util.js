import dayjs from 'dayjs';

const DateFormat = {
  ONLY_YEAR: 'YYYY',
  FULL_DATE: 'DD MMMM YYYY',
  DATE_AND_TIME: 'YYYY/MM/DD hh:mm',
};

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const HOUR = 60;
const PLACE_DEFAULT = 'beforeend';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomElementFromArray = (array) => array[getRandomInteger(0, array.length - 1)];

const getRandomArrayFromArray = (array, arrayLength = array.length) => {
  const copyArray = array.slice();

  return new Array(getRandomInteger(1, arrayLength))
    .fill(null)
    .map((element) => {
      const index = getRandomInteger(0, copyArray.length-1);
      element = copyArray[index];
      copyArray.splice(index, 1);
      return element;
    });
};

const getRandomDate = (dateMin, dateMax = Date(), isMinute = false) => {
  const diffValue = isMinute ? 'minute' : 'day';
  const dateDiff = dayjs(dateMax).diff(dayjs(dateMin), diffValue) + 1;
  const dateAdd = getRandomInteger(1, dateDiff);

  return dayjs(dateMin).add(dateAdd, diffValue).toDate();
};

const formatDate = (date, dateFormat) => dayjs(date).format(dateFormat);

const convertTime = (runtime) => {
  const hours = Math.floor(runtime / HOUR);
  let minutes = runtime - hours * HOUR;

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
};

const generateRandomText = (arrayTexts, textCountMin = 1, textCountMax = 1) => new Array(getRandomInteger(textCountMin, textCountMax))
  .fill()
  .map(() => getRandomElementFromArray(arrayTexts))
  .join(' ');

const addClassName = (isAdd, className) => (
  isAdd
    ? className
    : ''
);

const removeAllChildren = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const renderTemplate = (container, template, place = PLACE_DEFAULT) => {
  container.insertAdjacentHTML(place, template);
};

const renderElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export { getRandomInteger, getRandomElementFromArray, getRandomArrayFromArray,
  getRandomDate, convertTime, generateRandomText,
  DateFormat, formatDate, addClassName, removeAllChildren,
  RenderPosition, renderTemplate, renderElement, createElement };
