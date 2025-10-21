<template>
  <v-container>
    <h1 class="text-h3 mb-6">Mes Favoris</h1>

    <!-- Message si aucun favori -->
    <v-alert
      v-if="!loading && favoriteGames.length === 0"
      type="info"
      class="my-4"
    >
      Vous n'avez pas encore de jeux favoris. 
      Ajoutez des jeux depuis la page d'accueil !
    </v-alert>

    <!-- Stade de chargement -->
    <div v-if="loading" class="text-center my-10">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4">Chargement de vos favoris...</p>
    </div>

    <!-- Stade d'erreur -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- Liste des jeux favoris -->
    <v-row v-else>
      <v-col
        v-for="game in favoriteGames"
        :key="game.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <!-- Image du jeu -->
          <v-img
            :src="game.background_image"
            height="200"
            cover
          ></v-img>

          <v-card-title>{{ game.name }}</v-card-title>

          <v-card-text>
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-star" color="yellow" size="small"></v-icon>
              <span class="ml-1">{{ game.rating }}</span>
            </div>
            <div class="text-caption">
              Sortie: {{ game.released }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn 
              color="primary" 
              variant="text"
              :to="`/game-${game.id}`"
            >
              Détails
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              icon="mdi-heart"
              color="red"
              variant="text"
              @click="removeFavorite(game.id)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFavoritesStore } from '@/stores/favorites.js';
import { getGameDetails } from '@/services/api.js';

const favoritesStore = useFavoritesStore();

// Variables réactives
const favoriteGames = ref([]);
const loading = ref(true);
const error = ref(null);

// Charger les jeux favoris
onMounted(async () => {
  favoritesStore.loadFavorites();
  await loadFavoriteGames();
});

// Charger les détails de tous les jeux favoris
async function loadFavoriteGames() {
  try {
    loading.value = true;
    error.value = null;
    
    if (favoritesStore.favorites.length === 0) {
      favoriteGames.value = [];
      return;
    }

    // Charger les détails de chaque jeu favori
    const promises = favoritesStore.favorites.map(id => getGameDetails(id));
    favoriteGames.value = await Promise.all(promises);
    
  } catch (err) {
    error.value = 'Impossible de charger vos favoris.';
    console.error('Erreur:', err);
  } finally {
    loading.value = false;
  }
}

// Retirer un jeu des favoris
async function removeFavorite(gameId) {
  favoritesStore.removeFavorite(gameId);
  // Recharger la liste
  await loadFavoriteGames();
}
</script>