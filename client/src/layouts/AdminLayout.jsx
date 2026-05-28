import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  FiPieChart, 
  FiBox, 
  FiLayers, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiBell,
  FiMenu,
  FiX,
  FiTag,
  FiMail
} from 'react-icons/fi';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FiPieChart />, path: '/admin' },
    { name: 'Products', icon: <FiBox />, path: '/admin/products' },
    { name: 'Categories', icon: <FiLayers />, path: '/admin/categories' },
    { name: 'Orders', icon: <FiShoppingBag />, path: '/admin/orders' },
    { name: 'Coupons', icon: <FiTag />, path: '/admin/coupons' },
    { name: 'Subscribers', icon: <FiMail />, path: '/admin/subscribers' },
    { name: 'Users', icon: <FiUsers />, path: '/admin/users' },
    { name: 'Site Settings', icon: <FiSettings />, path: '/admin/site-settings' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-accent text-white">
      <div className="p-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary text-white p-2 rounded-lg text-xs">
            <span className="font-display font-black italic">KB</span>
          </div>
          <span className="text-xl font-black tracking-tight">
            Kinki <span className="text-primary">Admin</span>
          </span>
        </Link>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-2xl text-gray-400 hover:text-white">
          <FiX />
        </button>
      </div>

      <nav className="flex-grow px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <Link 
            key={item.name}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center space-x-3 p-4 rounded-xl transition-all ${
              location.pathname === item.path ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-bold text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-8 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors w-full"
        >
          <FiLogOut />
          <span className="font-bold">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-80 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-full overflow-hidden">
        <header className="bg-white h-20 flex items-center justify-between px-6 md:px-10 border-b border-gray-100 sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-gray-50 rounded-xl text-accent hover:text-primary transition-all"
            >
              <FiMenu className="text-2xl" />
            </button>
            <h2 className="text-xl font-black text-accent capitalize hidden sm:block">
              {location.pathname.split('/').pop() || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            <button className="p-2.5 bg-gray-50 rounded-full text-gray-400 hover:text-primary transition-colors relative">
              <FiBell />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{userInfo?.name || 'Admin'}</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Master Admin</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-inner">
                {userInfo?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-grow overflow-y-auto p-6 md:p-10 scrollbar-thin">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

