<script setup>
// Axios pour communiquer avec l’API NestJS
import axios from "axios";

// Imports Vue (réactivité + computed + lifecycle)
import { computed, onMounted, ref } from "vue";

// Utilitaires pour gérer les favoris via localStorage
import {
  canUseStorage,
  loadFavouriteIds,
  saveFavouriteIds,
} from "../utils/favourites";

// Système de notifications (toast)
import { useToast } from "../utils/useToast";

/**
 * Liste complète des livres récupérés depuis l’API
 */
const books = ref([]);

/**
 * État de chargement (UI loading)
 */
const isLoading = ref(false);

/**
 * IDs des livres favoris (persistés en localStorage)
 */
const favouriteIds = ref(loadFavouriteIds());

/**
 * Système de notifications (succès / erreur / info)
 */
const { message, variant, isVisible, showToast } = useToast();

/**
 * URL de base de l’API (NestJS)
 */
const API_BASE =
  import.meta.env?.VITE_API_BASE ?? "http://localhost:3000";

/**
 * Charge tous les livres depuis l’API
 * (utilisé pour filtrer ensuite les favoris)
 */
const loadBooks = async () => {
  isLoading.value = true;

  try {
    const { data } = await axios.get(`${API_BASE}/books/all`);

    // Sécurise le format des données reçues
    books.value = Array.isArray(data?.listeBooks)
      ? data.listeBooks
      : [];
  } catch (error) {
    // Affichage d’erreur utilisateur
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
 * Computed : liste des livres favoris
 * → filtre les livres selon les IDs stockés en localStorage
 */
const favouriteBooks = computed(() =>
  books.value.filter((book) =>
    favouriteIds.value.includes(book.id)
  )
);

/**
 * Retire un livre des favoris
 */
const removeFavourite = (bookId) => {

  // Vérifie si le livre est déjà en favoris
  if (!favouriteIds.value.includes(bookId)) {
    showToast("Book is not in favourites.", "info");
    return;
  }

  // Vérifie accès localStorage
  if (!canUseStorage()) {
    showToast("Local storage unavailable.", "error");
    return;
  }

  // Supprime l’ID du tableau des favoris
  favouriteIds.value = favouriteIds.value.filter(
    (id) => id !== bookId
  );

  // Sauvegarde dans localStorage
  if (saveFavouriteIds(favouriteIds.value)) {
    showToast("Removed from favourites.", "info");
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
    <section v-if="isLoading" class="favourites-empty">
      <p>Loading...</p>
    </section>
    <section v-else-if="favouriteBooks.length" class="favourites-grid">
      <article v-for="book in favouriteBooks" :key="book.id" class="shop-card">
        <img class="shop-image" :src="book.image" :alt="book.title" />
        <div class="shop-details">
          <h3>{{ book.title }}</h3>
          <p class="year">{{ book.year }}</p>
          <button
            class="outline"
            type="button"
            @click="removeFavourite(book.id)"
          >
            Remove From Favourites
          </button>
        </div>
      </article>
    </section>

    <section v-else class="favourites-empty">
      <h2>No favourites yet</h2>
      <p>Add books from the All-Books page to see them here.</p>
    </section>
  </main>
</template>
