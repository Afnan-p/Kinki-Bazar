import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFacebook, 
  FiInstagram, 
  FiTwitter, 
  FiYoutube, 
  FiMail, 
  FiArrowRight, 
  FiSend
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Logo from './Logo';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: siteSettings } = useSelector(state => state.settings);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setIsSubscribing(true);
      await api.post('/subscribers', { email });
      toast.success('Joined the Elite Circle successfully!');
      setEmail('');
      setIsSubscribing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed');
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#071120] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/5 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-[clamp(1rem,4vw,3rem)] relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start pb-20 border-b border-white/5">
          
          {/* 1. BRAND STORY & SOCIALS */}
          <div className="lg:col-span-4 space-y-10">
            <Link to="/" className="inline-block group">
              <Logo isTransparent={true} iconSize="w-12 h-12" />
            </Link>
            <p className="text-white/30 text-lg font-medium leading-relaxed max-w-sm italic">
              {siteSettings?.footer?.about || "Crafting a legacy of modern luxury and architectural excellence."}
            </p>
            <div className="flex space-x-5">
              {[
                { Icon: FiInstagram, link: siteSettings?.footer?.instagram || "#" },
                { Icon: FiTwitter, link: siteSettings?.footer?.twitter || "#" },
                { Icon: FiFacebook, link: siteSettings?.footer?.facebook || "#" },
                { Icon: FiYoutube, link: siteSettings?.footer?.youtube || "#" }
              ].map(({ Icon, link }, i) => (
                <motion.a 
                  key={i} 
                  href={link} 
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 group shadow-glow"
                >
                  <Icon className="text-lg" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* 2. MINIMAL LINKS GROUP */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-10">
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[5px] text-primary mb-8">Navigation</h4>
              <ul className="space-y-4">
                {['Collections', 'Categories', 'Our Story', 'Journal'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-white/20 hover:text-white font-black text-[9px] uppercase tracking-[3px] transition-all group flex items-center">
                      <span className="w-0 group-hover:w-4 h-[1px] bg-primary mr-0 group-hover:mr-3 transition-all duration-500 opacity-0 group-hover:opacity-100"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[5px] text-primary mb-8">Experience</h4>
              <ul className="space-y-4">
                {['Support', 'Shipping', 'Returns', 'Privacy'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-white/20 hover:text-white font-black text-[9px] uppercase tracking-[3px] transition-all group flex items-center">
                      <span className="w-0 group-hover:w-4 h-[1px] bg-primary mr-0 group-hover:mr-3 transition-all duration-500 opacity-0 group-hover:opacity-100"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. COMPACT LUXURY NEWSLETTER */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[5px] text-primary mb-6">The Elite Circle</h4>
              <p className="text-white/30 text-xs font-bold leading-relaxed max-w-xs">
                Subscribe for exclusive architectural insights and elite collection premieres.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="relative group">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Elite email" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-primary/50 transition-all text-sm font-bold text-white placeholder:text-white/10"
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="absolute right-2 top-2 bottom-2 w-12 bg-primary hover:bg-white hover:text-[#071120] text-white flex items-center justify-center rounded-xl transition-all shadow-xl group/btn disabled:opacity-50"
              >
                <FiSend className="text-lg group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </form>
            <p className="text-[7px] font-black uppercase tracking-[3px] text-white/10 text-center lg:text-left">
              Join 15,000+ global members
            </p>
          </div>
        </div>

        {/* 4. REFINED BOTTOM STRIP */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <p className="text-white/10 font-black text-[8px] uppercase tracking-[4px]">
              © {currentYear} Kinki Bazar. All Rights Reserved.
            </p>
            <div className="flex gap-8">
              {['Terms', 'Privacy', 'Legal'].map(item => (
                <Link key={item} to="#" className="text-white/5 hover:text-primary transition-colors font-black text-[8px] uppercase tracking-[3px]">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-10 opacity-10 hover:opacity-100 transition-all duration-1000 grayscale hover:grayscale-0">
            {['visa', 'mastercard', 'paypal'].map(payment => (
              <img 
                key={payment} 
                src={`https://img.icons8.com/color/48/000000/${payment}.png`} 
                alt={payment} 
                className="h-5 w-auto object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


