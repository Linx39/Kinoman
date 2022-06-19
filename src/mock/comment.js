import { getRandomElementFromArray, getRandomDate } from '../util.js';

const path = './images/emoji/';

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

export const generateComment = () => ({
  author: getRandomElementFromArray(AUTHOR),
  comment: getRandomElementFromArray(COMMENTS),
  date: getRandomDate('2019.01.01', undefined, true),
  emotion: `${path}${getRandomElementFromArray(Object.values(Emotion))}`,
});
