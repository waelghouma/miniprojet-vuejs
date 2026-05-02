<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { setSession } from "../utils/session";

const router = useRouter();
const username = ref("");
const password = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");

// Envoi de la demande d'authentification
const handleLogin = async () => {
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    const { data } = await axios.post(`http://localhost:3000/auth/signin`, {
      identifiant: username.value.trim(),
      password: password.value,
    });

    setSession({
      accessToken: data.access_token,
      role: data.role,
      username: data.username,
    });

    router.push(data.role === "admin" ? "/admin/books" : "/shop");
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message || error?.message || "Login failed.";
  } finally {
    isSubmitting.value = false;
  }
};

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
