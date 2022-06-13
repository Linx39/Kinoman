export const createFilmsTemplate = () => `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container">
    </div>
    
  </section>

  <button class="films-list__show-more">Show more</button>

  <section class="films-list films-list--extra" name="Top rated">
    <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      </div>
  </section>

  <section class="films-list films-list--extra" name="Most commented">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container">
    </div>
  </section>
</section>`;
