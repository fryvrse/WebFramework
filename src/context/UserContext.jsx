import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * UserContext.jsx
 * Context API untuk mengelola daftar pengguna (CRUD).
 * Data disimpan di localStorage agar persisten setelah refresh halaman.
 */

const UserContext = createContext(null);

const STORAGE_KEY = 'carimakan_users';

const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'Admin Utama',
    email: 'admin@carimakan.id',
    password: 'admin',
    role: 'Admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    name: 'Pengguna Setia',
    email: 'pengguna@gmail.com',
    password: 'user',
    role: 'Pengguna',
    createdAt: new Date().toISOString(),
  },
];

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (err) {
      console.error('Gagal menyimpan data pengguna ke localStorage:', err);
    }
  }, [users]);

  const addUser = useCallback((userData) => {
    const newUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  }, []);

  const updateUser = useCallback((id, updatedData) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, ...updatedData, updatedAt: new Date().toISOString() }
          : user
      )
    );
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  }, []);

  const value = {
    users,
    addUser,
    updateUser,
    deleteUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser harus digunakan di dalam UserProvider');
  }
  return context;
};

export default UserContext;
