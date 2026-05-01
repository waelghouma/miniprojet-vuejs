<script setup>
import { computed, ref } from "vue";
import { books } from "../data/books";
import {
  canUseStorage,
  loadFavouriteIds,
  saveFavouriteIds,
} from "../utils/favourites";
import { useToast } from "../utils/useToast";

const favouriteIds = ref(loadFavouriteIds());
const { message, variant, isVisible, showToast } = useToast();

const favouriteBooks = computed(() =>
  books.filter((book) => favouriteIds.value.includes(book.id)),
);

const removeFavourite = (bookId) => {
  if (!favouriteIds.value.includes(bookId)) {
    showToast("Book is not in favourites.", "info");
    return;
  }

  if (!canUseStorage()) {
    showToast("Local storage unavailable.", "error");
    return;
  }

  favouriteIds.value = favouriteIds.value.filter((id) => id !== bookId);

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
    <section v-if="favouriteBooks.length" class="favourites-grid">
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
