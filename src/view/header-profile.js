const PROFILE_RATING_NAME = ['Novice', 'Fan', 'Movie Buff'];

const getProfileRating = (name, count) => {
  if (count >= 1 && count <= 10) {
    return name[0];
  }
  if (count >= 11 && count <= 20) {
    return name[1];
  }
  if (count >= 21) {
    return name[2];
  }
};

export const createHeaderProfileTemplate = (filterItems) => {
  const sumWatched = filterItems[2].count;

  let profileRatingTemplate = '';

  const profileRatingName = getProfileRating(PROFILE_RATING_NAME, sumWatched);

  if (sumWatched > 0) {
    profileRatingTemplate = `<p class="profile__rating">${profileRatingName}</p>`;
  }

  return `<section class="header__profile profile">
    ${profileRatingTemplate}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
