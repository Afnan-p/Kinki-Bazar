import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = 'text-primary', size = 'text-xs' }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(<FaStar key={i} />);
    } else if (value >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} />);
    } else {
      stars.push(<FaRegStar key={i} />);
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center ${color} ${size} space-x-0.5`}>
        {stars}
      </div>
      {text && (
        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
          {text}
        </span>
      )}
    </div>
  );
};

export default Rating;


