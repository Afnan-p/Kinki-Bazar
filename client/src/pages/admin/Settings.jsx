import React, { useState, useEffect } from 'react';
import { FiSettings, FiBell, FiShield, FiLock, FiGlobe } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { getSiteSettings, updateSiteSettings, resetSettingsUpdate } from '../../redux/slices/settingsSlice';
import toast from 'react-hot-toast';

const Settings = () => {
  const dispatch = useDispatch();
  const { data, loading, updateLoading, updateSuccess, updateError } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    storeName: 'Kinki Bazar',
    supportEmail: 'support@kinkibazar.com',
    twoFactorAuth: false,
    registrationStatus: true
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    dispatch(getSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    if (data?.platform) {
      setFormData(data.platform);
      setHasChanges(false);
    }
  }, [data]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Platform settings updated successfully!');
      dispatch(resetSettingsUpdate());
      setHasChanges(false);
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(resetSettingsUpdate());
    }
  }, [updateSuccess, updateError, dispatch]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    dispatch(updateSiteSettings({ platform: formData }));
  };

  const handleDiscard = () => {
    if (data?.platform) {
      setFormData(data.platform);
    }
    setHasChanges(false);
  };

  if (loading && !data) {
    return <div className="flex justify-center p-10"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-2xl font-black text-accent mb-2">Platform Settings</h3>
        <p className="text-gray-400 font-medium">Configure and manage your store's global parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl">
              <FiGlobe />
            </div>
            <div>
              <h4 className="font-black text-accent">Store Information</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Global Identity</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Store Name</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-4 px-6 focus:outline-none focus:border-primary font-bold" 
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Support Email</label>
              <input 
                type="email" 
                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-4 px-6 focus:outline-none focus:border-primary font-bold" 
                value={formData.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
              <FiLock />
            </div>
            <div>
              <h4 className="font-black text-accent">Security Policy</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Access Control</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-bold text-gray-600">Two-Factor Auth</span>
              <div 
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${formData.twoFactorAuth ? 'bg-primary' : 'bg-gray-200'}`}
                onClick={() => handleChange('twoFactorAuth', !formData.twoFactorAuth)}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.twoFactorAuth ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-bold text-gray-600">Registration Status</span>
              <div 
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${formData.registrationStatus ? 'bg-primary' : 'bg-gray-200'}`}
                onClick={() => handleChange('registrationStatus', !formData.registrationStatus)}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${formData.registrationStatus ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-accent p-8 rounded-lg text-white flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 animate-fadeIn">
          <div>
            <h4 className="text-xl font-black mb-1">Unsaved Changes</h4>
            <p className="text-white/60 font-medium">You have modified your store configuration</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={handleDiscard}
              className="px-8 h-14 rounded-lg bg-white/10 hover:bg-white/20 font-bold transition-all"
            >
              Discard
            </button>
            <button 
              onClick={handleSave}
              disabled={updateLoading}
              className="px-10 h-14 rounded-lg bg-primary hover:bg-primary-dark font-black shadow-xl shadow-primary/20 transition-all flex items-center justify-center min-w-[160px]"
            >
              {updateLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Save Config'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;


