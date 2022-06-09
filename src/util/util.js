import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

const getRandomArray = (array, arrayLength = array.length) => {
  const copyArray = array.slice();
  const randomArrayLength = getRandomInteger(1, arrayLength);

  return new Array(randomArrayLength)
    .fill(null)
    .map((element) => {
      const index = getRandomInteger(0, copyArray.length-1);
      element = copyArray[index];
      copyArray.splice(index, 1);
      return element;
    });
};

const getRandomDate = (dateMin, dateMax = Date()) => {
  const dateDiff = getRandomInteger(dayjs(dateMax).diff(dayjs(dateMin), 'day') +1);
  return dayjs(dateMin).add(dateDiff, 'day').toDate();
};

const generateRandomText = (array, textCountMin = 1, textCountMax = 1) => {
  let text = '';
  for (let i = 1; i < getRandomInteger(textCountMin, textCountMax); i++) {
    text += getRandomElement(array);
  }
  return text;
};

const addClassName = (isAdd, className) => (
  isAdd
    ? className
    : ''
);

export { getRandomInteger, getRandomElement, getRandomArray, getRandomDate, generateRandomText, addClassName };
