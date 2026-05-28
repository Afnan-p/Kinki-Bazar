import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiPackage, 
  FiHeart, 
  FiLogOut, 
  FiEdit2, 
  FiCheck, 
  FiCamera, 
  FiUploadCloud, 
  FiX, 
  FiLoader,
  FiArrowRight
} from 'react-icons/fi';
import { logout, updateProfile } from '../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Profile = () => {
  const { userInfo, loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(userInfo?.profileImage || null);
  
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phoneNumber: userInfo?.phoneNumber || '',
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: '', isDefault: false
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Sync state when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phoneNumber: userInfo.phoneNumber || '',
      });
      setPreview(userInfo.profileImage || null);
      
      // Fetch orders
      api.get('/orders/myorders').then(res => {
        setOrders(res.data);
        setLoadingOrders(false);
      }).catch(err => {
        console.error(err);
        setLoadingOrders(false);
      });
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    // Show temporary preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    toast.success('Image selected! Click Save to upload.');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Create FormData for atomic update
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phoneNumber', formData.phoneNumber);
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await dispatch(updateProfile(data)).unwrap();
      setIsEditing(false);
      setImageFile(null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const updatedAddresses = [...(userInfo.addresses || []), addressForm];
      
      const data = new FormData();
      data.append('addresses', JSON.stringify(updatedAddresses));

      await dispatch(updateProfile(data)).unwrap();
      setShowAddressForm(false);
      setAddressForm({ fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: '', isDefault: false });
      toast.success('Address added successfully!');
    } catch (error) {
      toast.error(error || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const updatedAddresses = userInfo.addresses.filter((_, i) => i !== index);
      const data = new FormData();
      data.append('addresses', JSON.stringify(updatedAddresses));
      await dispatch(updateProfile(data)).unwrap();
      toast.success('Address removed');
    } catch (error) {
      toast.error('Failed to remove address');
    }
  };

  const handleSetDefaultAddress = async (index) => {
    try {
      const updatedAddresses = userInfo.addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index
      }));
      const data = new FormData();
      data.append('addresses', JSON.stringify(updatedAddresses));
      await dispatch(updateProfile(data)).unwrap();
      toast.success('Default address updated');
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  const stats = [
    { label: 'Orders', value: orders.length.toString(), icon: <FiPackage />, color: 'text-blue-500 bg-blue-50', link: '#orders' },
    { label: 'Wishlist', value: userInfo?.wishlist?.length || '0', icon: <FiHeart />, color: 'text-red-500 bg-red-50', link: '/wishlist' },
    { label: 'Addresses', value: userInfo?.addresses?.length || '0', icon: <FiMapPin />, color: 'text-emerald-500 bg-emerald-50', link: '#addresses' },
  ];

  return (
    <div className="bg-white min-h-screen pb-32">
      <div className="bg-accent pt-40 pb-48 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            Account <span className="text-primary italic">Settings</span>
          </motion.h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-10 -mt-32 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Avatar & Quick Actions */}
            <div className="lg:col-span-4 space-y-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 rounded-2xl shadow-premium border border-gray-50 text-center"
              >
                <div className="relative inline-block mb-8 group">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-gray-50 shadow-inner-premium relative">
                    {authLoading && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                        <FiLoader className="text-white text-3xl animate-spin" />
                      </div>
                    )}
                    {preview ? (
                      <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-6xl font-black">
                        {userInfo?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform active:scale-95 z-20"
                  >
                    <FiCamera className="text-xl" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </div>

                <h2 className="text-3xl font-black text-accent tracking-tighter mb-2">{userInfo?.name}</h2>
                <p className="text-gray-400 font-medium mb-10">{userInfo?.email}</p>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`w-full flex items-center justify-center space-x-3 py-4 rounded-2xl font-black transition-all ${
                      isEditing ? 'bg-accent text-white' : 'bg-gray-50 text-accent hover:bg-gray-100'
                    }`}
                  >
                    <FiEdit2 />
                    <span>{isEditing ? 'Discard Changes' : 'Edit Profile'}</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-3 py-4 bg-red-50 text-red-500 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all group"
                  >
                    <FiLogOut className="group-hover:-translate-x-1 transition-transform" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-4">
                {stats.map((stat, i) => {
                  const content = (
                    <>
                      <div className="flex items-center space-x-4">
                        <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:rotate-12`}>
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                          <h4 className="text-2xl font-black text-accent">{stat.value}</h4>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 opacity-0 group-hover:opacity-100 transition-all">
                        <FiCheck />
                      </div>
                    </>
                  );

                  return stat.link.startsWith('#') ? (
                    <a 
                      key={i} 
                      href={stat.link}
                      onClick={(e) => {
                        e.preventDefault();
                        document.querySelector(stat.link)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-white p-6 rounded-xl border border-gray-50 flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer"
                    >
                      {content}
                    </a>
                  ) : (
                    <Link 
                      key={i} 
                      to={stat.link}
                      className="bg-white p-6 rounded-xl border border-gray-50 flex items-center justify-between group hover:shadow-xl transition-all"
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Form & History */}
            <div className="lg:col-span-8 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-12 rounded-2xl shadow-premium border border-gray-50"
              >
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-2xl font-black tracking-tighter flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <FiUser />
                    </div>
                    <span>Account Details</span>
                  </h3>
                  {isEditing && (
                    <span className="badge-premium animate-pulse">Editing Mode</span>
                  )}
                </div>

                <form onSubmit={handleUpdate} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Full Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className={`input-premium pl-16 ${!isEditing && 'opacity-60 cursor-not-allowed bg-gray-50/50'}`}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Email Address</label>
                      <div className="relative">
                        <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                        <input 
                          type="email" 
                          disabled={true}
                          value={formData.email}
                          className="input-premium pl-16 opacity-40 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        placeholder="+1 234 567 890"
                        className={`input-premium pl-16 ${!isEditing && 'opacity-60 cursor-not-allowed bg-gray-50/50'}`}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isEditing && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-8"
                      >
                        <button 
                          type="submit" 
                          disabled={authLoading}
                          className="btn-primary w-full h-16 text-lg"
                        >
                          {authLoading ? (
                            <FiLoader className="animate-spin text-2xl" />
                          ) : (
                            <>
                              <FiCheck className="text-2xl" />
                              <span>Save Profile Changes</span>
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>

              <div id="addresses" className="bg-white p-12 rounded-2xl shadow-premium border border-gray-50">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                      <FiMapPin />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter">My Addresses</h3>
                  </div>
                  <button 
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="btn-primary py-3 px-6 text-sm"
                  >
                    {showAddressForm ? 'Cancel' : 'Add New Address'}
                  </button>
                </div>

                <AnimatePresence>
                  {showAddressForm && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddAddress}
                      className="bg-gray-50 p-8 rounded-xl mb-10 space-y-6 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Full Name</label>
                          <input type="text" required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} className="input-premium bg-white mt-2" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Phone</label>
                          <input type="text" required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="input-premium bg-white mt-2" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Street Address</label>
                        <input type="text" required value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="input-premium bg-white mt-2" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">City</label>
                          <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="input-premium bg-white mt-2" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">State</label>
                          <input type="text" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="input-premium bg-white mt-2" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Postal Code</label>
                          <input type="text" required value={addressForm.postalCode} onChange={e => setAddressForm({...addressForm, postalCode: e.target.value})} className="input-premium bg-white mt-2" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 ml-4">Country</label>
                        <input type="text" required value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} className="input-premium bg-white mt-2" />
                      </div>
                      <div className="flex items-center space-x-3 ml-2">
                        <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                        <label htmlFor="isDefault" className="font-bold text-gray-500">Set as default address</label>
                      </div>
                      <button type="submit" className="btn-primary w-full h-14 mt-4">Save Address</button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  {!userInfo?.addresses?.length ? (
                    <div className="text-center py-10 text-gray-400 font-medium">No addresses saved yet.</div>
                  ) : (
                    userInfo.addresses.map((addr, index) => (
                      <div key={index} className={`p-6 rounded-xl border-2 transition-all ${addr.isDefault ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-black text-lg text-accent">{addr.fullName}</h4>
                              {addr.isDefault && <span className="bg-primary text-white text-[9px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full">Default</span>}
                            </div>
                            <p className="text-gray-500 font-medium">{addr.street}, {addr.city}</p>
                            <p className="text-gray-500 font-medium">{addr.state}, {addr.postalCode}, {addr.country}</p>
                            <p className="text-gray-400 text-sm mt-2 font-bold flex items-center"><FiPhone className="mr-2" /> {addr.phone}</p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            {!addr.isDefault && (
                              <button onClick={() => handleSetDefaultAddress(index)} className="text-xs font-bold text-gray-400 hover:text-primary transition-colors">Set Default</button>
                            )}
                            <button onClick={() => handleDeleteAddress(index)} className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors">Remove</button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div id="orders" className="bg-white p-12 rounded-2xl shadow-premium border border-gray-50">
                <div className="flex items-center space-x-4 mb-10">
                  <div className="w-12 h-12 bg-accent/5 rounded-2xl flex items-center justify-center text-accent">
                    <FiPackage />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter">Order History</h3>
                </div>
                
                {loadingOrders ? (
                  <div className="text-center py-20">
                    <FiLoader className="text-4xl text-primary animate-spin mx-auto" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-sm text-gray-300">
                      <FiUploadCloud />
                    </div>
                    <p className="text-gray-400 font-bold mb-8">You haven't placed any orders yet.</p>
                    <Link to="/shop" className="btn-secondary inline-flex px-10">Start Your Journey</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <Link 
                        key={order._id}
                        to={`/order/${order._id}`} 
                        className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all group"
                      >
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-black text-lg text-accent">#{order._id.slice(-6).toUpperCase()}</h4>
                            <span className={`text-[9px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full ${
                              order.orderStatus === 'Delivered' ? 'text-green-500 bg-green-50' : 
                              order.orderStatus === 'Processing' ? 'text-blue-500 bg-blue-50' : 
                              order.orderStatus === 'Shipped' ? 'text-orange-500 bg-orange-50' : 
                              'text-red-500 bg-red-50'
                            }`}>
                              {order.orderStatus || 'Pending'}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-400">{new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} Items</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center space-x-6">
                          <span className="font-black text-xl text-primary">${order.totalPrice.toFixed(2)}</span>
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-colors">
                            <FiArrowRight />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


