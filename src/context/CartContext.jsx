import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * CartContext.jsx
 * Context API untuk manajemen state keranjang belanja secara global.
 * Menyediakan fungsi CRUD item dan kalkulasi total otomatis.
 */

// Buat context keranjang belanja
const CartContext = createContext(null);

/**
 * CartProvider - Komponen pembungkus yang menyediakan state keranjang ke seluruh aplikasi.
 * Bungkus komponen utama dengan CartProvider di App.jsx.
 */
export const CartProvider = ({ children }) => {
  // State untuk menyimpan daftar item di keranjang
  const [cartItems, setCartItems] = useState([]);

  /**
   * Menambahkan makanan ke keranjang.
   * Jika makanan sudah ada, tambahkan kuantitasnya.
   * @param {Object} meal - Objek makanan yang sudah diformat dari mapMeal()
   */
  const addToCart = useCallback((meal) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === meal.id);
      if (existing) {
        // Tambah kuantitas jika sudah ada di keranjang
        return prev.map((item) =>
          item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Tambahkan item baru dengan kuantitas awal 1
      return [...prev, { ...meal, quantity: 1 }];
    });
  }, []);

  /**
   * Menghapus satu item dari keranjang berdasarkan ID.
   * @param {string} id - ID makanan
   */
  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  /**
   * Mengubah kuantitas item di keranjang.
   * Jika kuantitas menjadi 0, hapus item dari keranjang.
   * @param {string} id - ID makanan
   * @param {number} delta - Nilai perubahan (+1 atau -1)
   */
  const updateQuantity = useCallback((id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  /**
   * Mengosongkan seluruh isi keranjang belanja.
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Kalkulasi total jumlah item di keranjang (untuk badge Navbar)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Kalkulasi total harga belanja
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.priceRaw * item.quantity,
    0
  );

  // Format total harga ke rupiah
  const totalPriceFormatted = `Rp${totalPrice.toLocaleString('id-ID')}`;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    totalPriceFormatted,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * useCart - Custom hook untuk mengakses CartContext dengan mudah.
 * Gunakan hook ini di komponen manapun yang membutuhkan akses keranjang belanja.
 * @returns {Object} Nilai context keranjang belanja
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
};

export default CartContext;
