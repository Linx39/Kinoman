const FILTER_NAME = 'history';

const ProfileRatingName = [
  {filmCountMin: 1, ratingName: 'Novice'},
  {filmCountMin: 11, ratingName: 'Fan'},
  {filmCountMin: 21, ratingName: 'Movie Buff'},
];

const getProfileRating = (filmCount) => ProfileRatingName
  .reverse()
  .find((item) => filmCount >= item.filmCountMin)
  .ratingName;


export const createHeaderProfileTemplate = (filterItems) => {
  const itemCount = filterItems.find((item) => item.name === FILTER_NAME).count;

  let profileRatingTemplate = '';

  if (itemCount > 0) {
    const profileRatingName = getProfileRating(itemCount);
    profileRatingTemplate = `<p class="profile__rating">${profileRatingName}</p>`;
  }

  return `<section class="header__profile profile">
    ${profileRatingTemplate}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
