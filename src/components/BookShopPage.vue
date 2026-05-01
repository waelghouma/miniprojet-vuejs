<script setup>
import { ref } from "vue";
import { books } from "../data/books";
import {
  canUseStorage,
  loadFavouriteIds,
  saveFavouriteIds,
} from "../utils/favourites";
import { useToast } from "../utils/useToast";

const favouriteIds = ref(loadFavouriteIds());
const { message, variant, isVisible, showToast } = useToast();

const isFavourite = (bookId) => favouriteIds.value.includes(bookId);

const toggleFavourite = (bookId) => {
  if (!books.some((book) => book.id === bookId)) {
    showToast("Book not found.", "error");
    return;
  }

  if (!canUseStorage()) {
    showToast("Local storage unavailable.", "error");
    return;
  }

  const next = new Set(favouriteIds.value);
  const isInFavourites = next.has(bookId);

  if (isInFavourites) {
    next.delete(bookId);
  } else {
    next.add(bookId);
  }

  favouriteIds.value = Array.from(next);

  if (saveFavouriteIds(favouriteIds.value)) {
    showToast(
      isInFavourites ? "Removed from favourites." : "Added to favourites.",
      isInFavourites ? "info" : "success",
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
