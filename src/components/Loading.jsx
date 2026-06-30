import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading Component
 * Menampilkan animasi spinner dan tulisan, ditambah efek Skeleton Loading (opsional)
 */
const Loading = ({ message = 'Sedang mengambil data...', type = 'spinner' }) => {
  if (type === 'skeleton') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col p-4 animate-pulse">
            <div className="w-full h-40 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded-full w-1/2 mb-6"></div>
            <div className="mt-auto flex justify-between items-center border-t border-gray-100 pt-3">
              <div className="h-5 bg-gray-200 rounded-full w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 w-full">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      <p className="text-gray-500 font-medium dark:text-gray-400">{message}</p>
    </div>
  );
};

export default Loading;
