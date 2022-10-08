
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
  const dateDiff = dayjs(dateB).diff(dayjs(dateA), unitOfTime);
  const dateAdd = getRandomInteger(0, dateDiff);

  return dayjs(dateA).add(dateAdd, unitOfTime).toDate();
};

export const generateRandomText = (arrayTexts, textCountMin = 1, textCountMax = 1) => new Array(getRandomInteger(textCountMin, textCountMax))
  .fill()
  .map(() => getRandomElementFromArray(arrayTexts))
  .join(' ');
