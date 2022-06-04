import { createHeaderProfileTemplate } from './view/header-profile';
import { createMainNavigationTemplate } from './view/main-navigation';
import { createSortTemplate } from './view/sort';
import { createFilmsTemplate } from './view/films';
import { createFilmCardTemplate } from './view/film-card';
import { createShowMoreButtonTemplate } from './view/show-more-button';
import { createFooterStatisticsTemplate } from './view/footer-statistics';
import { createFilmDetailsTemplate } from './view/film-details';

const PLACE_DEFAULT = 'beforeend';
const FILM_CARD_COUNT = 5;
const FILM_EXTRA_CARD_COUNT = 2;

const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const render = (container, template, place = PLACE_DEFAULT) => {
  container.insertAdjacentHTML(place, template);
};

render(headerElement, createHeaderProfileTemplate());
render(mainElement, createMainNavigationTemplate());
render(mainElement, createSortTemplate());
render(mainElement, createFilmsTemplate());

const filmsList = mainElement.querySelector('.films-list');

const filmsListContainer = filmsList.querySelector('.films-list__container');
for (let i = 0; i < FILM_CARD_COUNT; i++) {
  render(filmsListContainer, createFilmCardTemplate());
}

render(filmsList, createShowMoreButtonTemplate());

const filmsListExtraContainers = mainElement.querySelectorAll('.films-list.films-list--extra .films-list__container');
filmsListExtraContainers.forEach((container) => {
  for (let i = 0; i < FILM_EXTRA_CARD_COUNT; i++) {
    render(container, createFilmCardTemplate());
  }
});

render(footerElement, createFooterStatisticsTemplate());

// render(bodyElement, createFilmDetailsTemplate);
