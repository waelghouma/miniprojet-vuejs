<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { clearSession, useSession } from "./utils/session";

const route = useRoute();
const router = useRouter();
// Determine les zones de navigation selon la route courante
const isAuth = computed(
  () => route.path === "/login" || route.path === "/register",
);
const isShop = computed(() => route.path.startsWith("/shop"));
const isAdmin = computed(() => route.path.startsWith("/admin"));
const { role, isAuthenticated } = useSession();
const isAdminRole = computed(() => role.value === "admin");
const pageClass = computed(() => (isAuth.value ? "page auth-page" : "page"));
const brandText = computed(() =>
  isShop.value || isAdmin.value ? "Book Shop" : "Bookstore",
);

// Deconnexion locale et retour a l'accueil
const handleLogout = () => {
  clearSession();
  router.push("/");
};
</script>

<template>
  <div :class="pageClass">
    <header class="top-bar">
      <div class="brand">{{ brandText }}</div>
      <nav class="nav">
        <template v-if="isAdmin">
          <RouterLink v-if="isAdminRole" class="nav-link" to="/admin/books"
            >Books</RouterLink
          >
          <RouterLink v-if="isAdminRole" class="nav-link" to="/admin/authors"
            >Authors</RouterLink
          >
          <button class="nav-link" type="button" @click="handleLogout">
            Logout
          </button>
        </template>
        <template v-else>
          <template v-if="isAuthenticated">
            <RouterLink class="nav-link" to="/shop">Accueil</RouterLink>
            <RouterLink class="nav-link" to="/shop">All-Books</RouterLink>
            <RouterLink v-if="isAdminRole" class="nav-link" to="/shop/add"
              >Add</RouterLink
            >
            <RouterLink class="nav-link" to="/shop/favourites"
              >Favourites</RouterLink
            >
            <button class="nav-link" type="button" @click="handleLogout">
              Logout
            </button>
          </template>
          <template v-else>
            <RouterLink class="nav-link" to="/">Home</RouterLink>
            <RouterLink class="nav-link" to="/login">Login</RouterLink>
            <RouterLink class="nav-link" to="/register">Register</RouterLink>
          </template>
        </template>
      </nav>
    </header>
    <RouterView />
  </div>
</template>
