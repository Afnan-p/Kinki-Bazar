import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [is2FAStep, setIs2FAStep] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.search.includes('expired=true')) {
      toast.error('Session expired. Please login again.');
      // Clear the query param to prevent multiple toasts
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const { userInfo, loading, error } = useSelector((state) => state.auth);
  const { data: settingsData } = useSelector((state) => state.settings);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.requires2FA) {
        setIs2FAStep(true);
      } else {
        if (userInfo.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [userInfo, error, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password, code }));
  };

  const isRegistrationEnabled = settingsData?.platform?.registrationStatus !== false;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-premium p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo iconSize="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-black mb-2">Welcome Back</h2>
          <p className="text-gray-500">Enter your details to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-gray-700">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-primary font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {is2FAStep && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Authentication Code</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  maxLength="6"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all tracking-widest font-black text-lg"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Open your Authenticator app to get the code.</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4 text-lg mt-4 flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Sign In</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          {isRegistrationEnabled ? (
            <p className="text-gray-500">
              Don't have an account? {' '}
              <Link to="/register" className="text-primary font-black hover:underline">Create Account</Link>
            </p>
          ) : (
            <p className="text-gray-400 text-sm">
              New account creation is currently disabled.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;


