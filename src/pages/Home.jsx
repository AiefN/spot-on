import React from 'react';
import Navber from '../components/comon/Navbar';
import FishingScene from '../components/3d/FishingScene';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-10">
            
            


            <div className="w-full md:1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leadig-tight">
                Temukan Spot Mancing Terbaikmu Bersama <span className="text-blue-500">Spot On</span>
            </h1>
            <p className="text-lg text-gray-600">
                Dari sungau alami, laut lepas, hingga kolam galatama dan pemancingan favorit. Jelajahi, ulas, dan rasakan sensasi tarikannya!
            </p>
            <div className="flec gap-4">
                <button className=" bg-blue-600 hover:bg -blue-700 text-white font-semibold py-3 px-6 rounder-full shadow-md transition">
                    Cari Spot Terdekat
                </button>
                <button className=" bg-white border-2 border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 transition">
                    Lihat Peta
                </button>
            </div>
            </div>
            <div className="w-full md:w1/2 h-96 relative">
                <FishingScene />
            </div>
            </main>
        </div>
    );
}