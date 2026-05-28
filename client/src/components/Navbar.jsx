import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiHeart, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiChevronDown,
  FiLogOut,
  FiLayout,
  FiPackage,
  FiArrowRight,
  FiAward,
  FiUserCheck
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { logout, getWishlist } from '../redux/slices/authSlice';
import { listProducts } from '../redux/slices/productSlice';
import debounce from 'lodash/debounce';
import Logo from './Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { userInfo, wishlist } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const searchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (userInfo) {
      dispatch(getWishlist());
    }
  }, [dispatch, userInfo]);

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        navigate(`/shop?keyword=${query}`);
        dispatch(listProducts({ keyword: query }));
      }
    }, 500),
    [navigate, dispatch]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsProfileOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Our Story', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHomePage = location.pathname === '/';
  const shouldBeTransparent = isHomePage && !isScrolled;

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'py-2 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.1)]' 
            : 'py-4 md:py-6'
        }`}
        style={{
          background: shouldBeTransparent ? 'transparent' : 'white',
          backdropFilter: shouldBeTransparent ? 'none' : 'blur(20px)',
          borderBottom: shouldBeTransparent ? 'none' : '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <div className="max-w-[1400px] mx-auto px-[clamp(1rem,4vw,3rem)] flex items-center justify-between">
          
          {/* Mobile Menu Trigger - Visible until xl screens to avoid crowding */}
          <button 
            className={`xl:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500 ${
              shouldBeTransparent ? 'bg-white/5 text-white' : 'bg-gray-100 text-[#071120]'
            }`}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FiMenu className="text-lg" />
          </button>

          {/* Luxury Logo */}
          <Link to="/" className="group flex flex-col items-center">
            <Logo iconSize="w-9 h-9" isTransparent={shouldBeTransparent} />
            <motion.span 
              initial={false}
              animate={{ opacity: shouldBeTransparent ? 0.35 : 0, y: shouldBeTransparent ? 0 : -2 }}
              className={`text-[6px] font-black uppercase tracking-[2px] mt-1 hidden md:block ${
                shouldBeTransparent ? 'text-white/40' : 'text-[#071120]/40'
              }`}
            >
              Elite Home Essentials
            </motion.span>
          </Link>

          {/* Centered Desktop Navigation - Only visible on xl screens (1280px+) */}
          <div className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`relative text-[8.5px] font-black uppercase tracking-[2px] transition-all duration-500 py-1 group ${
                    isActive || (link.path !== '/' && location.pathname.startsWith(link.path))
                      ? 'text-primary' 
                      : shouldBeTransparent ? 'text-white' : 'text-[#071120]'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-primary transition-all duration-700 ease-out ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Compact Search */}
            <div className="relative" ref={searchRef}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-lg transition-all duration-500 group ${
                  shouldBeTransparent ? 'text-white hover:bg-white/5' : 'text-[#071120] hover:bg-gray-100'
                }`}
              >
                <FiSearch className="text-lg group-hover:scale-110 transition-transform" />
              </button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-[300px] bg-white rounded-[20px] shadow-[0_25px_70px_-20px_rgba(0,0,0,0.15)] p-2 border border-gray-50 flex items-center z-50 overflow-hidden"
                  >
                    <FiSearch className="text-primary ml-3 text-lg" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search collection..." 
                      className="w-full bg-transparent py-2.5 px-3 focus:outline-none text-sm font-bold text-[#071120] placeholder:text-gray-300"
                      autoFocus
                    />
                    <button onClick={() => setIsSearchOpen(false)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors mr-1">
                      <FiX />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link 
              to="/wishlist" 
              className={`hidden sm:flex p-2 rounded-lg transition-all duration-500 group relative ${
                shouldBeTransparent ? 'text-white hover:bg-white/5' : 'text-[#071120] hover:bg-gray-100'
              }`}
            >
              <FiHeart className="text-lg group-hover:scale-110 transition-transform" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(225,29,72,0.6)]"></span>
              )}
            </Link>

            <Link 
              to="/cart" 
              className={`p-2 rounded-lg transition-all duration-500 group relative ${
                shouldBeTransparent ? 'text-white hover:bg-white/5' : 'text-[#071120] hover:bg-gray-100'
              }`}
            >
              <FiShoppingCart className="text-lg group-hover:scale-110 transition-transform" />
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[6.5px] w-4 h-4 flex items-center justify-center rounded-full font-black shadow-lg border border-white">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative ml-0.5" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center p-0.5 rounded-full transition-all duration-500 border ${
                  shouldBeTransparent ? 'border-white/10 hover:border-white/30' : 'border-gray-100 hover:border-primary/20'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-black text-[9px] overflow-hidden shadow-lg">
                  {userInfo?.profileImage ? (
                    <img src={userInfo.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    userInfo ? userInfo.name.charAt(0).toUpperCase() : <FiUser />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-60 bg-white rounded-[20px] shadow-[0_25px_70px_-20px_rgba(0,0,0,0.15)] p-2.5 border border-gray-50 overflow-hidden"
                  >
                    {userInfo ? (
                      <div className="space-y-0.5">
                        <div className="p-3.5 mb-1.5 bg-[#071120] rounded-[16px] text-white">
                          <p className="text-[6.5px] uppercase font-black text-primary tracking-[2px] mb-1">Elite</p>
                          <p className="font-black truncate text-sm leading-tight">{userInfo.name}</p>
                          <p className="text-[9px] text-white/30 truncate">{userInfo.email}</p>
                        </div>
                        <Link to="/profile" className="flex items-center space-x-2.5 px-3.5 py-2 hover:bg-gray-50 rounded-lg transition-all font-black text-[8px] uppercase tracking-widest text-gray-500 hover:text-primary">
                          <FiUser />
                          <span>Settings</span>
                        </Link>
                        <Link to="/profile#orders" className="flex items-center space-x-2.5 px-3.5 py-2 hover:bg-gray-50 rounded-lg transition-all font-black text-[8px] uppercase tracking-widest text-gray-500 hover:text-primary">
                          <FiPackage />
                          <span>Orders</span>
                        </Link>
                        {userInfo.role === 'admin' && (
                          <Link to="/admin" className="flex items-center space-x-2.5 px-3.5 py-2 bg-primary text-white rounded-lg transition-all font-black text-[8px] uppercase tracking-widest mt-1 shadow-md">
                            <FiLayout />
                            <span>Dashboard</span>
                          </Link>
                        )}
                        <hr className="my-1.5 border-gray-50" />
                        <button onClick={handleLogout} className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-red-50 text-red-500 rounded-lg transition-all font-black text-[8px] uppercase tracking-widest">
                          <FiLogOut />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-1 space-y-1.5">
                        <Link to="/login" className="flex items-center justify-center w-full h-11 bg-gray-50 rounded-lg font-black text-[8.5px] uppercase tracking-[2px] hover:bg-gray-100 transition-all">
                          Sign In
                        </Link>
                        <Link to="/register" className="flex items-center justify-center w-full h-11 bg-primary text-white rounded-lg font-black text-[8.5px] uppercase tracking-[2px] shadow-md hover:scale-[1.02] transition-all">
                          Join Elite
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </nav>

      {/* LUXURY FULLSCREEN MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[200]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#071120]/95 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 35, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[#071120] border-r border-white/5 flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-5 flex items-center justify-between border-b border-white/5 relative z-10">
                <div className="flex flex-col">
                  <Logo iconSize="w-9 h-9" isTransparent={true} />
                  <span className="text-[6px] font-black uppercase tracking-[2px] text-white/30 mt-2">Elite Home Essentials</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-lg text-white hover:bg-primary transition-all"
                >
                  <FiX />
                </button>
              </div>

              <div className="flex-grow p-7 space-y-6 overflow-y-auto relative z-10">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                    >
                      <Link 
                        to={link.path} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className={`group flex items-center justify-between py-1 ${isActive ? 'text-primary' : 'text-white'}`}
                      >
                        <div className="flex flex-col">
                          <span className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors">{link.name}</span>
                          <span className="text-[6.5px] font-bold uppercase tracking-[2px] text-white/20 mt-0.5">View Collection</span>
                        </div>
                        <FiArrowRight className={`text-lg transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-6 border-t border-white/5 bg-white/5 relative z-10">
                {!userInfo ? (
                  <div className="space-y-3">
                    <p className="text-[7px] font-black uppercase tracking-[2px] text-white/40 mb-4 text-center">Exclusive Member Access</p>
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="h-12 bg-primary text-white rounded-lg flex items-center justify-center text-[8.5px] font-black uppercase tracking-[2px] shadow-lg w-full"
                    >
                      Sign In / Join Elite
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3.5 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center text-base font-black shadow-lg">
                        {userInfo.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-black text-white tracking-tighter truncate">{userInfo.name}</p>
                        <p className="text-[6.5px] font-bold text-primary uppercase tracking-[2px]">Elite Member</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="h-10 bg-white/10 rounded-lg flex items-center justify-center font-black text-[7.5px] uppercase tracking-[1.5px] text-white border border-white/10">
                        Account
                      </Link>
                      <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="h-10 bg-red-500/10 text-red-500 rounded-lg font-black text-[7.5px] uppercase tracking-[1.5px] border border-red-500/20">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
