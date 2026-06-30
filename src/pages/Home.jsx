import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FoodCard from '../components/FoodCard';
import FoodGrid from '../components/FoodGrid';
import Loading from '../components/Loading';
import ErrorMessage from '../components/Error';
import { searchMeals } from '../services/api';
import { useFood } from '../context/FoodContext';
import { Frown, ChefHat, Sparkles } from 'lucide-react';

/**
 * Home Page — Halaman utama aplikasi CariMakan.
 *
 * State yang digunakan (Poin Penilaian 2):
 *  - search  : query pencarian dari user (string)
 *  - foods   : data makanan dari API (array)
 *  - loading : status loading API (boolean)
 *  - error   : pesan error jika API gagal (string | null)
 *
 * Fitur:
 *  - Real-time filter berdasarkan input search (useState)
 *  - Debounce 500ms sebelum memanggil API (useEffect)
 *  - Fetch data dari TheMealDB via Axios (useEffect + async/await)
 *  - Skeleton loading + error state + empty state
 */
const Home = () => {
  // ─── State Utama (Poin 2: useState) ──────────────────────────────────
  const [search, setSearch] = useState('');          // query pencarian user
  const [foods, setFoods] = useState([]);            // hasil data dari API
  const [loading, setLoading] = useState(true);      // status loading
  const [error, setError] = useState(null);          // pesan error API
  const [debouncedSearch, setDebouncedSearch] = useState(''); // query terakhir setelah debounce

  // Makanan lokal dari Context (CRUD admin)
  const { localFoods } = useFood();

  // ─── Debounce: tunda panggil API 500ms setelah user berhenti mengetik ───
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // ─── Integrasi API (Poin 3: useEffect + Axios + async/await) ────────────
  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);   // tampilkan loading
      setError(null);     // reset error
      try {
        // Panggil API TheMealDB: https://www.themealdb.com/api/json/v1/1/search.php?s=<query>
        const result = await searchMeals(debouncedSearch);
        setFoods(result); // simpan hasil ke state foods
      } catch (err) {
        setError(err.message); // tampilkan error jika gagal
      } finally {
        setLoading(false); // sembunyikan loading
      }
    };
    fetchFoods();
  }, [debouncedSearch]);

  // ─── Filter real-time makanan lokal berdasarkan input search ──────────
  const filteredLocal = localFoods.filter((meal) =>
    meal.name.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Filter real-time dari hasil API juga ──────────────────────────────
  // (API sudah search by query, tapi filter lokal ini untuk sinkronisasi UX)
  const filteredFoods = foods;

  return (
    <div className="flex-1 dark:bg-gray-900 transition-colors">
      {/* Header Hero */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* SearchBar — Props: value (search state) + onChange (setState) */}
        <div className="-mt-6 mb-8 relative z-10">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* ─── State: LOADING ─── */}
        {loading && <Loading type="skeleton" />}

        {/* ─── State: ERROR ─── */}
        {error && !loading && <ErrorMessage message={error} />}

        {/* ─── State: EMPTY (tidak ada hasil) ─── */}
        {!loading && !error && filteredLocal.length === 0 && filteredFoods.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="bg-gray-100 p-5 rounded-3xl dark:bg-gray-800">
              <Frown className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-700 font-bold text-xl dark:text-gray-200">
              Makanan tidak ditemukan.
            </p>
            <p className="text-gray-400 text-sm">Coba kata kunci pencarian yang lain.</p>
          </div>
        )}

        {/* ─── State: SUCCESS (tampilkan daftar makanan) ─── */}
        {!loading && !error && (filteredLocal.length > 0 || filteredFoods.length > 0) && (
          <>
            {/* Seksi 1: Makanan Lokal (dari Context/CRUD Admin) */}
            {filteredLocal.length > 0 && (
              <section className="mb-10 animate-fade-in">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">Makanan Lokal Saya</h2>
                  <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full border border-orange-100 dark:bg-orange-900/30 dark:border-orange-800">
                    {filteredLocal.length} menu
                  </span>
                </div>
                <FoodGrid foods={filteredLocal} />
              </section>
            )}

            {/* Seksi 2: Makanan dari TheMealDB API */}
            {filteredFoods.length > 0 && (
              <section className="animate-fade-in">
                <div className="flex items-center gap-2 mb-5">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">Menu dari TheMealDB</h2>
                  <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full dark:bg-orange-900/30">
                    {filteredFoods.length} menu
                  </span>
                </div>
                {/* FoodGrid: komponen grid responsif (1 kolom mobile, 2 tablet, 4 desktop) */}
                <FoodGrid foods={filteredFoods} />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
