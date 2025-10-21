// Store pour gérer les jeux favoris
import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [], // Liste des IDs des jeux favoris
  }),

  getters: {
    // Vérifier si un jeu est dans les favoris
    isFavorite: (state) => (gameId) => {
      return state.favorites.includes(gameId);
    },

    // Obtenir le nombre de favoris
    favoritesCount: (state) => {
      return state.favorites.length;
    },
  },

  actions: {
    // Ajouter un jeu aux favoris
    addFavorite(gameId) {
      if (!this.favorites.includes(gameId)) {
        this.favorites.push(gameId);
        this.saveFavorites();
      }
    },

    // Retirer un jeu des favoris
    removeFavorite(gameId) {
      const index = this.favorites.indexOf(gameId);
      if (index > -1) {
        this.favorites.splice(index, 1);
        this.saveFavorites();
      }
    },

    // Basculer le statut favori
    toggleFavorite(gameId) {
      if (this.isFavorite(gameId)) {
        this.removeFavorite(gameId);
      } else {
        this.addFavorite(gameId);
      }
    },

    // Sauvegarder dans localStorage
    saveFavorites() {
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },

    // Charger depuis localStorage
    loadFavorites() {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        this.favorites = JSON.parse(saved);
      }
    },
  },
});