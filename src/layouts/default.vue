<template>
  <v-app>
    <!-- Header -->
    <v-app-bar color="primary" prominent>
      <v-app-bar-title>
        <v-icon icon="mdi-gamepad-variant" class="mr-2"></v-icon>
        Game Library
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