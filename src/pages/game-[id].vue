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
        </v-col>

        <v-col cols="12" md="4">
          <!-- Informations -->
          <v-card>
            <v-card-title>Informations</v-card-title>
            <v-card-text>
              <!-- Note -->
              <div class="mb-3">
                <div class="text-subtitle-2 mb-1">Note</div>
                <div class="d-flex align-center">
                  <v-icon icon="mdi-star" color="yellow"></v-icon>
                  <span class="ml-2 text-h6">{{ game.rating }} / 5</span>
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
                color="primary"
                prepend-icon="mdi-heart"
                class="mt-4"
              >
                Ajouter aux favoris
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getGameDetails } from '@/services/api.js';

const route = useRoute();

// Variables réactives
const game = ref(null);
const loading = ref(true);
const error = ref(null);

// Charger les détails du jeu au montage
onMounted(async () => {
  try {
    loading.value = true;
    const gameId = route.params.id;
    
    console.log('ID du jeu:', gameId); // Pour déboguer
    
    if (!gameId) {
      error.value = 'ID du jeu manquant';
      return;
    }
    
    const data = await getGameDetails(gameId);
    console.log('Données du jeu:', data); // Pour déboguer
    game.value = data;
  } catch (err) {
    console.error('Erreur:', err); // Pour déboguer
    error.value = 'Impossible de charger les détails du jeu';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
}
</style>