import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, UtensilsCrossed } from 'lucide-react';

const Login = () => {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Halaman yang ingin dituju sebelum diarahkan ke login
  const from = location.state?.from?.pathname || '/';

  // Jika sudah login, langsung redirect ke tujuan
  if (currentUser) return <Navigate to={from} replace />;

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(formData.email, formData.password);
      if (result.success) {
        navigate(from, { replace: true }); // Kembali ke halaman asal
      } else {
        setError(result.message);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8" style={{ animation: 'fadeIn 0.4s ease-out' }}>
        <div className="flex flex-col items-center mb-8">
          <div className="bg-orange-500 p-3 rounded-2xl mb-4">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Selamat Datang</h1>
          <p className="text-gray-500 text-sm mt-1">Masuk untuk mengelola CariMakan</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm font-semibold mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Alamat Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@carimakan.id"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 bg-gray-50 focus:bg-white text-sm font-medium outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kata Sandi</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 bg-gray-50 focus:bg-white text-sm font-medium outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all ${
              isLoading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-sm hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Masuk ke Akun
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Demo Akun Admin: <span className="font-semibold text-gray-600">admin@carimakan.id</span> / <span className="font-semibold text-gray-600">admin</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
