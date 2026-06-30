import React from 'react';
import { UtensilsCrossed, Heart } from 'lucide-react';

/**
 * Footer Component
 *
 * This component renders the page footer, displaying copyright information,
 * the project branding, and a credit link to the data source (TheMealDB).
 * It is a presentational component without any props. The component is
 * imported and placed at the bottom of the main layout (inside `App.jsx`).
 *
 * Usage:
 * ```jsx
 * import Footer from './components/Footer';
 * // Inside layout
 * <Footer />
 * ```
 *
 * No external state or side‑effects are used; the component simply renders
 * static JSX with dynamic current year via `new Date().getFullYear()`.
 */
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">CariMakan</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-center">
            &copy; {new Date().getFullYear()} CariMakan. Dibuat dengan{' '}
            <Heart className="inline w-3.5 h-3.5 text-red-400 fill-red-400" /> menggunakan{' '}
            <span className="text-orange-400 font-semibold">React</span> +{' '}
            <span className="text-purple-400 font-semibold">Vite</span> +{' '}
            <span className="text-cyan-400 font-semibold">Tailwind CSS</span>
          </p>

          {/* Data source */}
          <p className="text-xs text-gray-500 text-center sm:text-right">
            Data dari{' '}
            <a
              href="https://www.themealdb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
            >
              TheMealDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
