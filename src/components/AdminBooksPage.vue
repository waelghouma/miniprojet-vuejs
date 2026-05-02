<script setup>
// Axios pour les requêtes HTTP vers NestJS
import axios from "axios";

// Imports Vue (réactivité + cycle de vie)
import { onMounted, ref } from "vue";

// Router Vue pour navigation entre pages
import { useRouter } from "vue-router";

// Fonction pour récupérer le token JWT (authentification admin)
import { getToken } from "../utils/session";

// Instance du router
const router = useRouter();

/**
 * Liste des livres affichés dans le tableau admin
 */
const adminBooks = ref([]);

/**
 * Liste des auteurs (chargée mais non utilisée ici directement)
 */
const authors = ref([]);

/**
 * État de chargement (spinner / UX)
 */
const isLoading = ref(false);

/**
 * Message d'erreur global
 */
const errorMessage = ref("");

/**
 * Formulaire pour ajout rapide de livre (admin)
 */
const form = ref({
  title: "",
  image: "",
  editor: "",
  year: "",
  summary: "",
  authorId: "",
});

/**
 * Redirection vers page d'ajout de livre
 */
const goToAddBook = () => {
  router.push("/admin/books/add");
};

/**
 * Charger tous les livres depuis NestJS
 */
const loadBooks = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const { data } = await axios.get("http://localhost:3000/books/all");

    // Sécurisation des données reçues
    adminBooks.value = Array.isArray(data?.listeBooks)
      ? data.listeBooks
      : [];
  } catch (error) {
    // Gestion des erreurs API ou réseau
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load books.";
  } finally {
    isLoading.value = false;
  }
};

/**
 * Charger les auteurs (utile pour affichage ou extension future)
 */
const loadAuthors = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/author/all");

    authors.value = Array.isArray(data) ? data : [];
  } catch (error) {
    authors.value = [];
  }
};

/**
 * Ajout rapide d'un livre (admin)
 */
const handleAddBook = async () => {
  // Validation titre
  if (!form.value.title.trim()) {
    window.alert("Title is required.");
    return;
  }

  // Validation auteur
  const authorId = Number.parseInt(form.value.authorId, 10);
  if (!Number.isFinite(authorId)) {
    window.alert("Author is required.");
    return;
  }

  try {
    // Construction du payload envoyé à NestJS
    const payload = {
      title: form.value.title.trim(),
      editor: form.value.editor.trim(),
      year: Number.parseInt(form.value.year, 10) || 0,
      author: authorId,
      image: form.value.image.trim(),
    };

    // Appel API création livre (avec token JWT)
    await axios.post("http://localhost:3000/books/new", payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    // Recharge la liste après ajout
    await loadBooks();
  } catch (error) {
    window.alert(
      error?.response?.data?.message ||
      error?.message ||
      "Could not add book."
    );
  }
};

/**
 * Redirection vers page d'édition d'un livre
 */
const handleEdit = (bookId) => {
  router.push(`/admin/books/${bookId}/edit`);
};

/**
 * Suppression d'un livre
 */
const handleDelete = async (bookId) => {
  // Recherche du livre pour confirmation utilisateur
  const book = adminBooks.value.find((item) => item.id === bookId);
  if (!book) return;

  // Confirmation avant suppression
  const confirmed = window.confirm(
    `Delete ${book.title}? This cannot be undone.`
  );
  if (!confirmed) return;

  try {
    // Appel API suppression (protégé par JWT)
    await axios.delete(
      `http://localhost:3000/books/remove/${bookId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    // Mise à jour locale sans recharger toute la liste
    adminBooks.value = adminBooks.value.filter(
      (item) => item.id !== bookId
    );
  } catch (error) {
    window.alert(
      error?.response?.data?.message ||
      error?.message ||
      "Could not delete book."
    );
  }
};

/**
 * Lifecycle Vue :
 * au chargement du composant → charge livres + auteurs
 */
onMounted(() => {
  loadBooks();
  loadAuthors();
});
</script>

<template>
  <main class="admin">
    <section class="admin-header">
      <h1>Books</h1>
      <button class="primary small" type="button" @click="goToAddBook">
        Add Book
      </button>
    </section>

    <section class="admin-table-wrap">
      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Editor</th>
            <th>Year</th>
            <th>Author</th>
            <th>Image</th>
            <th>Summary</th>
            <th class="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in adminBooks" :key="book.id">
            <td>{{ book.id }}</td>
            <td class="title">{{ book.title }}</td>
            <td>{{ book.editor }}</td>
            <td>{{ book.year }}</td>
            <td>{{ book.author }}</td>
            <td class="truncate">{{ book.image }}</td>
            <td class="truncate">{{ book.summary }}</td>
            <td class="actions">
              <button
                class="icon-button"
                type="button"
                title="Delete"
                @click="handleDelete(book.id)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M9 3h6l1 2h5v2H3V5h5l1-2zm2 7h2v8h-2v-8zm-4 0h2v8H7v-8zm8 0h2v8h-2v-8z"
                  />
                </svg>
              </button>
              <button
                class="icon-button"
                type="button"
                title="Edit"
                @click="handleEdit(book.id)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm18-11.5a1 1 0 0 0 0-1.41l-1.59-1.59a1 1 0 0 0-1.41 0l-1.13 1.13 3.75 3.75L21 5.75z"
                  />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="!isLoading && adminBooks.length === 0">
            <td colspan="8" class="empty">No books available.</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>
