<template>
  <v-app>
    <!-- Header -->
    <v-app-bar 
      color="primary" 
      prominent
      elevation="8"
      app
      class="app-header"
    >
      <v-app-bar-title class="text-h5 font-weight-bold logo-clickable" @click="$router.push('/')">
        <v-icon icon="mdi-gamepad-variant" class="mr-2" size="large"></v-icon>
        <span class="app-title">Game Library</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Les buttons de navigation -->
      <v-btn :to="{ path: '/' }" text>
        Accueil
      </v-btn>
      
      <v-btn :to="{ path: '/favorites' }" text>
        <v-badge
          :content="favoritesStore.favoritesCount()"
          :model-value="favoritesStore.favoritesCount() > 0"
          color="red"
          overlap
          class="mr-2"
        >
          <v-icon icon="mdi-heart"></v-icon>
        </v-badge>
        Favoris
      </v-btn>
    </v-app-bar>

    <!-- Loading bar -->
    <v-progress-linear
      :active="isLoading"
      indeterminate
      color="accent"
      height="3"
      absolute
      top
    ></v-progress-linear>

    <!-- Main content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <AppFooter />

    <!-- Snackbar global -->
    <v-snackbar
      v-model="favoritesStore.snackbar.show"
      :color="favoritesStore.snackbar.color"
      :timeout="2000"
      location="bottom"
    >
      {{ favoritesStore.snackbar.message }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="favoritesStore.hideSnackbar"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>

        <!-- Bouton scroll to top -->
    <v-btn
      v-show="showScrollBtn"
      icon="mdi-chevron-up"
      color="primary"
      size="large"
      elevation="4"
      class="scroll-top-btn"
      @click="scrollToTop"
    ></v-btn>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoritesStore } from '@/stores/favorites.js';

const favoritesStore = useFavoritesStore();
const router = useRouter();

// État pour le bouton scroll to top
const showScrollBtn = ref(false);

// État pour la barre de chargement
const isLoading = ref(false);

// Afficher la barre de chargement pendant la navigation
router.beforeEach(() => {
  isLoading.value = true;
});

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

// Détecter le scroll pour le bouton
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

function handleScroll() {
  showScrollBtn.value = window.scrollY > 100;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped>
/* Header avec gradient */
.app-header {
  background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%) !important;
}

/* Titre avec effet */
.app-title {
  background: linear-gradient(to right, #FFFFFF, #F0ABFC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

/* Logo cliquable */
.logo-clickable {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo-clickable:hover {
  transform: scale(1.01);
}

/* Effet hover sur les boutons de navigation */
.v-btn {
  transition: transform 0.2s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
}

/* Bouton scroll to top */
.scroll-top-btn {
  position: fixed !important;
  bottom: 80px;
  right: 20px;
  z-index: 999;
  transition: opacity 0.3s ease;
}
</style>