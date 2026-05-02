<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getToken } from "../utils/session";

const router = useRouter();
const adminBooks = ref([]);
const authors = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");
const form = ref({
  title: "",
  image: "",
  editor: "",
  year: "",
  summary: "",
  authorId: "",
});

// Navigation vers la page d'ajout
const goToAddBook = () => {
  router.push("/admin/books/add");
};

// Charge la liste des livres
const loadBooks = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const { data } = await axios.get(`http://localhost:3000/books/all`);
    adminBooks.value = Array.isArray(data?.listeBooks) ? data.listeBooks : [];
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load books.";
  } finally {
    isLoading.value = false;
  }
};

const loadAuthors = async () => {
  try {
    const { data } = await axios.get(`http://localhost:3000/author/all`);
    authors.value = Array.isArray(data) ? data : [];
  } catch (error) {
    authors.value = [];
  }
};

// Ajout rapide (utilise l'API admin)
const handleAddBook = async () => {
  if (!form.value.title.trim()) {
    window.alert("Title is required.");
    return;
  }

  const authorId = Number.parseInt(form.value.authorId, 10);
  if (!Number.isFinite(authorId)) {
    window.alert("Author is required.");
    return;
  }

  try {
    const payload = {
      title: form.value.title.trim(),
      editor: form.value.editor.trim(),
      year: Number.parseInt(form.value.year, 10) || 0,
      author: authorId,
      image: form.value.image.trim(),
    };
    await axios.post(`http://localhost:3000/books/new`, payload, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    await loadBooks();
  } catch (error) {
    window.alert(
      error?.response?.data?.message || error?.message || "Could not add book.",
    );
  }
};

// Redirige vers la page d'edition
const handleEdit = (bookId) => {
  router.push(`/admin/books/${bookId}/edit`);
};

// Suppression d'un livre
const handleDelete = async (bookId) => {
  const book = adminBooks.value.find((item) => item.id === bookId);
  if (!book) return;

  const confirmed = window.confirm(
    `Delete ${book.title}? This cannot be undone.`,
  );
  if (!confirmed) return;

  try {
    await axios.delete(`http://localhost:3000/books/remove/${bookId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    adminBooks.value = adminBooks.value.filter((item) => item.id !== bookId);
  } catch (error) {
    window.alert(
      error?.response?.data?.message ||
        error?.message ||
        "Could not delete book.",
    );
  }
};

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
