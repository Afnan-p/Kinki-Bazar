import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ showText = true, className = "", textColor = "text-accent", iconSize = "w-12 h-12", isTransparent = false }) => {
  return (
    <div className={`flex items-center space-x-3 group cursor-pointer ${className}`}>
      <motion.div 
        whileHover={{ scale: 1.05, rotate: -3 }}
        className={`${iconSize} relative flex-shrink-0`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
          {/* Circular Badge - Maroon/Dark Brown from image */}
          <circle cx="50" cy="50" r="48" fill="#3D1A1A" />
          
          {/* Square Border */}
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
          
          {/* KB Monogram Stylized */}
          <g fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            {/* K */}
            <path d="M35 35V65" />
            <path d="M35 50L50 35" />
            <path d="M35 50L50 65" />
            {/* B */}
            <path d="M55 35V65H60C64 65 67 62 67 58C67 54 64 51 60 51H55" />
            <path d="M55 35H60C63 35 65 37 65 40C65 43 63 45 60 45H55" />
          </g>
          
          {/* Small Tagline */}
          <text 
            x="50" 
            y="84" 
            fill="white" 
            fontSize="5" 
            textAnchor="middle" 
            fontWeight="900" 
            letterSpacing="1.5"
            className="opacity-50"
          >
            PAIKAT GROUP
          </text>
        </svg>
      </motion.div>

      {showText && (
        <div className="flex items-center space-x-1.5 leading-none overflow-hidden">
          <span className={`text-2xl md:text-3xl font-black tracking-tighter font-['Bricolage_Grotesque'] transition-all duration-500 flex items-center`}>
            <span className="text-[#E11D48] lowercase">kinki</span>
            <span className={`uppercase ml-1 ${isTransparent ? 'text-white' : 'text-[#E11D48]'}`}>Bazar</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
