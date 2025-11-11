<template>
  <v-footer class="custom-footer">
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <div class="d-flex align-center justify-center mb-2">
            <span class="text-body-2">Game Library</span>
          </div>
          <div class="text-caption text-grey">
            Propulsé par <a href="https://rawg.io/" target="_blank" class="footer-link">RAWG.io API</a>
          </div>
          <div class="text-caption text-grey mt-1">
            2025 - Projet M294
          </div>
          <div class="text-caption mt-2">
            Créé par 
            <span class="text-primary font-weight-medium">Andrii Shastun</span>
            • 
            <a 
              href="https://github.com/divtec-cejef/m294-projet-vuetify-micorytican98" 
              target="_blank" 
              class="footer-link"
            >
              <v-icon icon="mdi-github" size="x-small"></v-icon>
              Voir le code
            </a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
// Footer simple et moderne
</script>

<style scoped>
.custom-footer {
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%) !important;
  border-top: 1px solid rgba(99, 102, 241, 0.2);
  padding: 24px 0;
}

.footer-link {
  color: #6366F1;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #EC4899;
}
</style>