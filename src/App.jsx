import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { FoodProvider } from './context/FoodContext';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import { FavoriteProvider } from './context/FavoriteContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Admin from './pages/Admin';
import UserAdmin from './pages/UserAdmin';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * App.jsx — Komponen root aplikasi CariMakan.
 *
 * Context Providers (dari luar ke dalam):
 *  - UserProvider    : data daftar user (CRUD)
 *  - AuthProvider    : status login / logout
 *  - FoodProvider    : data CRUD makanan lokal
 *  - FavoriteProvider: status favorit makanan
 *  - ToastProvider   : notifikasi pop-up global
 *  - CartProvider    : state keranjang belanja (CartContext)
 *
 * Routes (Poin 5 — Navigasi Multi-Halaman dengan React Router):
 *  /login       → Login      — halaman autentikasi (PUBLIC)
 *
 *  Routes berikut memerlukan login (ProtectedRoute tanpa role):
 *  /            → Home       — daftar makanan + pencarian
 *  /detail/:id  → Detail     — detail makanan (useParams untuk ambil ID)
 *  /cart        → Cart       — keranjang belanja
 *
 *  Routes berikut memerlukan role Admin:
 *  /admin       → Admin      — CRUD makanan (protected: Admin only)
 *  /admin/users → UserAdmin  — CRUD pengguna (protected: Admin only)
 */
function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AuthProvider>
          <FoodProvider>
            <FavoriteProvider>
              <ToastProvider>
                <CartProvider>
                  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
                    <Navbar />
                    <main className="flex-1">
                      <Routes>
                        {/* Public — tidak perlu login */}
                        <Route path="/login" element={<Login />} />

                        {/* Protected — wajib login (semua role) */}
                        <Route element={<ProtectedRoute />}>
                          <Route path="/" element={<Home />} />
                          <Route path="/detail/:id" element={<Detail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="*" element={<Home />} />
                        </Route>

                        {/* Protected — khusus Admin */}
                        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                          <Route path="/admin" element={<Admin />} />
                          <Route path="/admin/users" element={<UserAdmin />} />
                        </Route>
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </CartProvider>
              </ToastProvider>
            </FavoriteProvider>
          </FoodProvider>
        </AuthProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
