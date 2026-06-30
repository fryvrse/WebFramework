import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckCircle, UserPlus, UserCircle } from 'lucide-react';

/**
 * UserFormModal Component
 * Modal form untuk operasi Create dan Update pengguna.
 *
 * @param {boolean} isOpen - Status buka/tutup modal
 * @param {function} onClose - Callback untuk menutup modal
 * @param {function} onSubmit - Callback saat form disubmit dengan data valid
 * @param {Object|null} initialData - Data awal untuk mode Edit (null = mode Create)
 */
const UserFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setErrors({});
      if (isEditMode && initialData) {
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          password: initialData.password || '',
          role: initialData.role || '',
        });
      } else {
        setFormData({ name: '', email: '', password: '', role: '' });
      }
    }
  }, [isOpen, isEditMode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid.';
    }
    if (!formData.password.trim()) newErrors.password = 'Kata sandi wajib diisi.';
    if (!formData.role.trim()) newErrors.role = 'Role wajib dipilih.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      onSubmit(formData);
      setSubmitted(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'zoomIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 p-2 rounded-xl">
              {isEditMode ? <UserCircle className="w-6 h-6 text-orange-500" /> : <UserPlus className="w-6 h-6 text-orange-500" />}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                {isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {isEditMode ? `Memperbarui: ${initialData?.name}` : 'Isi form di bawah untuk menambahkan pengguna'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: John Doe"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400 bg-gray-50 focus:bg-white'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Alamat Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Contoh: john@example.com"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400 bg-gray-50 focus:bg-white'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Kata Sandi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contoh: rahasia123"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400 bg-gray-50 focus:bg-white'
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Role Pengguna <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all appearance-none ${
                errors.role ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400 bg-gray-50 focus:bg-white'
              }`}
            >
              <option value="">-- Pilih Role --</option>
              <option value="Admin">Admin</option>
              <option value="Pengguna">Pengguna</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.role}</p>}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
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
                <><Save className="w-4 h-4" /> {isEditMode ? 'Simpan Perubahan' : 'Tambah Pengguna'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
