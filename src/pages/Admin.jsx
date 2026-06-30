import React, { useState } from 'react';
import { Plus, Pencil, Trash2, LayoutDashboard, PackageSearch, AlertTriangle, Database, Clock } from 'lucide-react';
import { useFood } from '../context/FoodContext';
import FoodFormModal from '../components/FoodFormModal';

/**
 * Admin Page — /admin
 * Halaman pengelolaan makanan dengan fitur CRUD lengkap:
 * - READ   : Tabel daftar semua makanan lokal
 * - CREATE : Modal form tambah makanan baru
 * - UPDATE : Modal form edit dengan data pre-filled
 * - DELETE : Konfirmasi hapus makanan
 */
const Admin = () => {
  const { localFoods, addFood, updateFood, deleteFood } = useFood();

  // State untuk modal form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null); // null = mode Create

  // State untuk konfirmasi hapus
  const [deleteTarget, setDeleteTarget] = useState(null);

  // State notifikasi toast
  const [toast, setToast] = useState(null);

  // Tampilkan notifikasi sementara
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Buka modal untuk CREATE
  const handleOpenCreate = () => {
    setEditingFood(null);
    setIsModalOpen(true);
  };

  // Buka modal untuk EDIT/UPDATE
  const handleOpenEdit = (food) => {
    setEditingFood(food);
    setIsModalOpen(true);
  };

  // Submit form (Create atau Update tergantung editingFood)
  const handleFormSubmit = (formData) => {
    if (editingFood) {
      updateFood(editingFood.id, formData);
      showToast(`✅ "${formData.name}" berhasil diperbarui!`);
    } else {
      addFood(formData);
      showToast(`🎉 "${formData.name}" berhasil ditambahkan!`);
    }
    setIsModalOpen(false);
    setEditingFood(null);
  };

  // Konfirmasi hapus
  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      showToast(`🗑️ "${deleteTarget.name}" berhasil dihapus.`, 'error');
      deleteFood(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Toast Notifikasi */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-semibold transition-all ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          {toast.message}
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-2xl">
            <LayoutDashboard className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Kelola Makanan</h1>
            <p className="text-sm text-gray-400">
              {localFoods.length} makanan tersimpan lokal
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl shadow-sm hover:shadow-orange-200 hover:shadow-md transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Makanan
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-orange-50 p-3 rounded-xl">
            <Database className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{localFoods.length}</p>
            <p className="text-xs text-gray-400 font-medium">Total Makanan</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-xl">
            <PackageSearch className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">
              {[...new Set(localFoods.map((f) => f.category))].length}
            </p>
            <p className="text-xs text-gray-400 font-medium">Kategori Unik</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-purple-50 p-3 rounded-xl">
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">
              {localFoods.filter((f) => f.updatedAt).length}
            </p>
            <p className="text-xs text-gray-400 font-medium">Pernah Diedit</p>
          </div>
        </div>
      </div>

      {/* Tabel CRUD */}
      {localFoods.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 flex flex-col items-center gap-4 text-center">
          <PackageSearch className="w-14 h-14 text-gray-300" />
          <p className="text-gray-500 font-bold text-lg">Belum ada makanan</p>
          <p className="text-gray-400 text-sm">Klik "Tambah Makanan" untuk mulai menambahkan data.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Makanan</th>
                  <th className="text-left px-4 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider hidden sm:table-cell">Kategori</th>
                  <th className="text-left px-4 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider hidden md:table-cell">Asal</th>
                  <th className="text-left px-4 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Harga</th>
                  <th className="text-left px-4 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider hidden lg:table-cell">Disimpan</th>
                  <th className="text-center px-4 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {localFoods.map((food, index) => (
                  <tr
                    key={food.id}
                    className="hover:bg-orange-50/30 transition-colors group"
                    style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
                  >
                    {/* Kolom Makanan (Gambar + Nama) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={food.image}
                            alt={food.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/100x100?text=No+Image';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{food.name}</p>
                          <p className="text-xs text-gray-400">{food.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Kolom Kategori */}
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                        {food.category}
                      </span>
                    </td>

                    {/* Kolom Asal */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-gray-600 font-medium">{food.origin}</span>
                    </td>

                    {/* Kolom Harga */}
                    <td className="px-4 py-4">
                      <span className="font-extrabold text-orange-600">{food.price}</span>
                    </td>

                    {/* Kolom Tanggal */}
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="text-xs text-gray-400">
                        <p>{new Date(food.updatedAt || food.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        <p className="text-gray-300">{food.updatedAt ? 'Diedit' : 'Dibuat'}</p>
                      </div>
                    </td>

                    {/* Kolom Aksi */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Tombol Edit */}
                        <button
                          onClick={() => handleOpenEdit(food)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 font-semibold text-xs transition-colors"
                          title="Edit makanan"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => setDeleteTarget(food)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 font-semibold text-xs transition-colors"
                          title="Hapus makanan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form (Create & Update) */}
      <FoodFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingFood(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingFood}
      />

      {/* Dialog Konfirmasi Hapus */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            style={{ animation: 'zoomIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
          >
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Hapus Makanan?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Anda yakin ingin menghapus{' '}
              <span className="font-bold text-gray-800">"{deleteTarget.name}"</span>?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
