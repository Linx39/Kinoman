import { getRandomInteger, getRandomElement, getRandomDate } from '../util/util.js';

const AUTHOR = [
  'Tim Macoveev',
  'John Doe',
  'Bfg Bghhghg',
  'G God',
  'Olga R',
];

const COMMENTS = [
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'lmost two hours? Seriously?',
  'NBhvgcg  Nb nvgb vbdf',
  'Gncjvnfj njnbfjd ,cmbfvdhfdff',
  'Omcmvbfh v kvdhhsdmd mnhbvgv',
];

const EMOTION = [
  'angry.png',
  'puke.png',
  'sleeping.png',
  'smile.png',
];

const generateComment = () => ({
  author: getRandomElement(AUTHOR),
  comment: getRandomElement(COMMENTS),
  date: getRandomDate('2019.01.01'),
  emotion: `./images/emoji/${getRandomElement(EMOTION)}`,
});

// const comm = generateComment();
// console.log(comm);

const commentsCount = getRandomInteger(0,5);

const generateComments = () => {
  const arr = new Array(commentsCount);

    arr.fill(null);

    arr.map(generateComment);
    return arr;
};

const commmm = generateComments();
console.log(commmm);

export { generateComments };
