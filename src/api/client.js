import axios from "axios";

// Base API par defaut (override possible via VITE_API_BASE)
const DEFAULT_BASE = "http://localhost:3000";

const getBaseUrl = () => {
  const envBase = import.meta.env?.VITE_API_BASE;
  return envBase && typeof envBase === "string" ? envBase : DEFAULT_BASE;
};

// Instance Axios partagee
const api = axios.create({
  baseURL: getBaseUrl(),
});

// Requete generique avec gestion d'erreurs simplifiee
export const request = async (path, options = {}) => {
  const { method = "GET", body, headers = {}, token } = options;

  try {
    const response = await api.request({
      url: path,
      method,
      data: body,
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed";
    throw new Error(message);
  }
};
