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

const Emotion = {
  angry: 'angry.png',
  puke: 'puke.png',
  sleeping: 'sleeping.png',
  smile: 'smile.png',
};

const generateComment = () => ({
  author: getRandomElement(AUTHOR),
  comment: getRandomElement(COMMENTS),
  date: getRandomDate('2019.01.01', undefined, true),
  emotion: `./images/emoji/${getRandomElement(Object.values(Emotion))}`,
});

export const generateComments = () => new Array(getRandomInteger(0,5)).fill(null).map(generateComment);
