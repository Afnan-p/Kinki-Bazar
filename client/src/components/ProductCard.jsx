import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye, FiStar } from 'react-icons/fi';
import Rating from './Rating';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlist, userInfo } = useSelector((state) => state.auth);
  
  const isWishlisted = wishlist.some(
    (item) => (item._id || item) === product._id
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || '',
      price: product.price,
      qty: 1,
      stock: product.stock
    }));
    toast.success('Added to collection');
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please login to curate your wishlist');
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist');
    }
  };

  return (
    <motion.div 
      className="group relative bg-white rounded-[50px] overflow-hidden transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-transparent hover:border-primary/10 will-change-transform"
    >
      {/* 1. LARGE CINEMATIC IMAGE */}
      <div className="relative aspect-[4/5] m-3 overflow-hidden rounded-[40px] bg-[#FDFDFD]">
        <Link to={`/product/${product._id}`} className="block h-full w-full">
          <motion.img 
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            src={product.images?.[0]?.url || 'https://via.placeholder.com/600x800'} 
            alt={product.name}
            className="w-full h-full object-cover will-change-transform"
          />
        </Link>

        {/* 2. HOVER OVERLAY & QUICK ACTIONS */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {/* Wishlist Button with Animation */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleWishlist}
            className={`w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 backdrop-blur-2xl shadow-xl ${
              isWishlisted 
                ? 'bg-primary text-white shadow-primary/30' 
                : 'bg-white/90 text-accent hover:bg-primary hover:text-white'
            }`}
          >
            <FiHeart className={`text-base md:text-xl ${isWishlisted ? 'fill-current animate-pulse' : ''}`} />
          </motion.button>
        </div>

        {/* Status Badges */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-2 z-10">
          {product.isNewArrival && (
            <span className="bg-[#0B1020] text-white text-[7px] md:text-[9px] font-black uppercase tracking-[2px] md:tracking-[4px] px-3 md:px-5 py-1.5 md:py-2 rounded-full shadow-2xl border border-white/10">
              New Arrival
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-primary text-white text-[7px] md:text-[9px] font-black uppercase tracking-[2px] md:tracking-[4px] px-3 md:px-5 py-1.5 md:py-2 rounded-full shadow-2xl shadow-primary/20">
              Best Seller
            </span>
          )}
        </div>

        {/* Quick Add Button Overlay */}
        <div className="absolute inset-x-6 bottom-6 translate-y-[130%] group-hover:translate-y-0 transition-transform duration-700 z-20 hidden md:block">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-[#0B1020] text-white h-16 rounded-[22px] flex items-center justify-center space-x-4 font-black text-[11px] uppercase tracking-[4px] hover:bg-primary transition-all duration-500 shadow-2xl active:scale-95 group/btn"
          >
            <FiShoppingCart className="text-lg group-hover/btn:scale-110 transition-transform" />
            <span>Add To Collection</span>
          </button>
        </div>

        {/* Mobile Quick Add */}
        <div className="absolute inset-x-2 bottom-2 md:hidden z-20">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white/95 backdrop-blur-2xl h-8 rounded-lg flex items-center justify-center text-accent shadow-xl active:bg-primary active:text-white transition-all font-black text-[8px] uppercase tracking-wider"
          >
            <FiShoppingCart className="mr-1" />
            Add
          </button>
        </div>
      </div>

      {/* 3. PRODUCT INFO */}
      <div className="p-4 md:p-8 pt-2 md:pt-4 flex flex-col text-center">
        <div className="mb-1 md:mb-3">
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[3px] md:tracking-[5px] text-primary/40 group-hover:text-primary transition-colors">
            {product.category?.name || 'Curated Essential'}
          </span>
        </div>
        
        <Link to={`/product/${product._id}`} className="group/title">
          <h3 className="font-black text-sm md:text-xl text-[#0B1020] tracking-tighter mb-2 md:mb-4 line-clamp-1 group-hover/title:text-primary transition-colors duration-500">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-center mb-3 md:mb-6">
          <div className="flex items-center space-x-0.5 md:space-x-1">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={`text-[8px] md:text-xs ${i < Math.round(product.ratings) ? 'fill-current text-yellow-400' : 'text-gray-200'}`} />
            ))}
            <span className="text-[8px] md:text-[10px] font-bold text-gray-400 ml-1 md:ml-2">({product.numOfReviews})</span>
          </div>
        </div>

        <div className="mt-auto pt-2 md:pt-6 border-t border-gray-50 flex items-center justify-center space-x-2 md:space-x-4">
          <span className="text-base md:text-3xl font-black text-[#0B1020] tracking-tighter group-hover:scale-110 transition-transform duration-500">
            ${product.price}
          </span>
          {product.discountPrice > 0 && (
            <span className="text-[10px] md:text-sm text-gray-300 line-through font-bold tracking-tight">
              ${product.discountPrice}
            </span>
          )}
        </div>
      </div>

      {/* Glowing Border Animation */}
      <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 rounded-[50px] transition-all duration-700 pointer-events-none shadow-glow opacity-0 group-hover:opacity-100" />
    </motion.div>
  );
};

export default ProductCard;
