import React from 'react';
import { Frown } from 'lucide-react';

/**
 * Error Component
 * Menampilkan pesan error secara seragam
 */
const ErrorMessage = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 w-full">
      <div className="bg-red-50 p-5 rounded-3xl dark:bg-red-900/20">
        <Frown className="w-12 h-12 text-red-500" />
      </div>
      <p className="text-gray-700 font-semibold text-lg dark:text-gray-300">Oops! Terjadi Kesalahan</p>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage;
