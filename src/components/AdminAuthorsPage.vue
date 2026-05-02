<script setup>
// Axios pour faire les requêtes HTTP vers l'API NestJS
import axios from "axios";

// Imports Vue (réactivité + cycle de vie)
import { onMounted, ref } from "vue";

/**
 * URL de base de l'API
 * - utilise la variable d'environnement VITE_API_BASE si elle existe
 * - sinon fallback sur localhost:3000
 */
const API_BASE = import.meta.env?.VITE_API_BASE ?? "http://localhost:3000";

/**
 * Liste des auteurs récupérés depuis l'API
 */
const authors = ref([]);

/**
 * État de chargement (affichage "Loading...")
 */
const isLoading = ref(false);

/**
 * Message d'erreur global
 */
const errorMessage = ref("");

/**
 * État du bouton "Add Author" (évite double clic)
 */
const isSubmitting = ref(false);

/**
 * Formulaire pour ajouter un auteur
 */
const form = ref({
  prenom: "",
  nom: "",
});

/**
 * Réinitialise le formulaire après ajout réussi
 */
const resetForm = () => {
  form.value = { prenom: "", nom: "" };
};

/**
 * Charge la liste des auteurs depuis NestJS
 */
const loadAuthors = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    // Requête GET vers l'API
    const { data } = await axios.get(`${API_BASE}/author/all`);

    // Sécurise les données (évite crash si data n'est pas un tableau)
    authors.value = Array.isArray(data) ? data : [];
  } catch (error) {
    // Gestion des erreurs API ou réseau
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load authors.";
  } finally {
    isLoading.value = false;
  }
};

/**
 * Ajoute un nouvel auteur via API NestJS
 */
const handleAddAuthor = async () => {
  errorMessage.value = "";

  // Nettoyage des champs (suppression espaces inutiles)
  const prenom = form.value.prenom.trim();
  const nom = form.value.nom.trim();

  // Validation simple côté front
  if (!prenom || !nom) {
    errorMessage.value = "First name and last name are required.";
    return;
  }

  isSubmitting.value = true;

  try {
    // Envoi POST vers backend
    await axios.post(`${API_BASE}/author/add`, { prenom, nom });

    // Reset du formulaire après succès
    resetForm();

    // Recharge la liste pour afficher le nouvel auteur
    await loadAuthors();
  } catch (error) {
    // Message d'erreur backend ou réseau
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Could not add author.";
  } finally {
    isSubmitting.value = false;
  }
};

/**
 * Hook Vue :
 * au chargement du composant → on charge les auteurs
 */
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
