const STORAGE_KEY = "favourites";

// Verifie la disponibilite du stockage local
export const canUseStorage = () => typeof localStorage !== "undefined";

// Charge les IDs favoris depuis le stockage
export const loadFavouriteIds = () => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

// Sauvegarde la liste des favoris
export const saveFavouriteIds = (ids) => {
  if (!canUseStorage()) {
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    return true;
  } catch (error) {
    return false;
  }
};
