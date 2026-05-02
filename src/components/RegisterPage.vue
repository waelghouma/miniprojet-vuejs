<script setup>
// Axios pour les requêtes HTTP vers NestJS
import axios from "axios";

// Réactivité Vue
import { ref } from "vue";

// Router Vue pour redirection après inscription
import { useRouter } from "vue-router";

// Instance du router
const router = useRouter();

/**
 * Champs du formulaire d'inscription
 */
const username = ref("");
const email = ref("");
const password = ref("");

// État du bouton (évite double clic / double submit)
const isSubmitting = ref(false);

// Message d'erreur affiché à l'utilisateur
const errorMessage = ref("");

/**
 * Fonction d'inscription utilisateur
 */
const handleRegister = async () => {
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    // Appel API NestJS (création compte)
    await axios.post(
      "http://localhost:3000/auth/signup",
      {
        // données envoyées au backend
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value,
      }
    );

    // Redirection vers page login après succès
    router.push("/login");
  } catch (error) {
    // Gestion des erreurs backend ou réseau
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Registration failed.";
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * Redirection vers login
 */
const goLogin = () => {
  router.push("/login");
};
</script>

<template>
  <main class="auth">
    <form class="auth-form" @submit.prevent="handleRegister">
      <div class="field">
        <label for="register-username">Username</label>
        <input id="register-username" v-model="username" type="text" />
      </div>

      <div class="field">
        <label for="register-email">Email</label>
        <input id="register-email" v-model="email" type="email" />
      </div>

      <div class="field">
        <label for="register-password">Password</label>
        <input id="register-password" v-model="password" type="password" />
      </div>

      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

      <button class="primary" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Creating..." : "Register" }}
      </button>
      <button class="secondary" type="button" @click="goLogin">
        Switch to Login
      </button>
    </form>
  </main>
</template>
