import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * FoodContext.jsx
 * Context API untuk mengelola daftar makanan lokal (CRUD).
 * Data disimpan di localStorage agar persisten setelah refresh halaman.
 */

const FoodContext = createContext(null);

// Key untuk localStorage
const STORAGE_KEY = 'carimakan_local_foods';

// Data sample awal jika localStorage kosong
const INITIAL_FOODS = [
  {
    id: 'local-1',
    name: 'Nasi Goreng Spesial',
    category: 'Makanan Utama',
    origin: 'Indonesia',
    price: 'Rp25.000',
    priceRaw: 25000,
    image: 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=500&auto=format&fit=crop&q=60',
    instructions: 'Nasi goreng khas Nusantara dengan bumbu rempah pilihan. Tumis bawang merah, bawang putih, cabai. Masukkan nasi, aduk rata dengan kecap manis dan garam. Sajikan dengan telur mata sapi dan kerupuk.',
    ingredients: ['300g Nasi Putih Dingin', '1 butir Telur', '2 siung Bawang Merah', '1 siung Bawang Putih', '1 sdm Kecap Manis', 'Secukupnya Garam & Merica'],
    isLocal: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'local-2',
    name: 'Sate Ayam Madura',
    category: 'Makanan Utama',
    origin: 'Madura',
    price: 'Rp30.000',
    priceRaw: 30000,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&auto=format&fit=crop&q=60',
    instructions: 'Sate ayam pilihan dibakar di atas arang hingga kecoklatan. Sajikan dengan bumbu kacang khas Madura yang gurih manis, potongan bawang merah, dan lontong hangat.',
    ingredients: ['250g Daging Ayam Fillet', '100g Kacang Tanah Goreng', '2 sdm Kecap Manis', '3 siung Bawang Merah', '2 siung Bawang Putih', '1 buah Lontong'],
    isLocal: true,
    createdAt: new Date().toISOString(),
  },
];

/**
 * FoodProvider — Komponen pembungkus yang menyediakan state CRUD makanan lokal.
 */
export const FoodProvider = ({ children }) => {
  // Inisialisasi state dari localStorage, atau gunakan data sample jika kosong
  const [localFoods, setLocalFoods] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FOODS;
      }
      return INITIAL_FOODS;
    } catch {
      return INITIAL_FOODS;
    }
  });

  // Simpan ke localStorage setiap kali localFoods berubah
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localFoods));
    } catch (err) {
      console.error('Gagal menyimpan data ke localStorage:', err);
    }
  }, [localFoods]);

  /**
   * CREATE — Menambahkan makanan baru ke daftar
   * @param {Object} foodData - Data makanan baru dari form
   */
  const addFood = useCallback((foodData) => {
    const newFood = {
      ...foodData,
      id: `local-${Date.now()}`,
      isLocal: true,
      createdAt: new Date().toISOString(),
    };
    setLocalFoods((prev) => [newFood, ...prev]);
    return newFood;
  }, []);

  /**
   * UPDATE — Memperbarui data makanan berdasarkan ID
   * @param {string} id - ID makanan yang akan diupdate
   * @param {Object} updatedData - Data baru makanan
   */
  const updateFood = useCallback((id, updatedData) => {
    setLocalFoods((prev) =>
      prev.map((food) =>
        food.id === id
          ? { ...food, ...updatedData, updatedAt: new Date().toISOString() }
          : food
      )
    );
  }, []);

  /**
   * DELETE — Menghapus makanan berdasarkan ID
   * @param {string} id - ID makanan yang akan dihapus
   */
  const deleteFood = useCallback((id) => {
    setLocalFoods((prev) => prev.filter((food) => food.id !== id));
  }, []);

  const value = {
    localFoods,
    addFood,
    updateFood,
    deleteFood,
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
};

/**
 * useFood — Custom hook untuk mengakses FoodContext
 */
export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFood harus digunakan di dalam FoodProvider');
  }
  return context;
};

export default FoodContext;
