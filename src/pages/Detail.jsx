import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, MapPin, Tag, BookOpen, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFood } from '../context/FoodContext';
import { useToast } from '../context/ToastContext';
import { getMealById } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/Error';

/**
 * Detail Page
 * Menampilkan informasi lengkap satu makanan berdasarkan ID dari URL parameter.
 * Menggunakan Axios untuk fetch data detail dari API.
 */
const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { localFoods } = useFood();
  const { showToast } = useToast();

  const [apiMeal, setApiMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cek apakah ini makanan lokal (CRUD Admin)
  const isLocal = id && id.startsWith('local-');
  const localMeal = isLocal ? localFoods.find((f) => f.id === id) : null;

  useEffect(() => {
    if (isLocal) {
      setLoading(false);
      if (!localMeal) setError('Makanan lokal tidak ditemukan');
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const mealData = await getMealById(id);
        if (mealData) {
          setApiMeal(mealData);
        } else {
          setError('Makanan tidak ditemukan dari server.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, isLocal, localMeal]);

  // Tentukan makanan yang akan dirender (lokal atau API)
  const meal = isLocal ? localMeal : apiMeal;

  // Cek keranjang
  const isInCart = cartItems.some((item) => item.id === id);

  const handleAddToCart = () => {
    if (meal) {
      addToCart(meal);
      showToast(`${meal.name} ditambahkan ke keranjang!`, 'success');
    }
  };

  if (loading) return <Loading message="Memuat detail makanan..." />;
  if (error || !meal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ErrorMessage message={error || 'Makanan tidak ditemukan.'} />
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </button>
      </div>
    );
  }

  const shortInstructions = meal?.instructions ? meal.instructions.slice(0, 800) : '';
  const hasMore = meal?.instructions ? meal.instructions.length > 800 : false;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in dark:bg-gray-900 transition-colors">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 mb-6 font-medium transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
        <div className="relative h-72 sm:h-96 overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-lg leading-tight">
              {meal.name}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="flex items-center gap-1.5 bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 font-semibold text-sm px-4 py-1.5 rounded-full border border-orange-100 dark:border-orange-800">
              <Tag className="w-4 h-4" />
              {meal.category}
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300 font-semibold text-sm px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-600">
              <MapPin className="w-4 h-4" />
              {meal.origin}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border border-orange-100 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium mb-1">Estimasi Harga</p>
              <p className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">{meal.price}</p>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm ${
                isInCart
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-orange-200 hover:shadow-md'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isInCart ? '✓ Ditambahkan ke Keranjang' : 'Tambah ke Keranjang'}
            </button>
          </div>

          {meal.ingredients && meal.ingredients.length > 0 && (
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Bahan-bahan</h2>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600 dark:text-gray-300 text-sm">
                  {meal.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Instruksi Memasak</h2>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                {shortInstructions}{hasMore && '...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
