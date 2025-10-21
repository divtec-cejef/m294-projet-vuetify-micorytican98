// Service pour communiquer avec l'API RAWG
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

/**
 * Récupère la liste des jeux
 * @param {number} page - Numéro de la page
 * @param {number} pageSize - Nombre de jeux par page
 * @returns {Promise} - Liste des jeux
 */
export async function getGames(page = 1, pageSize = 20) {
  try {
    const response = await fetch(
      `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=${pageSize}`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des jeux');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

/**
 * Récupère les détails d'un jeu
 * @param {number} id - ID du jeu
 * @returns {Promise} - Détails du jeu
 */
export async function getGameDetails(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/games/${id}?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du jeu');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}