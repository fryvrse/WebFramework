import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronRight, MapPin, Tag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorite } from '../context/FavoriteContext';
import { useToast } from '../context/ToastContext';

/**
 * FoodCard Component
 * Kartu makanan modern dengan efek hover, gambar, harga, tombol pesan, dan fitur favorit.
 * Tema Orange + Dark Mode Support.
 */
const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorite();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/detail/${food.id}`);
  };

  const handleOrder = (e) => {
    e.stopPropagation();
    addToCart(food);
    showToast(`${food.name} ditambahkan ke keranjang!`, 'success');
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(food);
    const isFav = isFavorite(food.id);
    if (!isFav) {
      showToast(`${food.name} ditambahkan ke favorit!`, 'success');
    } else {
      showToast(`${food.name} dihapus dari favorit.`, 'info');
    }
  };

  const isFav = isFavorite(food.id);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col cursor-pointer group
                 hover:-translate-y-2 hover:shadow-xl hover:border-orange-100 dark:hover:border-orange-900 transition-all duration-300 animate-fade-in"
      onClick={handleCardClick}
      role="article"
      aria-label={`Kartu makanan: ${food.name}`}
    >
      {/* Gambar Makanan */}
      <div className="relative overflow-hidden h-48 bg-gray-100 dark:bg-gray-900">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x300?text=No+Image';
          }}
        />
        {/* Tombol Favorite */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-110 transition-transform"
          aria-label="Toggle Favorite"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-300'}`} />
        </button>

        {/* Badge Kategori */}
        <span className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-orange-100 dark:border-orange-900/50 flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {food.category}
        </span>
      </div>

      {/* Konten Kartu */}
      <div className="p-4 flex flex-col flex-1">
        {/* Asal Negara */}
        <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs mb-2">
          <MapPin className="w-3 h-3" />
          <span>{food.origin}</span>
        </div>

        {/* Nama Makanan */}
        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug mb-3 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {food.name}
        </h3>

        {/* Footer: Harga + Tombol */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">Estimasi</p>
            <p className="text-lg font-extrabold text-orange-600 dark:text-orange-500">{food.price}</p>
          </div>

          <button
            type="button"
            onClick={handleOrder}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-orange-200 dark:hover:shadow-none hover:shadow-md"
            aria-label={`Pesan ${food.name}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Pesan</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
