<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");

// Envoi de la creation de compte
const handleRegister = async () => {
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    await axios.post(`http://localhost:3000/auth/signup`, {
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value,
    });

    router.push("/login");
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Registration failed.";
  } finally {
    isSubmitting.value = false;
  }
};

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
