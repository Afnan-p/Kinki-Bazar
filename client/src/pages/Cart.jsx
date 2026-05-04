import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems: rawCartItems } = useSelector((state) => state.cart);
  const cartItems = rawCartItems || [];

  const updateQtyHandler = (item, qty) => {
    dispatch(addToCart({ ...item, qty: Number(qty) }));
  };

  const removeHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const subtotal = (cartItems || []).reduce((acc, item) => acc + (item.qty || 0) * (item.price || 0), 0).toFixed(2);
  const shipping = subtotal > 50 ? 0 : 10;
  const total = (Number(subtotal) + shipping).toFixed(2);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <FiShoppingBag className="text-5xl text-primary" />
          </div>
          <h2 className="text-3xl font-black mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-10">Looks like you haven't added anything to your cart yet. Explore our premium collection and find something you love!</p>
          <Link to="/shop" className="btn-primary inline-flex items-center space-x-2 px-10 h-14">
            <span>Start Shopping</span>
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <h1 className="text-4xl font-black mb-12">Shopping <span className="text-primary">Cart</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {(cartItems || []).map((item) => (
              <motion.div 
                key={item?.product}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8"
              >
                <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item?.image} alt={item?.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow text-center md:text-left">
                  <h3 className="font-bold text-lg mb-1 leading-tight">{item?.name}</h3>
                  <p className="text-primary font-black text-xl mb-4">${item?.price}</p>
                  
                  <div className="flex items-center justify-center md:justify-start space-x-4">
                    <div className="flex items-center bg-gray-50 rounded-xl p-1 h-10 w-32 justify-between">
                      <button 
                        onClick={() => updateQtyHandler(item, Math.max(1, (item?.qty || 1) - 1))}
                        className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:text-primary transition-colors shadow-sm"
                      >
                        <FiMinus />
                      </button>
                      <span className="text-sm font-black w-6 text-center">{item?.qty}</span>
                      <button 
                        onClick={() => updateQtyHandler(item, Math.min(item?.stock || 999, (item?.qty || 0) + 1))}
                        className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:text-primary transition-colors shadow-sm"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeHandler(item?.product)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                
                <div className="text-xl font-black text-accent hidden md:block">
                  ${((item?.qty || 0) * (item?.price || 0)).toFixed(2)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-premium border border-gray-50 sticky top-28">
            <h3 className="text-2xl font-black mb-8">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({(cartItems || []).reduce((acc, item) => acc + (item?.qty || 0), 0)} items)</span>
                <span className="font-bold text-accent">${subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-bold text-accent">
                  {shipping === 0 ? <span className="text-green-500 uppercase text-xs font-black">Free</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-gray-400 italic">Add ${(50 - Number(subtotal)).toFixed(2)} more for Free Shipping!</p>
              )}
            </div>
            
            <hr className="my-6 border-gray-100" />
            
            <div className="flex justify-between items-end mb-10">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-3xl font-black text-primary">${total}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary h-14 text-lg flex items-center justify-center space-x-3"
            >
              <span>Secure Checkout</span>
              <FiArrowRight />
            </button>
            
            <div className="mt-8 pt-8 border-t border-gray-50 text-center">
              <p className="text-xs text-gray-400 mb-4">We Accept</p>
              <div className="flex justify-center space-x-4 opacity-30 grayscale">
                <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6" alt="Visa" />
                <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6" alt="Mastercard" />
                <img src="https://img.icons8.com/color/48/000000/razorpay.png" className="h-6" alt="Razorpay" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
