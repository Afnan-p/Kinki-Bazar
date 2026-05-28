import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTag, FiPlus, FiTrash2, FiLoader, FiCheck, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    minPurchase: 0,
    expiryDate: ''
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/coupons');
      setCoupons(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch coupons');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountPercentage || !formData.expiryDate) {
      return toast.error('Please fill all required fields');
    }

    try {
      setFormLoading(true);
      await api.post('/coupons', {
        ...formData,
        discountType: 'Percentage',
        discountValue: Number(formData.discountPercentage),
      });
      toast.success('Coupon created successfully');
      setShowAddForm(false);
      setFormData({ code: '', discountPercentage: '', minPurchase: 0, expiryDate: '' });
      fetchCoupons();
      setFormLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await api.delete(`/coupons/${id}`);
        toast.success('Coupon deleted');
        fetchCoupons();
      } catch (error) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.put(`/coupons/${id}/toggle`);
      toast.success('Coupon status updated');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Coupons & Promos</h2>
          <p className="text-gray-500 font-medium">Manage discount codes and promotional offers.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary py-3 px-6 text-sm flex items-center space-x-2"
        >
          {showAddForm ? <FiX /> : <FiPlus />}
          <span>{showAddForm ? 'Cancel' : 'Create Coupon'}</span>
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-6">New Promo Code</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Coupon Code</label>
                <input 
                  type="text" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="input-premium mt-2 uppercase" 
                  placeholder="e.g. SUMMER50"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Discount (%)</label>
                <input 
                  type="number" 
                  min="1" max="100"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                  className="input-premium mt-2" 
                  placeholder="e.g. 20"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Min Purchase ($)</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
                  className="input-premium mt-2" 
                  placeholder="e.g. 100"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Expiry Date</label>
                <input 
                  type="date" 
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  className="input-premium mt-2" 
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={formLoading}
              className="btn-primary h-14 w-full md:w-auto md:px-12 flex justify-center items-center"
            >
              {formLoading ? <FiLoader className="animate-spin" /> : 'Save Coupon'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Code</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Discount</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Min Purchase</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Expiry</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center">
                    <FiLoader className="animate-spin text-3xl text-primary mx-auto" />
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400 font-bold">
                    No coupons found. Create one above!
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-lg">
                        <FiTag />
                        <span className="font-black tracking-widest uppercase">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="p-6 font-bold text-accent">
                      {coupon.discountValue}%
                    </td>
                    <td className="p-6 font-medium text-gray-500">
                      ${coupon.minPurchase}
                    </td>
                    <td className="p-6 font-medium text-gray-500">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <button 
                        onClick={() => handleToggle(coupon._id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[2px] transition-colors ${
                          coupon.isActive ? 'bg-green-50 text-green-500 hover:bg-green-100' : 'bg-red-50 text-red-500 hover:bg-red-100'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleDelete(coupon._id)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors ml-auto"
                        title="Delete Coupon"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponList;


