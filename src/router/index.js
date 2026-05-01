import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../components/MainPage.vue";
import LoginPage from "../components/LoginPage.vue";
import RegisterPage from "../components/RegisterPage.vue";
import BookShopPage from "../components/BookShopPage.vue";
import AddBookPage from "../components/AddBookPage.vue";
import FavouritesPage from "../components/FavouritesPage.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
