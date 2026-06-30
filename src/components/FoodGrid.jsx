import React from 'react';
import FoodCard from './FoodCard';

/**
 * FoodGrid Component
 * Menampilkan daftar makanan dalam bentuk grid responsive
 * (1 kolom di mobile, 2 kolom di tablet, 4 kolom di desktop)
 */
const FoodGrid = ({ foods }) => {
  if (!foods || foods.length === 0) return null;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {foods.map((food) => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
};

export default FoodGrid;
