import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2, CheckCircle } from 'lucide-react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

/**
 * Cart Page
 * Halaman keranjang belanja yang menampilkan seluruh item,
 * kuantitas, total harga, dan tombol checkout.
 */
const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, totalItems, totalPriceFormatted, clearCart } = useCart();
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckedOut(true);
    clearCart();
    // Simulasi proses checkout selesai
    setTimeout(() => {
      setIsCheckedOut(false);
      navigate('/');
    }, 3000);
  };

  // State sukses checkout
  if (isCheckedOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-fade-in px-4">
        <div className="bg-green-50 border border-green-100 p-8 rounded-3xl flex flex-col items-center gap-4 max-w-sm w-full text-center shadow-sm">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <h2 className="text-2xl font-extrabold text-gray-800">Pesanan Berhasil!</h2>
          <p className="text-gray-500 text-sm">
            Terima kasih telah memesan. Pesananmu sedang diproses.
          </p>
          <p className="text-xs text-gray-400">Kamu akan dialihkan ke halaman utama...</p>
        </div>
      </div>
    );
  }

  // State keranjang kosong
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-fade-in px-4">
        <div className="bg-gray-50 p-8 rounded-3xl flex flex-col items-center gap-4 max-w-sm w-full text-center border border-gray-100">
          <div className="bg-orange-50 p-5 rounded-2xl">
            <ShoppingCart className="w-12 h-12 text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Keranjangmu masih kosong</h2>
          <p className="text-gray-400 text-sm">Yuk tambahkan makanan favoritmu dulu!</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Cari Makanan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header Halaman */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Keranjang Belanja</h1>
            <p className="text-sm text-gray-400">{totalItems} item dipilih</p>
          </div>
        </div>
        {/* Tombol kosongkan keranjang */}
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Kosongkan</span>
        </button>
      </div>

      {/* Daftar Item Keranjang */}
      <div className="flex flex-col gap-3 mb-8">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Ringkasan & Checkout */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky bottom-4">
        {/* Rincian Harga */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal ({totalItems} item)</span>
            <span className="font-semibold text-gray-800">{totalPriceFormatted}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Biaya Pengiriman</span>
            <span className="text-green-600 font-semibold">Gratis</span>
          </div>
          <div className="pt-3 border-t border-gray-100 flex justify-between font-extrabold text-gray-900 text-lg">
            <span>Total Belanja</span>
            <span className="text-orange-600">{totalPriceFormatted}</span>
          </div>
        </div>

        {/* Tombol Checkout */}
        <button
          type="button"
          onClick={handleCheckout}
          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold text-base py-4 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-orange-200 hover:shadow-lg flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Checkout Sekarang
        </button>
      </div>
    </div>
  );
};

export default Cart;
