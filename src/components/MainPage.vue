<template>
  <main>
    <section class="hero">
      <h1>Decouvrez des livres pour tous les gouts</h1>
      <p>
        Des classiques intemporels aux derniers best-sellers, trouvez votre
        prochaine lecture ici.
      </p>
      <button class="primary">Explorer le catalogue</button>
    </section>

    <section class="popular">
      <h2>Livres populaires</h2>
      <div class="card-grid">
        <article class="book-card">
          <div class="cover cover-1">
            <span class="cover-author">Albert Camus</span>
            <span class="cover-title">L'etranger</span>
          </div>
          <h3>L'etranger</h3>
          <p>Un resume captivant pour ce livre incontournable.</p>
          <button class="secondary">Voir plus</button>
        </article>

        <article class="book-card">
          <div class="cover cover-2">
            <span class="cover-author">Franz Kafka</span>
            <span class="cover-title">Le proces</span>
          </div>
          <h3>Le proces</h3>
          <p>Decouvrez pourquoi ce livre est un best-seller.</p>
          <button class="secondary">Voir plus</button>
        </article>

        <article class="book-card">
          <div class="cover cover-3">
            <span class="cover-author">J. R. Dos Santos</span>
            <span class="cover-title">La formule de dieu</span>
          </div>
          <h3>La formule de dieu</h3>
          <p>Un recit qui restera grave dans votre memoire.</p>
          <button class="secondary">Voir plus</button>
        </article>
      </div>
    </section>
  </main>

  <footer class="help">
    <h2>Besoin d'aide ?</h2>
    <p>Contactez-nous pour toute question ou assistance.</p>
    <button class="primary small">Contactez-nous</button>
  </footer>
</template>
