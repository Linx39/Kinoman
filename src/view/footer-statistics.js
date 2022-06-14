export const createFooterStatisticsTemplate = (films) => {
  const moviesInside = films.length;

  return `<section class="footer__statistics">
  <p>${moviesInside} movies inside</p>
  </section>`;
};
