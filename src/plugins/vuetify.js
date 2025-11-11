/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// Configuration du thème personnalisé
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#6366F1', // Indigo moderne
          secondary: '#EC4899', // Rose vif
          accent: '#14B8A6', // Teal
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
          background: '#0F172A', // Bleu très foncé
          surface: '#1E293B', // Gris-bleu foncé
        },
      defaults: {
        VBtn: {
          ripple: true,
          elevation: 2,
        },
      },
      },
      light: {
        dark: false,
        colors: {
          primary: '#6366F1',
          secondary: '#EC4899',
          accent: '#14B8A6',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
          background: '#F8FAFC',
          surface: '#FFFFFF',
        },
      },
    },
  },
})