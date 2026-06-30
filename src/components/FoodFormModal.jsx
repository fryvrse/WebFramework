import React, { useState, useEffect } from 'react';
import { X, Save, ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * FoodFormModal Component
 * Modal form untuk operasi Create dan Update makanan lokal.
 * Mendukung preview gambar dari URL dan validasi input.
 *
 * @param {boolean} isOpen - Status buka/tutup modal
 * @param {function} onClose - Callback untuk menutup modal
 * @param {function} onSubmit - Callback saat form disubmit dengan data valid
 * @param {Object|null} initialData - Data awal untuk mode Edit (null = mode Create)
 */
const FoodFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const isEditMode = Boolean(initialData);

  // State form
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    origin: '',
    priceRaw: '',
    image: '',
    instructions: '',
    ingredients: '',
  });
  const [errors, setErrors] = useState({});
  const [imgError, setImgError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Isi form dengan data awal saat mode Edit, atau kosongkan saat mode Create
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setErrors({});
      setImgError(false);
      if (isEditMode && initialData) {
        setFormData({
          name: initialData.name || '',
          category: initialData.category || '',
          origin: initialData.origin || '',
          priceRaw: initialData.priceRaw || '',
          image: initialData.image || '',
          instructions: initialData.instructions || '',
          ingredients: Array.isArray(initialData.ingredients)
            ? initialData.ingredients.join('\n')
            : initialData.ingredients || '',
        });
      } else {
        setFormData({ name: '', category: '', origin: '', priceRaw: '', image: '', instructions: '', ingredients: '' });
      }
    }
  }, [isOpen, isEditMode, initialData]);

  // Update field tertentu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Hapus error saat pengguna mulai mengetik
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validasi form sebelum submit
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama makanan wajib diisi.';
    if (!formData.category.trim()) newErrors.category = 'Kategori wajib diisi.';
    if (!formData.origin.trim()) newErrors.origin = 'Asal daerah wajib diisi.';
    if (!formData.priceRaw || isNaN(Number(formData.priceRaw)) || Number(formData.priceRaw) <= 0)
      newErrors.priceRaw = 'Harga harus berupa angka positif (tanpa Rp).';
    if (!formData.image.trim()) newErrors.image = 'URL gambar wajib diisi.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const priceRaw = Number(formData.priceRaw);
    const ingredientsArray = formData.ingredients
      ? formData.ingredients
          .split(/[\n,]/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
      : [];

    const finalData = {
      ...formData,
      priceRaw,
      price: `Rp${priceRaw.toLocaleString('id-ID')}`,
      instructions: formData.instructions || 'Tidak ada instruksi tersedia.',
      ingredients: ingredientsArray,
    };

    setSubmitted(true);
    setTimeout(() => {
      onSubmit(finalData);
      setSubmitted(false);
    }, 600);
  };

  if (!isOpen) return null;

  const categories = ['Makanan Utama', 'Camilan', 'Minuman', 'Dessert', 'Sarapan', 'Seafood', 'Vegetarian', 'Lainnya'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'zoomIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {isEditMode ? '✏️ Edit Makanan' : '➕ Tambah Makanan Baru'}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEditMode ? `Memperbarui: ${initialData?.name}` : 'Isi form di bawah untuk menambahkan makanan'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Preview Gambar */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200">
            {formData.image && !imgError ? (
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                <ImageIcon className="w-10 h-10" />
                <span className="text-sm">{imgError ? 'URL gambar tidak valid' : 'Preview gambar'}</span>
              </div>
            )}
          </div>

          {/* Grid 2 kolom untuk field utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Makanan */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nama Makanan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Nasi Goreng Spesial"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400 bg-gray-50 focus:bg-white'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all appearance-none ${
                  errors.category ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400 bg-gray-50 focus:bg-white'
                }`}
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.category}</p>}
            </div>

            {/* Asal Daerah */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Asal Daerah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="Contoh: Jawa Tengah"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                  errors.origin ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400 bg-gray-50 focus:bg-white'
                }`}
              />
              {errors.origin && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.origin}</p>}
            </div>

            {/* Harga */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Harga (Rupiah, tanpa titik/koma) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-0">
                <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm font-bold text-gray-500">Rp</span>
                <input
                  type="number"
                  name="priceRaw"
                  value={formData.priceRaw}
                  onChange={handleChange}
                  placeholder="25000"
                  min="1000"
                  className={`flex-1 px-4 py-3 rounded-r-xl border text-sm font-medium outline-none transition-all ${
                    errors.priceRaw ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400 bg-gray-50 focus:bg-white'
                  }`}
                />
              </div>
              {formData.priceRaw && !isNaN(Number(formData.priceRaw)) && Number(formData.priceRaw) > 0 && (
                <p className="text-orange-500 text-xs mt-1 font-medium">
                  Akan ditampilkan sebagai: Rp{Number(formData.priceRaw).toLocaleString('id-ID')}
                </p>
              )}
              {errors.priceRaw && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.priceRaw}</p>}
            </div>

            {/* URL Gambar */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                URL Gambar <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={(e) => { handleChange(e); setImgError(false); }}
                placeholder="https://images.unsplash.com/..."
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                  errors.image ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400 bg-gray-50 focus:bg-white'
                }`}
              />
              {errors.image && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.image}</p>}
            </div>

            {/* Bahan-bahan */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Bahan-bahan <span className="text-gray-400 font-normal">(pisahkan dengan koma atau baris baru, opsional)</span>
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Contoh:&#10;300g Nasi Putih&#10;1 butir Telur&#10;Kecap Manis"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 bg-gray-50 focus:bg-white text-sm font-medium outline-none transition-all resize-none"
              />
            </div>

            {/* Pemisah atau Jarak */}
            <div className="sm:col-span-2 border-t border-gray-100 my-2"></div>

            {/* Instruksi / Deskripsi */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Deskripsi / Instruksi <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Tuliskan cara pembuatan atau deskripsi singkat makanan..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 bg-gray-50 focus:bg-white text-sm font-medium outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitted}
              className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                submitted
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-orange-200 hover:shadow-md'
              }`}
            >
              {submitted ? (
                <><CheckCircle className="w-4 h-4" /> Tersimpan!</>
              ) : (
                <><Save className="w-4 h-4" /> {isEditMode ? 'Simpan Perubahan' : 'Tambah Makanan'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodFormModal;
