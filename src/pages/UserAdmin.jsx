import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Users, AlertTriangle, ShieldCheck, User } from 'lucide-react';
import { useUser } from '../context/UserContext';
import UserFormModal from '../components/UserFormModal';

/**
 * UserAdmin Page — /admin/users
 * Halaman pengelolaan pengguna dengan fitur CRUD lengkap.
 */
const UserAdmin = () => {
  const { users, addUser, updateUser, deleteUser } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingUser) {
      updateUser(editingUser.id, formData);
      showToast(`✅ Pengguna "${formData.name}" berhasil diperbarui!`);
    } else {
      addUser(formData);
      showToast(`🎉 Pengguna "${formData.name}" berhasil ditambahkan!`);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      showToast(`🗑️ Pengguna "${deleteTarget.name}" berhasil dihapus.`, 'error');
      deleteUser(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-2xl">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Kelola Pengguna</h1>
            <p className="text-sm text-gray-400">
              {users.length} pengguna terdaftar
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl shadow-sm hover:shadow-orange-200 hover:shadow-md transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-orange-50 p-3 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">
              {users.filter(u => u.role === 'Admin').length}
            </p>
            <p className="text-xs text-gray-400 font-medium">Total Admin</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-xl">
            <User className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">
              {users.filter(u => u.role === 'Pengguna').length}
            </p>
            <p className="text-xs text-gray-400 font-medium">Total Pengguna Biasa</p>
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 flex flex-col items-center gap-4 text-center">
          <Users className="w-14 h-14 text-gray-300" />
          <p className="text-gray-500 font-bold text-lg">Belum ada pengguna</p>
          <p className="text-gray-400 text-sm">Klik "Tambah Pengguna" untuk mulai menambahkan data.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Nama & Email</th>
                  <th className="text-left px-4 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Role</th>
                  <th className="text-left px-4 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider hidden sm:table-cell">Tanggal Daftar</th>
                  <th className="text-center px-4 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-orange-50/30 transition-colors group"
                    style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600 font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        user.role === 'Admin' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="text-xs text-gray-400">
                        <p>{new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 font-semibold text-xs transition-colors"
                          title="Edit pengguna"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 font-semibold text-xs transition-colors"
                          title="Hapus pengguna"
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

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingUser}
      />

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
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Hapus Pengguna?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Anda yakin ingin menghapus pengguna{' '}
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

export default UserAdmin;
