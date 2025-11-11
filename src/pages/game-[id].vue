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

      <!-- En-tête avec image hero -->
      <v-card class="mb-6 hero-card" elevation="0">
        <v-img
          :src="game.background_image"
          height="500"
          cover
          gradient="to bottom, rgba(15,23,42,.3), rgba(15,23,42,.95)"
        >
          <div class="d-flex flex-column justify-end h-100 pa-8">
            <h1 class="game-title mb-2">{{ game.name }}</h1>
            <div class="d-flex align-center gap-4">
              <v-chip
                v-if="game.metacritic"
                :color="getMetacriticColor(game.metacritic)"
                size="large"
                class="font-weight-bold"
              >
                <v-icon icon="mdi-trophy" start></v-icon>
                {{ game.metacritic }}
              </v-chip>
              <v-chip size="large" variant="outlined" color="white">
                <v-icon icon="mdi-calendar" start></v-icon>
                {{ game.released }}
              </v-chip>
            </div>
          </div>
        </v-img>
      </v-card>

      <!-- Informations principales -->
      <v-row>
        <v-col cols="12" md="8">

          <!-- Description -->
          <v-card class="mb-4 content-card" elevation="8">
            <v-card-title class="text-h5 pb-4">
              Description
            </v-card-title>
            <v-card-text>
              <div class="game-description" v-html="game.description"></div>
            </v-card-text>
          </v-card>

          <!-- Captures d'écran -->
          <v-card v-if="screenshots.length > 0" class="mb-4 content-card" elevation="8">
            <v-card-title class="text-h5 pb-4">
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
          <v-card v-if="videos.length > 0" class="mb-4 content-card" elevation="8">
            <v-card-title class="text-h5 pb-4">
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
          <v-card class="info-card" elevation="8">
            <v-card-title class="text-h5 pb-4">
              Informations
            </v-card-title>
            <v-card-text>
              <!-- Score Metacritic -->
              <div class="info-item">
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-star-circle" color="warning" class="mr-2"></v-icon>
                  <span class="text-subtitle-1 font-weight-medium">Score Metacritic</span>
                </div>
                <div v-if="game.metacritic" class="ml-8">
                  <v-chip
                    :color="getMetacriticColor(game.metacritic)"
                    size="large"
                    class="font-weight-bold text-h6"
                  >
                    {{ game.metacritic }}
                  </v-chip>
                  <span class="ml-2 text-body-2 text-grey">/ 100</span>
                </div>
                <div v-else class="ml-8 text-body-2 text-grey">
                  Score non disponible
                </div>
              </div>

              <v-divider class="my-4"></v-divider>

              <!-- Date de sortie -->
              <div class="info-item">
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-calendar-check" color="info" class="mr-2"></v-icon>
                  <span class="text-subtitle-1 font-weight-medium">Date de sortie</span>
                </div>
                <div class="ml-8 text-body-1">{{ game.released }}</div>
              </div>

              <v-divider class="my-4"></v-divider>

              <!-- Genres -->
              <div class="info-item" v-if="game.genres && game.genres.length">
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-gamepad-variant" color="secondary" class="mr-2"></v-icon>
                  <span class="text-subtitle-1 font-weight-medium">Genres</span>
                </div>
                <div class="ml-8">
                  <v-chip
                    v-for="genre in game.genres"
                    :key="genre.id"
                    class="mr-2 mb-2"
                    color="secondary"
                    variant="flat"
                  >
                    {{ genre.name }}
                  </v-chip>
                </div>
              </div>

              <v-divider class="my-4"></v-divider>

              <!-- Plateformes -->
              <div class="info-item" v-if="game.platforms && game.platforms.length">
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-devices" color="accent" class="mr-2"></v-icon>
                  <span class="text-subtitle-1 font-weight-medium">Plateformes</span>
                </div>
                <div class="ml-8">
                  <v-chip
                    v-for="platform in game.platforms"
                    :key="platform.platform.id"
                    class="mr-2 mb-2"
                    color="accent"
                    variant="outlined"
                  >
                    {{ platform.platform.name }}
                  </v-chip>
                </div>
              </div>

              <v-divider class="my-4"></v-divider>

              <!-- Bouton favoris amélioré -->
              <v-btn
                block
                :color="favoritesStore.isFavorite(game.id) ? 'red' : 'primary'"
                size="x-large"
                elevation="4"
                class="mt-4 favorite-btn"
                @click="favoritesStore.toggleFavorite(game.id)"
              >
                <v-icon 
                  :icon="favoritesStore.isFavorite(game.id) ? 'mdi-heart' : 'mdi-heart-outline'"
                  start
                  size="large"
                ></v-icon>
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px !important;
  overflow: hidden;
}

.cursor-pointer:hover {
  transform: scale(1.08);
  box-shadow: 0 12px 24px rgba(236, 72, 153, 0.4) !important;
}

/* Hero card */
.hero-card {
  border-radius: 16px !important;
  overflow: hidden;
}

/* Titre du jeu avec gradient */
.game-title {
  font-size: 3.5rem !important;
  font-weight: 800 !important;
  background: linear-gradient(135deg, #FFFFFF 0%, #A78BFA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 2px 2px 20px rgba(0,0,0,0.5);
  line-height: 1.2;
}

/* Card d'informations */
.info-card {
  border-radius: 16px !important;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%) !important;
}

/* Cards de contenu (description, captures, vidéos) */
.content-card {
  border-radius: 16px !important;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(236, 72, 153, 0.03) 100%) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.2) !important;
}

/* Items d'information */
.info-item {
  margin-bottom: 8px;
}

/* Bouton favoris avec animation */
.favorite-btn {
  transition: all 0.3s ease;
  border-radius: 12px !important;
  text-transform: none !important;
  font-size: 1rem !important;
  letter-spacing: 0.5px;
}

.favorite-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4) !important;
}

/* Formatage de la description */
.game-description :deep(p) {
  margin-bottom: 16px;
  line-height: 1.8;
  font-size: 1.05rem;
}

.game-description :deep(br) {
  display: block;
  content: "";
  margin-top: 8px;
}

.game-description :deep(h1),
.game-description :deep(h2),
.game-description :deep(h3) {
  margin-top: 24px;
  margin-bottom: 12px;
  font-weight: 600;
}
</style>