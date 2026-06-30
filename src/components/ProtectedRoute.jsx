import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Mencegah pengguna yang belum login atau tidak memiliki role yang tepat
 * mengakses halaman tertentu (seperti Admin).
 *
 * @param {Array<string>} allowedRoles - Daftar role yang diizinkan (opsional)
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser } = useAuth();

  // Jika belum login, arahkan ke halaman Login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada restriksi role dan role user tidak termasuk, arahkan ke Beranda
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  // Jika lolos pengecekan, tampilkan komponen anak (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
