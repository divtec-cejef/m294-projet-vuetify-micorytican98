<template>
  <v-container>
    <h1 class="text-h3 mb-6">Game Library</h1>

<!-- Barre de recherche et filtres -->
<v-card class="mb-6">
  <v-card-text>
    <v-row>
<!-- Filtre par années -->
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="5">
            <v-text-field
              v-model.number="yearRange[0]"
              label="Année de début"
              type="number"
              :min="1980"
              :max="yearRange[1]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-calendar-start"
              @blur="applyYearFilter"
            ></v-text-field>
          </v-col>
          <v-col cols="2" class="d-flex align-center justify-center">
            <v-icon icon="mdi-arrow-right" color="grey"></v-icon>
          </v-col>
          <v-col cols="5">
            <v-text-field
              v-model.number="yearRange[1]"
              label="Année de fin"
              type="number"
              :min="yearRange[0]"
              :max="currentYear"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-calendar-end"
              @blur="applyYearFilter"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>

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

      <!-- Bouton réinitialiser -->
      <v-col cols="12" class="d-flex justify-end">
        <v-btn
          variant="outlined"
          color="grey"
          prepend-icon="mdi-refresh"
          @click="resetFilters"
        >
          Réinitialiser les filtres
        </v-btn>
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
            <v-btn 
              color="primary" 
              variant="text"
              :to="`/game-${game.id}`"
            >
              Détails
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              :icon="favoritesStore.isFavorite(game.id) ? 'mdi-heart' : 'mdi-heart-outline'"
              :color="favoritesStore.isFavorite(game.id) ? 'red' : 'grey'"
              variant="text"
              @click="favoritesStore.toggleFavorite(game.id)"
            ></v-btn>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>
    <!-- Pagination -->
    <div v-if="!loading && games.length > 0" class="mt-6 d-flex justify-center">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        @update:model-value="changePage"
  ></v-pagination>
</div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGames, searchGames, getGenres } from '@/services/api.js';
import { useFavoritesStore } from '@/stores/favorites.js';

// Variables réactives
const games = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const selectedGenre = ref('');
const selectedSort = ref('-metacritic');
const genres = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const yearRange = ref([2010, 2025]);
const currentYear = new Date().getFullYear();
// Store des favoris
const favoritesStore = useFavoritesStore();

// Options de tri
const sortOptions = [
  { title: 'Metacritic (Meilleur)', value: '-metacritic' },
  { title: 'Plus récent', value: '-released' },
  { title: 'Popularité', value: '-rating' },
  { title: 'Nom (A-Z)', value: 'name' },
  { title: 'Nom (Z-A)', value: '-name' },
];

// Charger les jeux et genres au montage
onMounted(async () => {
  favoritesStore.loadFavorites();
  loadYearRange(); // Charger la plage d'années sauvegardée
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
async function loadGames(page = 1) {
  try {
    loading.value = true;
    error.value = null;
    
    // Créer la plage de dates au format YYYY-MM-DD,YYYY-MM-DD
    const dateRange = `${yearRange.value[0]}-01-01,${yearRange.value[1]}-12-31`;
    
    const data = await getGames(page, 20, selectedSort.value, selectedGenre.value, dateRange);
    games.value = data.results;
    currentPage.value = page;
    totalPages.value = Math.min(Math.ceil(data.count / 20), 25);
  } catch (err) {
    error.value = 'Impossible de charger les jeux. Vérifiez votre connexion.';
  } finally {
    loading.value = false;
  }
}

// Appliquer les filtres
function applyFilters() {
  searchQuery.value = ''; // Réinitialiser la recherche
  currentPage.value = 1; // Retour à la page 1
  loadGames(1);
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

// Changer de page
function changePage(page) {
  currentPage.value = page;
  loadGames(page);
  // Scroll vers le haut de la page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sauvegarder la plage d'années
function saveYearRange() {
  localStorage.setItem('yearRange', JSON.stringify(yearRange.value));
}

// Charger la plage d'années sauvegardée
function loadYearRange() {
  const saved = localStorage.getItem('yearRange');
  if (saved) {
    yearRange.value = JSON.parse(saved);
  }
}

// Appliquer le filtre d'années
function applyYearFilter() {
  saveYearRange();
  currentPage.value = 1;
  loadGames(1);
}

// Réinitialiser tous les filtres
function resetFilters() {
  searchQuery.value = '';
  selectedGenre.value = '';
  selectedSort.value = '-metacritic';
  yearRange.value = [2010, 2025];
  currentPage.value = 1;
  saveYearRange();
  loadGames(1);
}

// Obtenir la couleur selon le score Metacritic
function getMetacriticColor(score) {
  if (score >= 75) return 'success'; // Vert pour bon score
  if (score >= 50) return 'warning'; // Orange pour score moyen
  return 'error'; // Rouge pour mauvais score
}
</script>