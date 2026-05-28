import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye, FiStar } from 'react-icons/fi';
import Rating from './Rating';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    const directBuyItem = {
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || '',
      price: product.price,
      qty: 1,
      stock: product.stock
    };
    navigate('/checkout', { state: { directBuyItem } });
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
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-100 flex flex-col h-full"
    >
      {/* 1. IMAGE AREA */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link to={`/product/${product._id}`} className="block h-full w-full">
          <motion.img 
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            src={product.images?.[0]?.url || 'https://via.placeholder.com/600x800'} 
            alt={product.name}
            className="w-full h-full object-cover will-change-transform"
          />
        </Link>

        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Wishlist Button (Premium Style) */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={toggleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm backdrop-blur-md ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <FiHeart className={`text-lg ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isNewArrival && (
            <span className="bg-white/90 backdrop-blur-sm text-accent text-[9px] font-black uppercase tracking-[2px] px-3 py-1.5 rounded-sm shadow-sm">
              New Arrival
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-primary/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-[2px] px-3 py-1.5 rounded-sm shadow-sm">
              Best Seller
            </span>
          )}
        </div>

      </div>

      {/* 3. PRODUCT INFO */}
      <div className="p-6 flex flex-col flex-grow text-left">
        <div className="mb-2 flex justify-between items-start">
          <span className="text-[9px] font-black uppercase tracking-[3px] text-gray-400">
            {product.category?.name || 'Curated Essential'}
          </span>
          <div className="flex items-center space-x-1">
            <FiStar className="text-[10px] fill-current text-yellow-400" />
            <span className="text-[10px] font-bold text-gray-600">{product.ratings ? product.ratings.toFixed(1) : '5.0'}</span>
          </div>
        </div>
        
        <Link to={`/product/${product._id}`} className="group/title">
          <h3 className="font-bold text-lg text-[#0B1020] leading-tight mb-2 line-clamp-1 group-hover/title:text-primary transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center space-x-3 mb-6">
          <span className="text-xl font-black text-[#0B1020]">
            ${product.price}
          </span>
          {product.discountPrice > 0 && (
            <span className="text-xs text-gray-400 line-through font-medium">
              ${product.discountPrice}
            </span>
          )}
        </div>

        <div className="mt-auto grid grid-cols-5 gap-3 pt-4 border-t border-gray-100">
          <button 
            onClick={handleAddToCart}
            className="col-span-1 h-11 rounded-lg border border-gray-200 text-gray-600 flex items-center justify-center hover:border-[#0B1020] hover:text-[#0B1020] transition-colors duration-300"
            title="Add to Cart"
          >
            <FiShoppingCart className="text-lg" />
          </button>
          
          <button 
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="col-span-4 h-11 rounded-lg bg-[#0B1020] text-white flex items-center justify-center font-bold text-[10px] uppercase tracking-[2px] hover:bg-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
