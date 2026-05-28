import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiTrash2, 
  FiShoppingCart, 
  FiArrowRight, 
  FiShoppingBag, 
  FiLoader 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { addToCart } from '../redux/slices/cartSlice';
import { getWishlist, removeFromWishlist } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import Rating from '../components/Rating';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist, userInfo, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(getWishlist());
    }
  }, [dispatch, userInfo, navigate]);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      product: item._id,
      name: item.name,
      image: item.images?.[0]?.url || '',
      price: item.price,
      qty: 1,
      stock: item.stock
    }));
    toast.success('Added to cart!');
  };

  if (loading && wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <FiLoader className="text-4xl text-primary animate-spin" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-40 h-40 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-10 text-primary">
            <FiHeart className="text-6xl" />
          </div>
          <h2 className="text-4xl font-black text-accent mb-6 tracking-tighter">Your Wishlist is Empty</h2>
          <p className="text-gray-400 mb-12 font-medium leading-relaxed">Save your favorite items here to keep an eye on them! Start exploring our collection today.</p>
          <Link to="/shop" className="btn-primary inline-flex items-center space-x-3 px-12 h-16">
            <span>Discover Products</span>
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-32">
      <div className="bg-gray-50 pt-32 pb-20 mb-20">
        <div className="container mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black text-accent tracking-tighter"
          >
            My <span className="text-primary italic">Wishlist</span>
          </motion.h1>
          <p className="text-gray-400 mt-4 font-medium">You have {wishlist.length} premium items saved.</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          <AnimatePresence mode="popLayout">
            {wishlist.map((item) => (
              <motion.div 
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group card-premium flex flex-col"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={item.images?.[0]?.url || 'https://via.placeholder.com/400x500'} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <button 
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-red-500 shadow-xl hover:bg-red-500 hover:text-white transition-all duration-500"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="badge-premium">{item.category?.name || 'Category'}</span>
                    <Rating value={item.ratings} size="text-[10px]" />
                  </div>
                  <h3 className="font-black text-xl text-accent mb-6 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-3xl font-black text-primary">${item.price}</span>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="w-14 h-14 bg-accent text-white rounded-2xl flex items-center justify-center hover:bg-primary transition-all duration-500 shadow-lg shadow-accent/20 hover:shadow-primary/30"
                    >
                      <FiShoppingCart className="text-xl" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;


