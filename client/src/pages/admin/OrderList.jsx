import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiTruck, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-500';
      case 'Processing': return 'bg-blue-50 text-blue-500';
      case 'Shipped': return 'bg-orange-50 text-orange-500';
      case 'Cancelled': return 'bg-red-50 text-red-500';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  const filteredOrders = (orders || []).filter(order => 
    order?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400 font-bold">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Order ID</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Customer</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Date</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Total</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Status</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Payment</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(Array.isArray(filteredOrders) ? filteredOrders : []).map((order) => (
                  <tr key={order?._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-6 font-bold text-sm">#{order?._id?.slice(-6).toUpperCase() || 'N/A'}</td>
                    <td className="p-6">
                      <div className="font-bold text-sm">{order?.user?.name || 'Guest'}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{order?.user?.email || ''}</div>
                    </td>
                    <td className="p-6 text-sm text-gray-500">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-6 font-black text-sm">${order?.totalPrice?.toFixed(2) || '0.00'}</td>
                    <td className="p-6">
                      <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${getStatusStyle(order?.orderStatus)}`}>
                        {order?.orderStatus || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-1.5">
                        <div className={`w-2 h-2 rounded-full ${order?.isPaid ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <span className="text-xs font-bold text-gray-600">{order?.isPaid ? 'Paid' : 'Pending'}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <Link to={`/order/${order?._id}`} className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center">
                        <FiEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
