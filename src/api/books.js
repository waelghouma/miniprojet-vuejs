import { request } from "./client";

// Liste des livres
export const getAllBooks = async () => request("/books/all");

// Creation d'un livre (admin)
export const createBook = async ({ token, payload }) =>
  request("/books/new", {
    method: "POST",
    body: payload,
    token,
  });

// Mise a jour d'un livre (admin)
export const updateBook = async ({ token, bookId, payload }) =>
  request(`/books/edit/${bookId}`, {
    method: "PUT",
    body: payload,
    token,
  });

// Suppression d'un livre (admin)
export const deleteBook = async ({ token, bookId }) =>
  request(`/books/remove/${bookId}`, {
    method: "DELETE",
    token,
  });
