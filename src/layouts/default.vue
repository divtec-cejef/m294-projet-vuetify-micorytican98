<template>
  <v-app>
    <!-- Header -->
    <v-app-bar 
      color="primary" 
      prominent
      elevation="8"
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
        <v-icon icon="mdi-heart" class="mr-1"></v-icon>
        Favoris
      </v-btn>
    </v-app-bar>

    <!-- Main content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <AppFooter />
  </v-app>
</template>

<script setup>
// Layout par défaut avec navigation
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
  transform: scale(1.05);
}

/* Effet hover sur les boutons de navigation */
.v-btn {
  transition: transform 0.2s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
}
</style>