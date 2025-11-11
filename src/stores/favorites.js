// Store pour gérer les jeux favoris
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
  // State
  const favorites = ref([]);
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success'
  });

  // Getters
  const isFavorite = (gameId) => {
    return favorites.value.includes(gameId);
  };

  const favoritesCount = () => {
    return favorites.value.length;
  };

  // Actions
  const addFavorite = (gameId) => {
    if (!favorites.value.includes(gameId)) {
      favorites.value.push(gameId);
      saveFavorites();
      showSnackbar('Ajouté aux favoris', 'success');
    }
  };

  const removeFavorite = (gameId) => {
    const index = favorites.value.indexOf(gameId);
    if (index > -1) {
      favorites.value.splice(index, 1);
      saveFavorites();
      showSnackbar('Retiré des favoris', 'error');
    }
  };

  const toggleFavorite = (gameId) => {
    if (isFavorite(gameId)) {
      removeFavorite(gameId);
    } else {
      addFavorite(gameId);
    }
  };

  const saveFavorites = () => {
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      favorites.value = JSON.parse(saved);
    }
  };

  const showSnackbar = (message, color = 'success') => {
    snackbar.value = {
      show: true,
      message,
      color
    };
  };

  const hideSnackbar = () => {
    snackbar.value.show = false;
  };

  return {
    favorites,
    snackbar,
    isFavorite,
    favoritesCount,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    saveFavorites,
    loadFavorites,
    hideSnackbar
  };
});