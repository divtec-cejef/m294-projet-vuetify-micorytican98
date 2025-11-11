<template>
  <v-container class="pb-12">
    <h1 class="text-h3 mb-6">Mes Favoris</h1>

    <!-- Message si aucun favori -->
    <v-card
      v-if="!loading && favoriteGames.length === 0"
      class="text-center py-12 empty-state"
      elevation="0"
    >
      <v-icon
        icon="mdi-heart-outline"
        size="120"
        color="grey"
        class="mb-4"
      ></v-icon>
      <h2 class="text-h4 mb-4 text-grey">Pas encore de jeux favoris</h2>
      <p class="text-body-1 text-grey mb-6">
        Explorez notre bibliothèque et ajoutez vos jeux préférés !
      </p>
      <v-btn
        to="/"
        color="primary"
        size="large"
        prepend-icon="mdi-gamepad-variant"
      >
        Découvrir des jeux
      </v-btn>
    </v-card>

    <!-- Stade de chargement avec skeleton -->
    <v-row v-if="loading">
      <v-col
        v-for="n in 8"
        :key="n"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="skeleton-card">
          <v-skeleton-loader
            type="image, list-item-two-line"
            :loading="true"
          ></v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stade d'erreur -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- Liste des jeux favoris -->
    <v-row v-else>
      <v-col
        v-for="(game, index) in favoriteGames"
        :key="game.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="fade-in"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <v-card 
          class="game-card"
          elevation="4"
          :ripple="false"
          @click="$router.push(`/game-${game.id}`)"
        >
          <!-- Image du jeu -->
          <v-img
            :src="game.background_image"
            height="200"
            cover
            class="game-image"
          >
            <div class="image-gradient"></div>
          </v-img>

          <v-card-title>{{ game.name }}</v-card-title>

          <v-card-text>
            <!-- Score Metacritic -->
            <div v-if="game.metacritic" class="d-flex align-center mb-2">
              <v-chip
                :color="getMetacriticColor(game.metacritic)"
                size="small"
                class="font-weight-bold"
              >
                {{ game.metacritic }}
              </v-chip>
              <span class="ml-2 text-caption text-grey">Metacritic</span>
            </div>
            <div v-else class="mb-2 text-caption text-grey">
              Score non disponible
            </div>

            <!-- Date de sortie -->
            <div class="text-caption">
              <v-icon icon="mdi-calendar" size="x-small"></v-icon>
              {{ game.released }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              icon="mdi-heart"
              color="red"
              variant="text"
              @click.stop="removeFavorite(game.id)"
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

// Obtenir la couleur selon le score Metacritic
function getMetacriticColor(score) {
  if (score >= 75) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
}
</script>

<style scoped>
/* Effet hover sur les cartes */
.game-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px !important;
  overflow: hidden;
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(236, 72, 153, 0.3) !important;
}

/* Image avec effet */
.game-image {
  position: relative;
  border-radius: 12px 12px 0 0 !important;
}

/* Gradient sur l'image */
.image-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent);
}

/* Skeleton cards */
.skeleton-card {
  border-radius: 12px !important;
  overflow: hidden;
}

/* Animation d'apparition des cartes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

/* Empty state */
.empty-state {
  max-width: 600px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%) !important;
  border-radius: 16px !important;
}
</style>