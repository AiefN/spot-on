import React from 'react';

export default function SpotCard({ spot }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={spot.image || 'https://via.placeholder.com/400x300?text=Spot+Mancing'} 
          alt={spot.name} 
          className="w-full h-full object-cover"
        />
        
        <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {spot.category}
        </span>
      </div>


      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{spot.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{spot.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-blue-500 font-semibold text-sm">
            📍 {spot.location}
          </span>
          <button className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}