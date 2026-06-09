import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiArrowRight, FiDownload } from 'react-icons/fi';
import api from '../utils/api';
import toast from 'react-hot-toast';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        toast.error('Order details not found');
        navigate('/shop');
      }
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!order) return null;

  return (
    <div className="bg-[#071120] min-h-screen pt-32 pb-20 relative overflow-hidden flex items-center justify-center font-['Outfit']">
      {/* Cinematic Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          {/* Success Receipt Card */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl relative">
            
            {/* Top Zig-Zag or Perforated edge effect using CSS gradients (optional, we use clean cut here) */}
            <div className="p-10 md:p-16 text-center border-b-2 border-dashed border-gray-200 relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative"
              >
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
                <FiCheckCircle className="text-5xl text-green-500" />
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-black text-[#0B1020] tracking-tighter mb-4 italic">
                Order <span className="text-primary">Confirmed</span>
              </h1>
              <p className="text-gray-500 text-lg">
                Thank you for your purchase. Your luxury items are being prepared for dispatch.
              </p>
            </div>

            <div className="p-10 md:p-16 bg-[#f8f9fa]">
              <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-200">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Order Number</p>
                  <p className="font-bold text-lg text-[#0B1020]">#{order._id.slice(-6).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total Paid</p>
                  <p className="font-black text-2xl text-primary">${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-6 mb-12">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-[#0B1020] truncate">{item.name}</p>
                      <p className="text-sm text-gray-400">Qty: {item.qty}</p>
                    </div>
                    <div className="font-black text-[#0B1020]">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/order/${order._id}`} className="btn-primary h-16 flex-1 text-center justify-center font-black uppercase tracking-widest">
                  View Order Status
                </Link>
                <Link to="/shop" className="btn-secondary h-16 flex-1 text-center justify-center font-black uppercase tracking-widest">
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Bottom perforation visual */}
            <div className="h-4 w-full bg-[radial-gradient(circle,transparent_4px,#f8f9fa_5px)] bg-[length:16px_16px] -mt-2 opacity-50 relative z-10 rotate-180" />

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
