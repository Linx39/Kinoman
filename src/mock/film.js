import { getRandomInteger, getRandomElement, getRandomArray, getRandomDate, getRandomRuntime, generateRandomText } from '../util/util.js';
import { generateComments } from './comment.js';

const Rating = {
  MIN: 0,
  MAX: 100,
};

const DATE_MIN = '1900.01.01';

const DescriptionCount = {
  MIN: 1,
  MAX: 5,
};

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const TITLES = [
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Dance of Life',
];

const DIRECTORS = [
  'Стивен Спилберг',
  'Мартин Скорсезе',
  'Квентин Тарантино',
  'Гай Ричи',
  'Вуди Аллен',
  'Джеймс Кэмерон',
  'Ридли Скотт',
  'Тим Бёртон',
];

const WRITERS = [
  'Стивен Спилберг',
  'Мартин Скорсезе',
  'Квентин Тарантино',
  'Гай Ричи',
  'Вуди Аллен',
  'Джеймс Кэмерон',
  'Ридли Скотт',
  'Тим Бёртон',
];

const ACTORS = [
  'Дензел Вашингтон',
  'Изабель Юппер',
  'Дэниел Дей-Льюис',
  'Киану Ривз',
  'Николь Кидман',
  'Сон Кан-хо',
  'Тони Сервилло',
  'Чжао Тао',
  'Виола Дэвис',
  'Сирша Ронан',
  'Джулианна Мур',
  'Хоакин Феникс',
  'Тильда Суинтон',
  'Оскар Айзек',
  'Майкл Б. Джордан',
  'Ким Мин Хи',
  'Элфри Вудард',
  'Уиллем Дефо',
  'Уэс Стьюди',
  'Роб Морган',
  'Катрин Денёв',
  'Мелисса МакКарти',
  'Махершала Али',
  'Соня Брага',
  'Гаэль Гарсия Берналь',
];

const COUNTRES = [
  'Россия',
  'США',
  'Индия',
  'Китай',
  'Германия',
  'Испания',
  'Бразилия',
  'Франция',
];

const GENRES = [
  'Cartoon',
  'Comedy',
  'Drama',
  'Western',
  'Musical',
  'Film-Noir',
  'Mystery',
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

export const generateFilm = () => ({
  poster: `./images/posters/${getRandomElement(POSTERS)}`,
  title: getRandomElement(TITLES),
  alternativeTitle: getRandomElement(TITLES),
  rating: getRandomInteger(Rating.MIN, Rating.MAX)/10,
  director: getRandomElement(DIRECTORS),
  writers: getRandomArray(WRITERS, 3),
  actors: getRandomArray(ACTORS, 10),
  releaseDate: getRandomDate(DATE_MIN),
  runtime: getRandomRuntime(1, 720),
  country: getRandomElement(COUNTRES),
  genres: getRandomArray(GENRES, 4),
  description: generateRandomText(DESCRIPTIONS, DescriptionCount.MIN, DescriptionCount.MAX),
  ageRating: `${getRandomInteger(0,99)}+`,
  comments: generateComments(),
  watchlist: Boolean(getRandomInteger(0, 1)),
  watched: Boolean(getRandomInteger(0, 1)),
  favorite: Boolean(getRandomInteger(0, 1)),
});
