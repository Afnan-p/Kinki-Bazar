import React from 'react';
import { FiSettings, FiBell, FiShield, FiLock, FiGlobe } from 'react-icons/fi';

const Settings = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <h3 className="text-2xl font-black text-accent mb-2">Platform Settings</h3>
        <p className="text-gray-400 font-medium">Configure and manage your store's global parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl">
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
              <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary font-bold" defaultValue="Kinki Bazar" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Support Email</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary font-bold" defaultValue="support@kinkibazar.com" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
              <FiLock />
            </div>
            <div>
              <h4 className="font-black text-accent">Security Policy</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Access Control</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <span className="text-sm font-bold text-gray-600">Two-Factor Auth</span>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <span className="text-sm font-bold text-gray-600">Registration Status</span>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-accent p-8 rounded-[40px] text-white flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div>
          <h4 className="text-xl font-black mb-1">Unsaved Changes</h4>
          <p className="text-white/60 font-medium">You have modified your store configuration</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-8 h-14 rounded-2xl bg-white/10 hover:bg-white/20 font-bold transition-all">Discard</button>
          <button className="px-10 h-14 rounded-2xl bg-primary hover:bg-primary-dark font-black shadow-xl shadow-primary/20 transition-all">Save Config</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
