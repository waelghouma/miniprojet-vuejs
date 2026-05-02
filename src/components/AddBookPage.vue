<script setup>
// Import d'axios pour les requêtes HTTP vers NestJS
import axios from "axios";

// Import des outils Vue (réactivité, lifecycle, routing)
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Fonction pour récupérer le token JWT (auth)
import { getToken } from "../utils/session";

// Accès à la route actuelle (pour récupérer l'id)
const route = useRoute();

// Permet de rediriger vers une autre page
const router = useRouter();

/**
 * Mode édition :
 * Si un ID est présent dans l'URL → on est en mode EDIT
 * Sinon → mode AJOUT
 */
const isEdit = computed(() => Boolean(route.params.id));

// Titre dynamique de la page
const title = computed(() => (isEdit.value ? "Edit Book" : "Add Book"));

/**
 * Formulaire réactif (v-model lié aux inputs)
 */
const form = ref({
  title: "",
  image: "",
  editor: "",
  year: "",
  summary: "",
  authorId: "",
});

// Liste des auteurs pour le select
const authors = ref([]);

// Livre actuellement chargé (en mode édition)
const currentBook = ref(null);

// Etat de chargement du submit
const isSubmitting = ref(false);

// Message d'erreur global
const errorMessage = ref("");

/**
 * Remplit le formulaire avec les données du livre
 */
const fillForm = (book) => {
  if (!book) {
    // Si aucun livre → reset formulaire
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

  // Sinon on remplit avec les données du livre
  form.value = {
    title: book.title || "",
    image: book.image || "",
    editor: book.editor || "",
    year: book.year || "",
    summary: book.summary || "",
    authorId: book.author || "",
  };
};

/**
 * Charger un livre si on est en mode édition
 */
const loadBook = async () => {
  if (!isEdit.value) {
    currentBook.value = null;
    fillForm(null);
    return;
  }

  // Récupère l'id depuis l'URL
  const id = Number.parseInt(route.params.id, 10);

  // Vérifie si c'est un nombre valide
  if (!Number.isFinite(id)) {
    return;
  }

  try {
    // Récupère tous les livres depuis l'API NestJS
    const { data } = await axios.get(`http://localhost:3000/books/all`);

    // Sécurise les données reçues
    const list = Array.isArray(data?.listeBooks) ? data.listeBooks : [];

    // Trouve le livre correspondant à l'id
    currentBook.value = list.find((book) => book.id === id) || null;

    // Remplit le formulaire
    fillForm(currentBook.value);
  } catch (error) {
    // Gestion des erreurs
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load book.";
  }
};

/**
 * Charger les auteurs pour le dropdown
 */
const loadAuthors = async () => {
  try {
    const { data } = await axios.get(`http://localhost:3000/author/all`);

    // Vérifie que c'est un tableau
    authors.value = Array.isArray(data) ? data : [];
  } catch (error) {
    authors.value = [];
  }
};

/**
 * Soumission du formulaire (AJOUT ou EDIT)
 */
const handleSubmit = async () => {
  errorMessage.value = "";

  // Validation titre
  if (!form.value.title.trim()) {
    errorMessage.value = "Title is required.";
    return;
  }

  // Validation auteur
  const authorId = Number.parseInt(form.value.authorId, 10);
  if (!Number.isFinite(authorId)) {
    errorMessage.value = "Author is required.";
    return;
  }

  isSubmitting.value = true;

  // Construction du payload envoyé à NestJS
  const payload = {
    title: form.value.title.trim(),
    editor: form.value.editor.trim(),
    year: Number.parseInt(form.value.year, 10) || 0,
    author: authorId,
    image: form.value.image.trim(),
    summary: form.value.summary.trim(),
  };

  try {
    // MODE EDITION
    if (isEdit.value) {
      const id = Number.parseInt(route.params.id, 10);

      await axios.put(
        `http://localhost:3000/books/edit/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`, // token JWT
          },
        }
      );
    }
    // MODE AJOUT
    else {
      await axios.post(
        `http://localhost:3000/books/new`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
    }

    // Redirection après succès
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

/**
 * Surveille le changement d'ID dans l'URL
 * (utile si navigation entre edit pages sans reload)
 */
watch(
  () => route.params.id,
  () => loadBook()
);

/**
 * Au chargement du composant :
 * - charge les auteurs
 * - charge le livre si édition
 */
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
