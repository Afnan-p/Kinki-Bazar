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
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[32px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100/50">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50/50 border border-transparent rounded-[20px] py-4 pl-14 pr-4 focus:outline-none focus:bg-white focus:border-primary/20 transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100/50 overflow-hidden p-4 md:p-8">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading ledger...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-32 bg-gray-50/30 rounded-[32px] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <FiSearch className="text-3xl text-gray-300" />
            </div>
            <h4 className="text-2xl font-black text-[#0B1020] tracking-tighter mb-2">No Orders Found</h4>
            <p className="text-sm font-medium text-gray-400 max-w-sm">We couldn't find any orders matching your current search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-6 font-black uppercase text-[9px] tracking-[3px] text-gray-400">Order ID</th>
                  <th className="pb-6 font-black uppercase text-[9px] tracking-[3px] text-gray-400">Customer</th>
                  <th className="pb-6 font-black uppercase text-[9px] tracking-[3px] text-gray-400">Date</th>
                  <th className="pb-6 font-black uppercase text-[9px] tracking-[3px] text-gray-400">Total</th>
                  <th className="pb-6 font-black uppercase text-[9px] tracking-[3px] text-gray-400">Status</th>
                  <th className="pb-6 font-black uppercase text-[9px] tracking-[3px] text-gray-400">Payment</th>
                  <th className="pb-6 font-black uppercase text-[9px] tracking-[3px] text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <tr key={order?._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-6 pr-4 font-bold text-sm text-[#0B1020]">#{order?._id?.slice(-6).toUpperCase() || 'N/A'}</td>
                    <td className="py-6 pr-4">
                      <div className="font-bold text-sm text-gray-600">{order?.user?.name || 'Guest'}</div>
                      <div className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{order?.user?.email || ''}</div>
                    </td>
                    <td className="py-6 pr-4 text-sm text-gray-400 font-medium">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-6 pr-4 font-black text-sm text-[#0B1020]">${order?.totalPrice?.toFixed(2) || '0.00'}</td>
                    <td className="py-6 pr-4">
                      <span className={`text-[9px] font-black uppercase tracking-[2px] px-3 py-1.5 rounded-full ${getStatusStyle(order?.orderStatus)}`}>
                        {order?.orderStatus || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-6 pr-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${order?.isPaid ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-[2px] text-gray-500">{order?.isPaid ? 'Paid' : 'Pending'}</span>
                      </div>
                    </td>
                    <td className="py-6">
                      <Link to={`/order/${order?._id}`} className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:text-[#0B1020] hover:bg-gray-100 transition-all flex items-center justify-center shadow-sm">
                        <FiEye className="text-lg" />
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
