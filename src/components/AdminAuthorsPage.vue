<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const API_BASE = import.meta.env?.VITE_API_BASE ?? "http://localhost:3000";
const authors = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");
const isSubmitting = ref(false);
const form = ref({
  prenom: "",
  nom: "",
});

// Reinitialise le formulaire
const resetForm = () => {
  form.value = { prenom: "", nom: "" };
};

// Charge la liste des auteurs
const loadAuthors = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const { data } = await axios.get(`${API_BASE}/author/all`);
    authors.value = Array.isArray(data) ? data : [];
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load authors.";
  } finally {
    isLoading.value = false;
  }
};

// Ajout d'un auteur
const handleAddAuthor = async () => {
  errorMessage.value = "";

  const prenom = form.value.prenom.trim();
  const nom = form.value.nom.trim();
  if (!prenom || !nom) {
    errorMessage.value = "First name and last name are required.";
    return;
  }

  isSubmitting.value = true;
  try {
    await axios.post(`${API_BASE}/author/add`, { prenom, nom });
    resetForm();
    await loadAuthors();
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Could not add author.";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadAuthors);
</script>

<template>
  <main class="admin">
    <section class="admin-header">
      <h1>Authors</h1>
    </section>

    <section class="admin-table-wrap">
      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
      <div class="admin-empty" v-if="isLoading">Loading...</div>

      <table v-else class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First name</th>
            <th>Last name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="author in authors" :key="author.id">
            <td>{{ author.id }}</td>
            <td>{{ author.prenom }}</td>
            <td>{{ author.nom }}</td>
          </tr>
          <tr v-if="!authors.length">
            <td colspan="3" class="empty">No authors available.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="admin-empty" style="margin-top: 18px">
      <h2>Add author</h2>
      <div class="field">
        <label for="author-prenom">First name</label>
        <input id="author-prenom" v-model="form.prenom" type="text" />
      </div>
      <div class="field">
        <label for="author-nom">Last name</label>
        <input id="author-nom" v-model="form.nom" type="text" />
      </div>
      <div class="add-actions">
        <button
          class="primary"
          type="button"
          :disabled="isSubmitting"
          @click="handleAddAuthor"
        >
          {{ isSubmitting ? "Saving..." : "Add Author" }}
        </button>
      </div>
    </section>
  </main>
</template>
