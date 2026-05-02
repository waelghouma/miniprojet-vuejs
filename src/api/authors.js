import { request } from "./client";

// Liste des auteurs
export const getAllAuthors = async () => request("/author/all");
