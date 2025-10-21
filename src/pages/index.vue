<template>
  <v-container>
    <h1 class="text-h3 mb-6">Game Library</h1>

    <!-- Load status -->
    <div v-if="loading" class="text-center my-10">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4">Chargement des jeux...</p>
    </div>

    <!-- Стан помилки -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- Список ігор -->
    <v-row v-else>
      <v-col
        v-for="game in games"
        :key="game.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <!-- Game image -->
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
            <v-btn icon="mdi-heart-outline" variant="text"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGames } from '@/services/api.js';

// Variables réactives
const games = ref([]);
const loading = ref(true);
const error = ref(null);

// Charger les jeux au montage du composant
onMounted(async () => {
  try {
    loading.value = true;
    const data = await getGames();
    games.value = data.results;
  } catch (err) {
    error.value = 'Impossible de charger les jeux. Vérifiez votre connexion.';
  } finally {
    loading.value = false;
  }
});
</script>