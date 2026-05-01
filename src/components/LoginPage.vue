<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogin = () => {
  router.push("/shop");
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
        <input id="login-username" type="text" />
      </div>

      <div class="field">
        <label for="login-password">Password</label>
        <input id="login-password" type="password" />
      </div>

      <button class="primary" type="submit">Login</button>
      <button class="secondary" type="button" @click="goRegister">
        Switch to Register
      </button>
    </form>
  </main>
</template>
