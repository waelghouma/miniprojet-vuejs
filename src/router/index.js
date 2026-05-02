import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../components/MainPage.vue";
import LoginPage from "../components/LoginPage.vue";
import RegisterPage from "../components/RegisterPage.vue";
import BookShopPage from "../components/BookShopPage.vue";
import AddBookPage from "../components/AddBookPage.vue";
import FavouritesPage from "../components/FavouritesPage.vue";
import AdminBooksPage from "../components/AdminBooksPage.vue";
import AdminAuthorsPage from "../components/AdminAuthorsPage.vue";
import { getRole } from "../utils/session";

// Definition des routes principales
const routes = [
  { path: "/", name: "home", component: MainPage },
  { path: "/login", name: "login", component: LoginPage },
  { path: "/register", name: "register", component: RegisterPage },
  {
    path: "/shop",
    name: "shop",
    component: BookShopPage,
  },
  {
    path: "/shop/add",
    name: "shop-add",
    component: AddBookPage,
  },
  {
    path: "/shop/favourites",
    name: "shop-favourites",
    component: FavouritesPage,
  },
  {
    path: "/admin",
    redirect: "/admin-books",
    component: AdminBooksPage,
  },
  {
    path: "/admin/books",
    name: "admin-books",
    component: AdminBooksPage,
  },
  {
    path: "/admin/books/add",
    name: "admin-books-add",
    component: AddBookPage,
  },
  {
    path: "/admin/books/:id/edit",
    name: "admin-books-edit",
    component: AddBookPage,
  },
  {
    path: "/admin/authors",
    name: "admin-authors",
    component: AdminAuthorsPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protection simple des routes admin
router.beforeEach((to) => {
  const role = getRole();
  const isAdmin = role === "admin";

  if (to.path.startsWith("/admin") && !isAdmin) {
    return "/shop";
  }

  if (to.path === "/shop/add" && !isAdmin) {
    return "/shop";
  }

  return true;
});

export default router;
