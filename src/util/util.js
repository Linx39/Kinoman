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

const getRandomDate = (dateMin, dateMax = Date(), isMin = false) => {
  const diffValue = isMin ? 'minute' : 'day';
  const dateDiff = getRandomInteger(dayjs(dateMax).diff(dayjs(dateMin), diffValue) +1);   //?????
  return dayjs(dateMin).add(dateDiff, diffValue).toDate();
};

const getRandomRuntime = (timeMin, timeMax) => {
  const randomRuntime = getRandomInteger(timeMin, timeMax);
  const hours = Math.floor(randomRuntime / 60);
  let minutes = randomRuntime - hours * 60;
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
  .map(() => getRandomElement(arrayTexts))
  .join(' ');

const addClassName = (isAdd, className) => (
  isAdd
    ? className
    : ''
);

export { getRandomInteger, getRandomElement, getRandomArray, getRandomDate, getRandomRuntime, generateRandomText, addClassName };
