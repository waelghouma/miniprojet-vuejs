<script setup>
// Axios pour les requêtes HTTP vers NestJS
import axios from "axios";

// Réactivité Vue
import { ref } from "vue";

// Router Vue pour redirection après login
import { useRouter } from "vue-router";

// Fonction utilitaire pour stocker la session (token + user info)
import { setSession } from "../utils/session";

// Instance du router
const router = useRouter();

/**
 * Champs du formulaire de connexion
 */
const username = ref("");
const password = ref("");

// État du bouton (évite double soumission)
const isSubmitting = ref(false);

// Message d'erreur affiché à l'utilisateur
const errorMessage = ref("");

/**
 * Fonction de connexion utilisateur
 */
const handleLogin = async () => {
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    // Appel API NestJS login
    const { data } = await axios.post(
      "http://localhost:3000/auth/signin",
      {
        // identifiant envoyé au backend
        identifiant: username.value.trim(),

        // mot de passe
        password: password.value,
      }
    );

    /**
     * Stockage de la session utilisateur
     * (token JWT + rôle + username)
     */
    setSession({
      accessToken: data.access_token,
      role: data.role,
      username: data.username,
    });

    /**
     * Redirection selon le rôle utilisateur :
     * - admin → dashboard admin
     * - user → shop
     */
    router.push(
      data.role === "admin"
        ? "/admin/books"
        : "/shop"
    );
  } catch (error) {
    // Gestion des erreurs login (401, réseau, etc.)
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Login failed.";
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * Redirection vers page d'inscription
 */
const goRegister = () => {
  router.push("/register");
};
</script>

<template>
  <main class="auth">
    <form class="auth-form" @submit.prevent="handleLogin">
      <div class="field">
        <label for="login-username">Username</label>
        <input id="login-username" v-model="username" type="text" />
      </div>

      <div class="field">
        <label for="login-password">Password</label>
        <input id="login-password" v-model="password" type="password" />
      </div>

      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

      <button class="primary" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Signing in..." : "Login" }}
      </button>
      <button class="secondary" type="button" @click="goRegister">
        Switch to Register
      </button>
    </form>
  </main>
</template>
