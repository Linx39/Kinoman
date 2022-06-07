const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const Rating = {
  MIN: 0,
  MAX: 100,
};

const Year = {
  MIN: 1900,
  MAX: 2022,
};

const DescriptionCount = {
  MIN: 1,
  MAX: 5,
};

const CommentsCount = {
  MIN: 0,
  MAX: 5,
};

const TITLES = [
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Dance of Life',
];

const GENRES = [
  'Cartoon',
  'Comedy',
  'Drama',
  'Western',
  'Musical',
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const getRandomText = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

const generateDescription = () => {
  let description = '';
  for (let i = 1; i < getRandomInteger(DescriptionCount.MIN, DescriptionCount.MAX); i++) {
    description += getRandomText(DESCRIPTIONS);
  }
  return description;
};

export const generateFilm = () => ({
  title: getRandomText(TITLES),
  rating: getRandomInteger(Rating.MIN, Rating.MAX)/10,
  year: getRandomInteger(Year.MIN, Year.MAX),
  duration: `${getRandomInteger(1,24)}h${getRandomInteger(0,60)}m`,
  genre: getRandomText(GENRES),
  poster: `./images/posters/${getRandomText(POSTERS)}`,
  description: generateDescription(),
  comments: getRandomInteger(CommentsCount.MIN, CommentsCount.MAX),
  watchlist: Boolean(getRandomInteger(0, 1)),
  watched: Boolean(getRandomInteger(0, 1)),
  favorite: Boolean(getRandomInteger(0, 1)),
});
