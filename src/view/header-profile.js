import { FILMS_COUNT } from './main.js';

export const createHeaderProfileTemplate = (films) => {
  const PROFILE_RATING_NAME = {
    novice: [1, 10],
    fan: [11, 20],
    'movie buff': [20, FILMS_COUNT],
  };

  const sumWatched = films.map((film) => film.watched).reduce((sum, watched) => sum + watched, 0);

  let profileRatingTemplate = '';

  let profileRating;
  if (sumWatched >= 1 && sumWatched <= 10) {
    profileRating = PROFILE_RATING_NAME[0];
  }
  if (sumWatched >= 11 && sumWatched <= 20) {
    profileRating = PROFILE_RATING_NAME[1];
  }
  if (sumWatched >= 21) {
    profileRating = PROFILE_RATING_NAME[2];
  }

  if (sumWatched > 0) {
    profileRatingTemplate = `<p class="profile__rating">${profileRating}</p>`;
  }

  return `<section class="header__profile profile">
    ${profileRatingTemplate}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

