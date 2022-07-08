import HeaderProfileView from './view/header-profile.js';
import MainNavigationView from './view/main-navigation.js';
// import SortView from './view/sort.js';
// import FilmsView from './view/films.js';
// import FilmsListView from './view/films-list.js';
// import ShowMoreView from './view/show-more.js';
// import FilmsListTopRatedView from './view/films-list-top-rated.js';
// import FilmsListMostCommentedView from './view/films-list-most-commented';
// import FilmCardView from './view/film-card.js';
import FooterStatisticsView from './view/footer-statistics.js';
// import NoMoviesView from './view/no-movies.js';
// import FilmDetailsView from './view/film-details.js';

import MoviesPresenter from './presenter/movies.js';
import { createFilmsFilter, createCommentsFilter } from './view/filter.js';


import { render } from './utils/render.js';
import { FILMS_COUNT, COMMENTS_COUNT } from './const.js';

import { generateFilm } from './mock/film';
import { generateComment } from './mock/comment.js';

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
films.forEach((film, index) => {
  film.id = index + 1;
});

const comments = new Array(COMMENTS_COUNT).fill().map(generateComment);
comments.forEach((comment, index) => {
  comment.id = index + 1;
});

const filmFilters = createFilmsFilter(films);

const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

// //функция рендеринга карточки с фильмом
// const renderFilm = (filmsContainer, film) => {
//   const filmComponent = new FilmCardView(film);
//   const filmDetailsComponent = new FilmDetailsView(film, createCommentsFilter(film, comments));

//   let onEscKeyDown = null;

//   const closeFilmDetails =() => {
//     bodyElement.removeChild(filmDetailsComponent.getElement());
//     bodyElement.classList.remove('hide-overflow');
//     document.removeEventListener('keydown', onEscKeyDown);
//   };

//   const openFilmDetails = () => {
//     bodyElement.appendChild(filmDetailsComponent.getElement());
//     bodyElement.classList.add('hide-overflow');
//     document.addEventListener('keydown', onEscKeyDown);
//   };

//   onEscKeyDown = (evt) => {
//     if (isEscEvent) {
//       evt.preventDefault();
//       closeFilmDetails();
//     }
//   };

//   filmComponent.setClickFilmDetailsHandler(openFilmDetails);

//   filmDetailsComponent.setClickButtonCloseHandler(closeFilmDetails);

//   render(filmsContainer, filmComponent);
// };

// //функция рендеринга основного списка фильмов
// const renderFilmsList = (container, button) => {
//   let renderCountStart = 0;
//   const renderList = () => {
//     const renderCountEnd = Math.min(films.length, renderCountStart + FILM_CARD_COUNT);

//     films.slice(renderCountStart, renderCountEnd).map((film) => renderFilm(container, film));

//     if (renderCountEnd === films.length) {
//       removeComponent(button);
//     }

//     renderCountStart = renderCountEnd;
//   };

//   renderList();

//   button.setClickHandler(renderList);
// };

// const renderMovieList = () => {
//   if (films.length === 0) {
//     render(mainElement, new NoMoviesView());
//     return;
//   }

//   render(mainElement, new SortView());

//   const filmsComponent = new FilmsView();
//   render(mainElement, filmsComponent);

//   const filmsListComponent = new FilmsListView();
//   render(filmsComponent, filmsListComponent);

//   const showMoreComponent = new ShowMoreView();
//   render(filmsComponent, showMoreComponent);

//   const filmsListTopRatedComponent = new FilmsListTopRatedView();
//   render(filmsComponent, filmsListTopRatedComponent);
//   const filmsListMostCommentedComponent = new FilmsListMostCommentedView();
//   render(filmsComponent, filmsListMostCommentedComponent);

//   renderFilmsList(filmsListComponent.getContainer(), showMoreComponent);

//   films.slice(0, FILM_EXTRA_CARD_COUNT).map((film) => renderFilm(filmsListTopRatedComponent.getContainer(), film));
//   films.slice(2, FILM_EXTRA_CARD_COUNT + 2).map((film) => renderFilm(filmsListMostCommentedComponent.getContainer(), film));
// };

const moviesPresenter = new MoviesPresenter(mainElement);

render(headerElement, new HeaderProfileView(filmFilters));
render(mainElement, new MainNavigationView(filmFilters));

moviesPresenter.init(films);

render(footerElement, new FooterStatisticsView(films));

export { comments };
