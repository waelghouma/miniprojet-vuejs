<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goLogin = () => {
  router.push("/login");
};
</script>

<template>
  <main class="auth">
    <form class="auth-form" @submit.prevent>
      <div class="field">
        <label for="register-username">Username</label>
        <input id="register-username" type="text" />
      </div>

      <div class="field">
        <label for="register-email">Email</label>
        <input id="register-email" type="email" />
      </div>

      <div class="field">
        <label for="register-password">Password</label>
        <input id="register-password" type="password" />
      </div>

      <button class="primary" type="submit">Register</button>
      <button class="secondary" type="button" @click="goLogin">
        Switch to Login
      </button>
    </form>
  </main>
</template>
