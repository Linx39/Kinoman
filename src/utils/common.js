import dayjs from 'dayjs';

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

export const getRandomDate = (dateMin, dateMax = Date(), isMinute = false) => {
  const diffValue = isMinute ? 'minute' : 'day';
  const dateDiff = dayjs(dateMax).diff(dayjs(dateMin), diffValue) + 1;
  const dateAdd = getRandomInteger(1, dateDiff);

  return dayjs(dateMin).add(dateAdd, diffValue).toDate();
};

export const generateRandomText = (arrayTexts, textCountMin = 1, textCountMax = 1) => new Array(getRandomInteger(textCountMin, textCountMax))
  .fill()
  .map(() => getRandomElementFromArray(arrayTexts))
  .join(' ');

export const isEscEvent = (evt) => (evt.key === 'Escape' || evt.key === 'Esc');

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [...items.slice(0, index), update, ...items.slice(index + 1)];
};
