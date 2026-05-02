import { computed, ref } from "vue";

// Etat de session en memoire (reset au refresh)
const token = ref("");
const role = ref("");
const username = ref("");

export const getToken = () => token.value;

export const getRole = () => role.value;

// Met a jour la session apres authentification
export const setSession = ({
  accessToken,
  role: newRole,
  username: newUser,
}) => {
  if (accessToken !== undefined) token.value = accessToken;
  if (newRole !== undefined) role.value = newRole;
  if (newUser !== undefined) username.value = newUser;
};

// Vide la session locale
export const clearSession = () => {
  token.value = "";
  role.value = "";
  username.value = "";
};

// Expose un acces reactif a la session
export const useSession = () => ({
  token,
  role,
  username,
  isAuthenticated: computed(() => Boolean(token.value)),
});
