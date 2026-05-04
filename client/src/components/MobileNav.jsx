import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiShoppingCart, FiHeart, FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const MobileNav = () => {
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart);

  const navItems = [
    { icon: <FiHome />, label: 'Home', path: '/' },
    { icon: <FiGrid />, label: 'Shop', path: '/shop' },
    { icon: <FiShoppingCart />, label: 'Cart', path: '/cart', badge: cartItems.length },
    { icon: <FiHeart />, label: 'Wishlist', path: '/wishlist' },
    { icon: <FiUser />, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center">
        {navItems.map((item) => (
          <Link 
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center p-2 rounded-xl transition-colors relative ${
              location.pathname === item.path ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            {item.badge > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {item.badge}
              </span>
            )}
            {location.pathname === item.path && (
              <div className="absolute -top-2 w-1 h-1 bg-primary rounded-full"></div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
