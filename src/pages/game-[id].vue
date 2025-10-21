<template>
  <v-container>
    <!-- Stade de chargement -->
    <div v-if="loading" class="text-center my-10">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4">Chargement du jeu...</p>
    </div>

    <!-- Stade d'erreur -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- Détails du jeu -->
    <div v-else-if="game">
      <!-- Bouton retour -->
      <v-btn
        class="mb-4"
        prepend-icon="mdi-arrow-left"
        variant="text"
        @click="$router.back()"
      >
        Retour
      </v-btn>

      <!-- En-tête avec image -->
      <v-card class="mb-4">
        <v-img
          :src="game.background_image"
          height="400"
          cover
        >
          <div class="d-flex flex-column justify-end h-100 pa-4 bg-gradient">
            <h1 class="text-h3 text-white">{{ game.name }}</h1>
          </div>
        </v-img>
      </v-card>

      <!-- Informations principales -->
      <v-row>
        <v-col cols="12" md="8">
          <!-- Description -->
          <v-card class="mb-4">
            <v-card-title>Description</v-card-title>
            <v-card-text>
              <div v-html="game.description"></div>
            </v-card-text>
          </v-card>
          <!-- Captures d'écran -->
          <v-card v-if="screenshots.length > 0" class="mb-4">
            <v-card-title>
              <v-icon icon="mdi-image-multiple" class="mr-2"></v-icon>
              Captures d'écran
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  v-for="screenshot in screenshots.slice(0, 6)"
                  :key="screenshot.id"
                  cols="6"
                  sm="4"
                >
                  <v-img
                    :src="screenshot.image"
                    aspect-ratio="16/9"
                    cover
                    class="cursor-pointer rounded"
                    @click="openMedia(screenshot)"
                  ></v-img>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Vidéos -->
          <v-card v-if="videos.length > 0" class="mb-4">
            <v-card-title>
              <v-icon icon="mdi-play-circle" class="mr-2"></v-icon>
              Vidéos
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  v-for="video in videos"
                  :key="video.id"
                  cols="12"
                  sm="6"
                >
                  <video
                    :src="video.data.max"
                    controls
                    class="w-100 rounded"
                    style="max-height: 300px;"
                  ></video>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <!-- Informations -->
          <v-card>
            <v-card-title>Informations</v-card-title>
            <v-card-text>
              <!-- Score Metacritic -->
              <div class="mb-3">
                <div class="text-subtitle-2 mb-1">Score Metacritic</div>
                <div v-if="game.metacritic" class="d-flex align-center">
                  <v-chip
                    :color="getMetacriticColor(game.metacritic)"
                    size="large"
                    class="font-weight-bold text-h6"
                  >
                    {{ game.metacritic }}
                  </v-chip>
                  <span class="ml-2 text-body-2 text-grey">/ 100</span>
                </div>
                <div v-else class="text-body-2 text-grey">
                  Score non disponible
                </div>
              </div>

              <!-- Date de sortie -->
              <div class="mb-3">
                <div class="text-subtitle-2 mb-1">Date de sortie</div>
                <div>{{ game.released }}</div>
              </div>

              <!-- Genres -->
              <div class="mb-3" v-if="game.genres && game.genres.length">
                <div class="text-subtitle-2 mb-1">Genres</div>
                <v-chip
                  v-for="genre in game.genres"
                  :key="genre.id"
                  class="mr-1 mb-1"
                  size="small"
                >
                  {{ genre.name }}
                </v-chip>
              </div>

              <!-- Plateformes -->
              <div class="mb-3" v-if="game.platforms && game.platforms.length">
                <div class="text-subtitle-2 mb-1">Plateformes</div>
                <v-chip
                  v-for="platform in game.platforms"
                  :key="platform.platform.id"
                  class="mr-1 mb-1"
                  size="small"
                  color="primary"
                  variant="outlined"
                >
                  {{ platform.platform.name }}
                </v-chip>
              </div>

              <!-- Bouton favoris -->
              <v-btn
                block
                :color="favoritesStore.isFavorite(game.id) ? 'red' : 'primary'"
                :prepend-icon="favoritesStore.isFavorite(game.id) ? 'mdi-heart' : 'mdi-heart-outline'"
                class="mt-4"
                @click="favoritesStore.toggleFavorite(game.id)"
              >
                {{ favoritesStore.isFavorite(game.id) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
              </v-btn>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <!-- Dialogue pour afficher l'image en grand -->
    <v-dialog v-model="showMediaDialog" max-width="1200">
      <v-card>
        <v-img
          v-if="selectedMedia"
          :src="selectedMedia.image"
          max-height="80vh"
        ></v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showMediaDialog = false">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getGameDetails, getGameScreenshots, getGameVideos } from '@/services/api.js';
import { useFavoritesStore } from '@/stores/favorites.js';

const route = useRoute();

// Variables réactives
const game = ref(null);
const loading = ref(true);
const error = ref(null);
const screenshots = ref([]);
const videos = ref([]);
const selectedMedia = ref(null);
const showMediaDialog = ref(false);
// Store des favoris
const favoritesStore = useFavoritesStore();

// Charger les détails du jeu au montage
onMounted(async () => {
  favoritesStore.loadFavorites();
  try {
    loading.value = true;
    const gameId = route.params.id;
    
    console.log('ID du jeu:', gameId);
    
    if (!gameId) {
      error.value = 'ID du jeu manquant';
      return;
    }
    
    // Charger les détails, captures et vidéos en parallèle
    const [gameData, screenshotsData, videosData] = await Promise.all([
      getGameDetails(gameId),
      getGameScreenshots(gameId),
      getGameVideos(gameId)
    ]);
    
    console.log('Données du jeu:', gameData);
    game.value = gameData;
    screenshots.value = screenshotsData.results || [];
    videos.value = videosData.results || [];
    
  } catch (err) {
    console.error('Erreur:', err);
    error.value = 'Impossible de charger les détails du jeu';
  } finally {
    loading.value = false;
  }
});

// Obtenir la couleur selon le score Metacritic
function getMetacriticColor(score) {
  if (score >= 75) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
}

// Ouvrir le dialogue média
function openMedia(media) {
  selectedMedia.value = media;
  showMediaDialog.value = true;
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
}

.cursor-pointer {
  cursor: pointer;
  transition: transform 0.2s;
}

.cursor-pointer:hover {
  transform: scale(1.05);
}
</style>