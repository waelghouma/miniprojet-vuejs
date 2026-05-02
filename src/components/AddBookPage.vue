<script setup>
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getToken } from "../utils/session";

const route = useRoute();
const router = useRouter();
// Mode edition si l'id est present
const isEdit = computed(() => Boolean(route.params.id));
const title = computed(() => (isEdit.value ? "Edit Book" : "Add Book"));
const form = ref({
  title: "",
  image: "",
  editor: "",
  year: "",
  summary: "",
  authorId: "",
});
const authors = ref([]);
const currentBook = ref(null);
const isSubmitting = ref(false);
const errorMessage = ref("");

// Remplit le formulaire avec les donnees existantes
const fillForm = (book) => {
  if (!book) {
    form.value = {
      title: "",
      image: "",
      editor: "",
      year: "",
      summary: "",
      authorId: "",
    };
    return;
  }

  form.value = {
    title: book.title || "",
    image: book.image || "",
    editor: book.editor || "",
    year: book.year || "",
    summary: book.summary || "",
    authorId: book.author || "",
  };
};

// Charge le livre a editer
const loadBook = async () => {
  if (!isEdit.value) {
    currentBook.value = null;
    fillForm(null);
    return;
  }

  const id = Number.parseInt(route.params.id, 10);
  if (!Number.isFinite(id)) {
    return;
  }

  try {
    const { data } = await axios.get(`http://localhost:3000/books/all`);
    const list = Array.isArray(data?.listeBooks) ? data.listeBooks : [];
    currentBook.value = list.find((book) => book.id === id) || null;
    fillForm(currentBook.value);
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load book.";
  }
};

// Charge la liste des auteurs pour le select
const loadAuthors = async () => {
  try {
    const { data } = await axios.get(`http://localhost:3000/author/all`);
    authors.value = Array.isArray(data) ? data : [];
  } catch (error) {
    authors.value = [];
  }
};

// Envoi de creation ou mise a jour
const handleSubmit = async () => {
  errorMessage.value = "";
  if (!form.value.title.trim()) {
    errorMessage.value = "Title is required.";
    return;
  }

  const authorId = Number.parseInt(form.value.authorId, 10);
  if (!Number.isFinite(authorId)) {
    errorMessage.value = "Author is required.";
    return;
  }

  isSubmitting.value = true;
  const payload = {
    title: form.value.title.trim(),
    editor: form.value.editor.trim(),
    year: Number.parseInt(form.value.year, 10) || 0,
    author: authorId,
    image: form.value.image.trim(),
    summary: form.value.summary.trim(),
  };

  try {
    if (isEdit.value) {
      const id = Number.parseInt(route.params.id, 10);
      await axios.put(`http://localhost:3000/books/edit/${id}`, payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } else {
      await axios.post(`http://localhost:3000/books/new`, payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    }
    router.push("/admin/books");
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Could not save book.";
  } finally {
    isSubmitting.value = false;
  }
};

watch(
  () => route.params.id,
  () => loadBook(),
);

onMounted(() => {
  loadAuthors();
  loadBook();
});
</script>

<template>
  <main class="shop">
    <section class="admin-header">
      <h1>{{ title }}</h1>
    </section>
    <section class="shop-add">
      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
      <div class="field">
        <label for="book-title">Title</label>
        <input id="book-title" v-model="form.title" type="text" />
      </div>
      <div class="field">
        <label for="book-image">Image</label>
        <input id="book-image" v-model="form.image" type="text" />
      </div>
      <div class="field">
        <label for="book-editor">Editor</label>
        <input id="book-editor" v-model="form.editor" type="text" />
      </div>
      <div class="field">
        <label for="book-year">Year</label>
        <input id="book-year" v-model="form.year" type="text" />
      </div>
      <div class="field">
        <label for="book-description">Description</label>
        <textarea
          id="book-description"
          v-model="form.summary"
          rows="4"
        ></textarea>
      </div>
      <div class="field">
        <label for="book-author">Author</label>
        <select id="book-author" v-model="form.authorId">
          <option value="" disabled>Select an author</option>
          <option v-for="author in authors" :key="author.id" :value="author.id">
            {{ author.prenom }} {{ author.nom }}
          </option>
        </select>
      </div>
      <div class="add-actions">
        <button
          class="primary"
          type="button"
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          {{
            isSubmitting
              ? "Saving..."
              : isEdit
                ? "Save Changes"
                : "Ajouter Livre"
          }}
        </button>
      </div>
    </section>
  </main>
</template>
