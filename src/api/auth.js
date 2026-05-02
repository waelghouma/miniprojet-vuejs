import { request } from "./client";

// Authentification
export const signIn = async ({ identifiant, password }) =>
  request("/auth/signin", {
    method: "POST",
    body: { identifiant, password },
  });

// Inscription
export const signUp = async ({ username, email, password, role }) =>
  request("/auth/signup", {
    method: "POST",
    body: { username, email, password, role },
  });
