import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar Component
 *
 * A modern search input used on the Home page to filter meals in real‑time.
 * It accepts the current search value and a callback to update the value.
 * When the input contains text, a clear button appears to reset the query.
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Current search string
 * @param {function(string):void} props.onChange - Handler called with the new
 *   search string whenever the input changes.
 *
 * @example
 * ```jsx
 * const [search, setSearch] = useState('');
 * <SearchBar value={search} onChange={setSearch} />
 * ```
 *
 * The component is fully styled with Tailwind CSS and adapts to dark mode.
 */
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="max-w-2xl mx-auto w-full px-4">
      <div
        className={`flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 transition-all duration-300 ${
          value ? 'border-orange-400 dark:border-orange-500 shadow-orange-100 dark:shadow-none' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
        }`}
      >
        {/* Ikon pencarian */}
        <div className="pl-4 pr-3 flex items-center">
          <Search
            className={`w-5 h-5 transition-colors ${value ? 'text-orange-500' : 'text-gray-400'}`}
          />
        </div>

        {/* Input teks */}
        <input
          id="food-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cari makanan favoritmu..."
          className="flex-1 py-4 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent outline-none text-base font-medium"
          autoComplete="off"
        />

        {/* Tombol clear (hanya muncul jika ada input) */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="pr-4 pl-2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Hapus pencarian"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Hint teks aktif */}
      {value && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 px-1 animate-fade-in">
          Menampilkan hasil untuk: <span className="font-semibold text-orange-600 dark:text-orange-400">"{value}"</span>
        </p>
      )}
    </div>
  );
};

export default SearchBar;
