import React, { useState } from 'react';
import '../../styles/LogoSplash.css';

export default function Navbar() {
    const [isSplashing, setIsSplashing] = useState(false);

    const handleLogoClick = () => {
        setIsSplashing(true);
        setTimeout(() => {
            setIsSplashing(false);
        }, 1000);
    };

    return ( 
        <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
            
          
            <div 
                className="relative flex items-center justify-center cursor-pointer"
                onClick={handleLogoClick}
            >
                <div className="sonar-waves">
                    <span className="wave w-1"></span>
                    <span className="wave w-2"></span>
                    <span className="wave w-3"></span>
                </div>      

                <img
                    src="/images/spot-on-logo.png"
                    alt="Spot On Logo"
                    className={`w-32 h-auto relative z-10 transition-transform duration-200 hover:scale-105 ${isSplashing ? 'pulse-anim' : ''}`}  
                />

                    
                {isSplashing && (
                    <div className="water-splash-effect">
                        <span className="splash-dot dot-1"></span>
                        <span className="splash-dot dot-2"></span>
                        <span className="splash-dot dot-3"></span>
                        <span className="splash-dot dot-4"></span>
                    </div>
                )}
            </div>
            
        
            <div className="hidden md:flex gap-6 text-blue-900 font-semibold">
                <a href="/" className="hover:text-blue-500">Beranda</a>
                <a href="/explore" className="hover:text-blue-500">Peta Spot</a>
                <a href="/add-spot" className="hover:text-blue-500">Tambah Spot</a>
            </div>
            
        </nav>
    );
}