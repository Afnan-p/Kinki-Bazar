import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats } from '../../redux/slices/adminSlice';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) return null;

  const data = Array.isArray(stats?.chartData) ? stats.chartData : [];

  const statsList = [
    { name: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <FiDollarSign />, color: 'bg-green-500', trend: '+12.5%' },
    { name: 'Total Orders', value: (stats?.ordersCount || 0).toLocaleString(), icon: <FiShoppingBag />, color: 'bg-primary', trend: '+8.2%' },
    { name: 'Total Users', value: (stats?.usersCount || 0).toLocaleString(), icon: <FiUsers />, color: 'bg-blue-500', trend: '+5.4%' },
    { name: 'Total Products', value: (stats?.productsCount || 0).toLocaleString(), icon: <FiTrendingUp />, color: 'bg-purple-500', trend: '+1.2%' },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statsList.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl mb-6 shadow-lg shadow-black/5`}>
              {stat.icon}
            </div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">{stat.name}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black">{stat.value}</h3>
              <span className="text-xs font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black mb-8">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E11D48" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black mb-8">Sales Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="sales" fill="#1E293B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black">Recent Orders</h3>
          <Link to="/admin/orders" className="text-primary font-bold text-sm hover:underline">View All Orders</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-gray-400">Order ID</th>
                <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-gray-400">Customer</th>
                <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-gray-400">Date</th>
                <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-gray-400">Amount</th>
                <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(Array.isArray(stats?.recentOrders) ? stats.recentOrders : []).map((order, i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 font-bold text-sm">#{order?._id?.slice(-6).toUpperCase() || 'N/A'}</td>
                  <td className="py-5 font-bold text-sm">{order?.user?.name || 'Guest'}</td>
                  <td className="py-5 text-sm text-gray-500">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-5 font-black text-sm">${order?.totalPrice?.toFixed(2) || '0.00'}</td>
                  <td className="py-5">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      order?.orderStatus === 'Delivered' ? 'text-green-500 bg-green-50' : 
                      order?.orderStatus === 'Processing' ? 'text-blue-500 bg-blue-50' : 
                      order?.orderStatus === 'Shipped' ? 'text-orange-500 bg-orange-50' : 
                      'text-red-500 bg-red-50'
                    }`}>
                      {order?.orderStatus || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
