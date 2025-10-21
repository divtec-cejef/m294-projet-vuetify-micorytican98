// Service pour communiquer avec l'API RAWG
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

/**
 * Récupère la liste des jeux avec filtres et tri
 * @param {number} page - Numéro de la page
 * @param {number} pageSize - Nombre de jeux par page
 * @param {string} ordering - Tri (-rating, -released, name, etc.)
 * @param {string} genres - IDs des genres séparés par virgule
 * @param {string} dates - Plage de dates (YYYY-MM-DD,YYYY-MM-DD)
 * @returns {Promise} - Liste des jeux
 */
export async function getGames(page = 1, pageSize = 20, ordering = '-metacritic', genres = '', dates = '') {
  try {
    let url = `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=${pageSize}&ordering=${ordering}`;
    
    if (genres) {
      url += `&genres=${genres}`;
    }
    
    if (dates) {
      url += `&dates=${dates}`;
    }
    
    const response = await fetch(url);
    
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

/**
 * Recherche des jeux par nom
 * @param {string} query - Terme de recherche
 * @param {number} page - Numéro de la page
 * @returns {Promise} - Résultats de recherche
 */
export async function searchGames(query, page = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}/games?key=${API_KEY}&search=${query}&page=${page}&page_size=20`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors de la recherche');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur recherche:', error);
    throw error;
  }
}

/**
 * Récupère la liste des genres
 * @returns {Promise} - Liste des genres
 */
export async function getGenres() {
  try {
    const response = await fetch(
      `${BASE_URL}/genres?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des genres');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}