import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, ShoppingCart, User, Home, LayoutDashboard, Users, LogOut, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar Component
 * Bar navigasi sticky dengan tema Orange & mendukung Dark Mode.
 */
const Navbar = () => {
  const { totalItems } = useCart();
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Inisialisasi Dark Mode
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Beranda', icon: <Home className="w-4 h-4" /> },
  ];

  if (currentUser?.role === 'Admin') {
    navLinks.push({ to: '/admin', label: 'Kelola Makanan', icon: <LayoutDashboard className="w-4 h-4" /> });
    navLinks.push({ to: '/admin/users', label: 'Kelola Pengguna', icon: <Users className="w-4 h-4" /> });
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-orange-500 p-2 rounded-xl group-hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 dark:shadow-none">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">CariMakan</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(to)
                    ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
              >
                {icon}
                <span className="hidden md:inline">{label}</span>
              </Link>
            ))}

            {/* Keranjang dengan Badge — indikator jumlah item real-time dari CartContext (Poin 6) */}
            <Link
              to="/cart"
              id="cart-nav-link"
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/cart')
                  ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {/* Label: 🛒 Cart (3) — jumlah item berubah otomatis saat ditambah/dihapus */}
              <span className="font-semibold">
                Cart ({totalItems})
              </span>
              {totalItems > 0 && (
                <span className="bg-orange-500 text-white text-[10px] font-extrabold rounded-full px-1.5 py-0.5 leading-none shadow-sm">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 ml-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profil / Login */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 ml-1 sm:ml-2 border-l border-gray-200 dark:border-gray-700">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200 hidden lg:inline mr-2">
                  Halo, {currentUser.name.split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-all"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 ml-2 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-sm hover:shadow-md transition-all dark:shadow-none"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
