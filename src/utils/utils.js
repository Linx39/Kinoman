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


const formatDate = (date, dateFormat) => dayjs(date).format(dateFormat);

const convertTime = (time) => {
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

const addClassName = (isAdd, className) => isAdd ? className : '';

const removeAllChildren = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const renderTemplate = (container, template, place = PLACE_DEFAULT) => {
  container.insertAdjacentHTML(place, template);
};

const render = (container, element, place = RenderPosition.BEFOREEND) => {
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

export { convertTime, DateFormat, formatDate,
  addClassName, removeAllChildren,
  RenderPosition, renderTemplate, render, createElement,
  isEscEvent };
