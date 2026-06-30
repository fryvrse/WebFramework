import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

/**
 * CartItem Component
 * Merender satu baris item di halaman keranjang belanja.
 * Menampilkan gambar, nama, harga satuan, kontrol kuantitas (+/-), dan tombol hapus.
 *
 * @param {Object} item - Objek item di keranjang belanja
 */
const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const itemTotal = `Rp${(item.priceRaw * item.quantity).toLocaleString('id-ID')}`;

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-orange-100 hover:shadow-md transition-all duration-200 animate-fade-in">
      
      {/* Gambar Makanan */}
      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info Makanan */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{item.name}</h4>
        <p className="text-xs text-gray-400 mt-0.5">{item.category} · {item.origin}</p>
        <p className="text-orange-600 font-bold text-sm mt-1">{item.price}</p>
      </div>

      {/* Kontrol Kuantitas & Total */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {/* Total harga item */}
        <p className="text-gray-800 font-extrabold text-sm">{itemTotal}</p>

        {/* Tombol +/- Kuantitas */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, -1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Kurangi jumlah"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, 1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors"
            aria-label="Tambah jumlah"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tombol Hapus */}
        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
          aria-label={`Hapus ${item.name} dari keranjang`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
