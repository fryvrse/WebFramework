/**
 * services/api.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Poin 3 — Integrasi API (useEffect & Axios)
 *
 * Menggunakan library Axios untuk melakukan HTTP request ke TheMealDB API.
 * BASE_URL : https://www.themealdb.com/api/json/v1/1
 *
 * Endpoint yang digunakan:
 *  - GET /search.php?s=<query> → Pencarian makanan berdasarkan nama
 *  - GET /lookup.php?i=<id>    → Detail makanan berdasarkan ID
 *
 * Contoh request saat user mengetik "ayam":
 *  → https://www.themealdb.com/api/json/v1/1/search.php?s=ayam
 */

import axios from 'axios';

// ─── Axios Instance ─────────────────────────────────────────────────────────
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // timeout 10 detik
});

// ─── Helper: Generate harga simulasi dari ID ─────────────────────────────────
export const generatePrice = (id) => {
  const priceOptions = [20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000];
  const index = parseInt(String(id).slice(-2)) % priceOptions.length;
  const price = priceOptions[index];
  return `Rp${price.toLocaleString('id-ID')}`;
};

// ─── Helper: Mapping data mentah API ke struktur internal ────────────────────
export const mapMeal = (meal) => ({
  id: meal.idMeal,
  name: meal.strMeal,
  category: meal.strCategory || 'Lainnya',
  origin: meal.strArea || 'Internasional',
  image: meal.strMealThumb,
  instructions: meal.strInstructions || '',
  ingredients: (() => {
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        list.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
      }
    }
    return list;
  })(),
  price: generatePrice(meal.idMeal),
  priceRaw: (() => {
    const priceOptions = [20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000];
    const index = parseInt(String(meal.idMeal).slice(-2)) % priceOptions.length;
    return priceOptions[index];
  })(),
});

// ─── API Function 1: Cari makanan berdasarkan query ──────────────────────────
/**
 * Memanggil API TheMealDB untuk mencari makanan.
 * @param {string} query - Kata kunci pencarian (default: '' = semua makanan)
 * @returns {Promise<Array>} Array makanan yang sudah di-mapping
 */
export const searchMeals = async (query = '') => {
  try {
    // GET https://www.themealdb.com/api/json/v1/1/search.php?s=<query>
    const response = await api.get(`/search.php?s=${query}`);
    return (response.data.meals || []).map(mapMeal);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data makanan dari server.');
  }
};

// ─── API Function 2: Ambil detail makanan berdasarkan ID ─────────────────────
/**
 * Memanggil API TheMealDB untuk mengambil detail satu makanan.
 * @param {string} id - ID makanan (idMeal dari TheMealDB)
 * @returns {Promise<Object|null>} Objek makanan atau null jika tidak ditemukan
 */
export const getMealById = async (id) => {
  try {
    // GET https://www.themealdb.com/api/json/v1/1/lookup.php?i=<id>
    const response = await api.get(`/lookup.php?i=${id}`);
    const meals = response.data.meals;
    return meals && meals.length > 0 ? mapMeal(meals[0]) : null;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil detail makanan dari server.');
  }
};
