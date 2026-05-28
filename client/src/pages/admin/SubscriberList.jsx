import React, { useState, useEffect } from 'react';
import { FiMail, FiTrash2, FiLoader } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/subscribers');
      setSubscribers(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch subscribers');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      try {
        await api.delete(`/subscribers/${id}`);
        toast.success('Subscriber removed');
        fetchSubscribers();
      } catch (error) {
        toast.error('Failed to remove subscriber');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tighter">Subscribers</h2>
        <p className="text-gray-500 font-medium">Manage your newsletter subscribers ({subscribers.length}).</p>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Email Address</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Date Subscribed</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-10 text-center">
                    <FiLoader className="animate-spin text-3xl text-primary mx-auto" />
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-gray-400 font-bold">
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      <div className="inline-flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <FiMail />
                        </div>
                        <span className="font-bold text-accent">{sub.email}</span>
                      </div>
                    </td>
                    <td className="p-6 font-medium text-gray-500">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleDelete(sub._id)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors ml-auto"
                        title="Remove Subscriber"
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

export default SubscriberList;
