<script setup>
// Axios pour les requêtes HTTP vers NestJS
import axios from "axios";

// Imports Vue (réactivité + lifecycle)
import { onMounted, ref } from "vue";

// Utilitaires pour gérer les favoris (localStorage)
import {
  canUseStorage,
  loadFavouriteIds,
  saveFavouriteIds,
} from "../utils/favourites";

// Hook personnalisé pour afficher des notifications (toast)
import { useToast } from "../utils/useToast";

/**
 * Liste de classes CSS pour styliser les couvertures des livres
 * (effet visuel aléatoire)
 */
const coverClasses = [
  "cover-red",
  "cover-ivory",
  "cover-paper",
  "cover-tan",
  "cover-teal",
  "cover-gold",
];

/**
 * Ajoute des données UI supplémentaires à un livre :
 * - label de couverture
 * - classe CSS décorative
 */
const decorateBook = (book, index) => ({
  ...book,

  // Génère un label basé sur les 2 premiers mots du titre
  coverLabel: book.title
    ? book.title.split(" ").slice(0, 2).join(" ")
    : "Book",

  // Applique une couleur de couverture en rotation
  coverClass: coverClasses[index % coverClasses.length],
});

/**
 * Liste des livres affichés
 */
const books = ref([]);

/**
 * État de chargement API
 */
const isLoading = ref(false);

/**
 * Liste des IDs des livres favoris (persistée localStorage)
 */
const favouriteIds = ref(loadFavouriteIds());

/**
 * Système de notifications toast
 */
const { message, variant, isVisible, showToast } = useToast();

/**
 * Charge les livres depuis l'API NestJS
 */
const loadBooks = async () => {
  isLoading.value = true;

  try {
    const { data } = await axios.get("http://localhost:3000/books/all");

    // Gestion flexible du format API
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.listeBooks)
        ? data.listeBooks
        : [];

    // Ajoute décoration UI aux livres
    books.value = list.map((book, index) =>
      decorateBook(book, index)
    );
  } catch (error) {
    // Notification d'erreur utilisateur
    showToast(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load books.",
      "error"
    );
  } finally {
    isLoading.value = false;
  }
};

/**
 * Chargement automatique au montage du composant
 */
onMounted(loadBooks);

/**
 * Vérifie si un livre est en favoris
 */
const isFavourite = (bookId) =>
  favouriteIds.value.includes(bookId);

/**
 * Ajoute ou retire un livre des favoris
 */
const toggleFavourite = (bookId) => {

  // Vérifie que le livre existe dans la liste
  if (!books.value.some((book) => book.id === bookId)) {
    showToast("Book not found.", "error");
    return;
  }

  // Vérifie accès localStorage
  if (!canUseStorage()) {
    showToast("Local storage unavailable.", "error");
    return;
  }

  // Utilise un Set pour éviter doublons
  const next = new Set(favouriteIds.value);

  const isInFavourites = next.has(bookId);

  // Ajout ou suppression
  if (isInFavourites) {
    next.delete(bookId);
  } else {
    next.add(bookId);
  }

  // Mise à jour du state Vue
  favouriteIds.value = Array.from(next);

  // Sauvegarde dans localStorage
  if (saveFavouriteIds(favouriteIds.value)) {
    showToast(
      isInFavourites
        ? "Removed from favourites."
        : "Added to favourites.",
      isInFavourites ? "info" : "success"
    );
  } else {
    showToast("Could not save favourites.", "error");
  }
};
</script>

<template>
  <main class="shop">
    <div v-if="isVisible" class="toast" :class="`toast--${variant}`">
      {{ message }}
    </div>
    <section class="shop-filter">
      <div class="filter-group">
        <label for="start-year">Start Year</label>
        <input id="start-year" type="text" />
      </div>
      <div class="filter-group">
        <label for="end-year">End Year</label>
        <input id="end-year" type="text" />
      </div>
      <button class="primary small" type="button">Search</button>
    </section>

    <section class="shop-grid">
      <p v-if="isLoading" class="empty">Loading...</p>
      <p v-else-if="books.length === 0" class="empty">No books available.</p>
      <article v-for="book in books" :key="book.id" class="shop-card">
        <div class="shop-cover" :class="book.coverClass">
          {{ book.coverLabel }}
        </div>
        <div class="shop-details">
          <h3>{{ book.title }}</h3>
          <p class="year">{{ book.year }}</p>
          <button
            class="outline"
            type="button"
            @click="toggleFavourite(book.id)"
          >
            {{
              isFavourite(book.id)
                ? "Remove From Favourites"
                : "Add To Favourites"
            }}
          </button>
        </div>
      </article>
    </section>
  </main>
</template>
