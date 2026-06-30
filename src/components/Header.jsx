import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Bell, User } from 'lucide-react';

/**
 * Header Component
 * Bagian hero header halaman utama yang menampilkan logo, judul,
 * dan ikon profil/notifikasi di pojok kanan.
 */
const Header = () => {
  return (
    <header className="bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white relative overflow-hidden transition-colors">
      {/* Dekorasi latar belakang geometris */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white rounded-full"></div>
        <div className="absolute -bottom-20 -left-10 w-80 h-80 bg-white rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between">
          {/* Logo & Teks Utama */}
          <div className="flex items-center gap-4 z-10">
            <div className="bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm p-3 rounded-2xl border border-white/30 dark:border-gray-600">
              <UtensilsCrossed className="w-8 h-8 text-white dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                CariMakan
              </h1>
              <p className="text-orange-100 text-sm sm:text-base mt-1 font-medium">
                Temukan makanan favoritmu dengan mudah 🍽️
              </p>
            </div>
          </div>

          {/* Ikon Aksi Kanan */}
          <div className="flex items-center gap-3">
            <button
              className="bg-white/15 hover:bg-white/25 backdrop-blur-sm p-2.5 rounded-xl border border-white/20 transition-all"
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button
              className="bg-white/15 hover:bg-white/25 backdrop-blur-sm p-2.5 rounded-xl border border-white/20 transition-all"
              aria-label="Profil pengguna"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
