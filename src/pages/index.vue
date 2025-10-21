<template>
  <v-container>
    <h1 class="text-h3 mb-6">Game Library</h1>

<!-- Barre de recherche et filtres -->
<v-card class="mb-6">
  <v-card-text>
    <v-row>
      <!-- Recherche -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Rechercher un jeu..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          density="comfortable"
          @keyup.enter="handleSearch"
          @click:clear="clearSearch"
        ></v-text-field>
      </v-col>

      <!-- Filtre par genre -->
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="selectedGenre"
          :items="genres"
          item-title="name"
          item-value="id"
          label="Genre"
          variant="outlined"
          density="comfortable"
          clearable
          prepend-inner-icon="mdi-gamepad-variant"
          @update:model-value="applyFilters"
        ></v-select>
      </v-col>

      <!-- Tri -->
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="selectedSort"
          :items="sortOptions"
          label="Trier par"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-sort"
          @update:model-value="applyFilters"
        ></v-select>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>

    <!-- Load status -->
    <div v-if="loading" class="text-center my-10">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4">Chargement des jeux...</p>
    </div>

    <!-- Error status -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- Game list -->
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
import { getGames, searchGames, getGenres } from '@/services/api.js';

// Variables réactives
const games = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const selectedGenre = ref('');
const selectedSort = ref('-rating');
const genres = ref([]);

// Options de tri
const sortOptions = [
  { title: 'Meilleure note', value: '-rating' },
  { title: 'Plus récent', value: '-released' },
  { title: 'Nom (A-Z)', value: 'name' },
  { title: 'Nom (Z-A)', value: '-name' },
];

// Charger les jeux et genres au montage
onMounted(async () => {
  await loadGenres();
  await loadGames();
});

// Charger les genres
async function loadGenres() {
  try {
    const data = await getGenres();
    genres.value = data.results;
  } catch (err) {
    console.error('Erreur chargement genres:', err);
  }
}

// Fonction pour charger les jeux
async function loadGames() {
  try {
    loading.value = true;
    error.value = null;
    const data = await getGames(1, 20, selectedSort.value, selectedGenre.value);
    games.value = data.results;
  } catch (err) {
    error.value = 'Impossible de charger les jeux. Vérifiez votre connexion.';
  } finally {
    loading.value = false;
  }
}

// Appliquer les filtres
function applyFilters() {
  searchQuery.value = ''; // Réinitialiser la recherche
  loadGames();
}

// Fonction de recherche
async function handleSearch() {
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    await loadGames();
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    const data = await searchGames(searchQuery.value);
    games.value = data.results;
    
    if (games.value.length === 0) {
      error.value = 'Aucun jeu trouvé pour cette recherche.';
    }
  } catch (err) {
    error.value = 'Erreur lors de la recherche.';
  } finally {
    loading.value = false;
  }
}

// Fonction pour effacer la recherche
async function clearSearch() {
  searchQuery.value = '';
  await loadGames();
}
</script>