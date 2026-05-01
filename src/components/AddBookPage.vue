<template>
  <main class="shop">
    <section class="shop-add">
      <div class="field">
        <label for="book-title">Title</label>
        <input id="book-title" type="text" />
      </div>
      <div class="field">
        <label for="book-image">Image</label>
        <input id="book-image" type="text" />
      </div>
      <div class="field">
        <label for="book-editor">Editor</label>
        <input id="book-editor" type="text" />
      </div>
      <div class="field">
        <label for="book-year">Year</label>
        <input id="book-year" type="text" />
      </div>
      <div class="field">
        <label for="book-description">Description</label>
        <textarea id="book-description" rows="4"></textarea>
      </div>
      <div class="field">
        <label for="book-author">Author</label>
        <input id="book-author" type="text" />
      </div>
      <div class="add-actions">
        <button class="primary" type="button">Ajouter Livre</button>
      </div>
    </section>
  </main>
</template>
