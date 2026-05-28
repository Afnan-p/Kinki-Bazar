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
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-[#0B1020] tracking-tighter">Command Center</h2>
          <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Platform Overview & Analytics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100/50 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />
            <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl mb-6 shadow-xl shadow-black/5`}>
              {stat.icon}
            </div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[3px] mb-2">{stat.name}</p>
            <div className="flex items-end justify-between relative z-10">
              <h3 className="text-4xl font-black text-[#0B1020] tracking-tighter">{stat.value}</h3>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-gray-50 text-gray-500`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100/50">
          <h3 className="text-xl font-black mb-8 tracking-tight text-[#0B1020]">Revenue Overview</h3>
          <div className="h-80 relative">
            {data.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <FiDollarSign className="text-4xl text-gray-300 mb-4" />
                <h4 className="font-bold text-gray-500">No Revenue Data</h4>
                <p className="text-xs text-gray-400 font-medium mt-1">Waiting for the first transaction.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B1020" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0B1020" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#0B1020" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100/50">
          <h3 className="text-xl font-black mb-8 tracking-tight text-[#0B1020]">Sales Comparison</h3>
          <div className="h-80 relative">
            {data.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <FiShoppingBag className="text-4xl text-gray-300 mb-4" />
                <h4 className="font-bold text-gray-500">No Sales Data</h4>
                <p className="text-xs text-gray-400 font-medium mt-1">Awaiting your first order.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                  <Bar dataKey="sales" fill="#0B1020" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-10 rounded-[40px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100/50">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black tracking-tight text-[#0B1020]">Recent Orders</h3>
          <Link to="/admin/orders" className="bg-gray-50 hover:bg-gray-100 text-[#0B1020] font-black text-[9px] uppercase tracking-[3px] px-6 py-3 rounded-xl transition-colors">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          {(!stats?.recentOrders || stats.recentOrders.length === 0) ? (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <FiShoppingBag className="text-2xl text-gray-300" />
              </div>
              <h4 className="font-black text-gray-500 mb-2">No Recent Orders</h4>
              <p className="text-sm font-medium text-gray-400">Your store is awaiting its first customer.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 font-black uppercase text-[9px] tracking-[3px] text-gray-400">Order ID</th>
                  <th className="pb-4 font-black uppercase text-[9px] tracking-[3px] text-gray-400">Customer</th>
                  <th className="pb-4 font-black uppercase text-[9px] tracking-[3px] text-gray-400">Date</th>
                  <th className="pb-4 font-black uppercase text-[9px] tracking-[3px] text-gray-400">Amount</th>
                  <th className="pb-4 font-black uppercase text-[9px] tracking-[3px] text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map((order, i) => (
                  <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 font-bold text-sm text-[#0B1020]">#{order?._id?.slice(-6).toUpperCase() || 'N/A'}</td>
                    <td className="py-5 font-bold text-sm text-gray-600">{order?.user?.name || 'Guest'}</td>
                    <td className="py-5 text-sm text-gray-400 font-medium">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-5 font-black text-sm text-[#0B1020]">${order?.totalPrice?.toFixed(2) || '0.00'}</td>
                    <td className="py-5">
                      <span className={`text-[9px] font-black uppercase tracking-[2px] px-3 py-1.5 rounded-full ${
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
