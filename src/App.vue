<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isAuth = computed(
  () => route.path === "/login" || route.path === "/register",
);
const isShop = computed(() => route.path.startsWith("/shop"));
const pageClass = computed(() => (isAuth.value ? "page auth-page" : "page"));
const brandText = computed(() => (isShop.value ? "Book Shop" : "Bookstore"));
</script>

<template>
  <div :class="pageClass">
    <header class="top-bar">
      <div class="brand">{{ brandText }}</div>
      <nav class="nav">
        <RouterLink class="nav-link" to="/">Home</RouterLink>
        <RouterLink class="nav-link" to="/login">Login</RouterLink>
        <template v-if="isShop">
          <RouterLink class="nav-link" to="/shop">Accueil</RouterLink>
          <RouterLink class="nav-link" to="/shop">All-Books</RouterLink>
          <RouterLink class="nav-link" to="/shop/add">Add</RouterLink>
          <RouterLink class="nav-link" to="/shop/favourites"
            >Favourites</RouterLink
          >
          <RouterLink class="nav-link" to="/">Logout</RouterLink>
        </template>
      </nav>
    </header>
    <RouterView />
  </div>
</template>
