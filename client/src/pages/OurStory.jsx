import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { getSiteSettings } from '../redux/slices/settingsSlice';
import { FiAward, FiGlobe, FiFeather } from 'react-icons/fi'; // Premium Icons

const OurStory = () => {
  const dispatch = useDispatch();
  const { data: siteSettings, loading } = useSelector((state) => state.settings);

  useEffect(() => {
    dispatch(getSiteSettings());
  }, [dispatch]);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.2 } },
    viewport: { once: true }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F6F6F7] flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const about = siteSettings?.about;

  return (
    <div className="bg-[#F6F6F7] min-h-screen pt-32 pb-24 font-['Outfit'] selection:bg-primary selection:text-white">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)]">
        
        {/* Header Section */}
        <motion.div 
          initial="initial" 
          animate="whileInView" 
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.span variants={fadeInUp} className="text-primary font-black uppercase tracking-[8px] text-[10px] mb-6 block">
            {about?.subtitle || 'A Legacy of Excellence'}
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-[clamp(3rem,6vw,5rem)] font-black text-[#071120] tracking-tighter leading-[0.9] italic mb-8">
            {about?.title || 'Our Heritage'}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-gray-500 text-lg font-medium leading-relaxed">
            {about?.description || 'Founded on the principles of timeless design and uncompromising quality, Kinki Bazar represents the pinnacle of modern luxury living.'}
          </motion.p>
        </motion.div>

        {/* Cinematic Image Reveal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full aspect-[21/9] rounded-2xl md:rounded-2xl overflow-hidden mb-32 relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] group"
        >
          <img 
            src={about?.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"} 
            alt="Heritage" 
            className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-[#071120]/10 mix-blend-overlay" />
        </motion.div>

        {/* The Pillars (Mission, Vision, Values) */}
        <motion.div 
          initial="initial"
          whileInView="whileInView"
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-12 lg:gap-20"
        >
          {[
            { 
              icon: <FiGlobe />, 
              title: about?.missionTitle || 'Our Mission', 
              desc: about?.missionDesc || 'To redefine the spaces where life unfolds by curating objects of extraordinary beauty.' 
            },
            { 
              icon: <FiAward />, 
              title: about?.visionTitle || 'Our Vision', 
              desc: about?.visionDesc || 'To be the definitive global destination for those who seek to surround themselves with mastery.' 
            },
            { 
              icon: <FiFeather />, 
              title: about?.valuesTitle || 'Our Values', 
              desc: about?.valuesDesc || 'Unwavering commitment to quality, sustainability in sourcing, and preservation of artisanship.' 
            }
          ].map((item, idx) => (
            <motion.div key={idx} variants={fadeInUp} className="group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-[#071120] mb-8 shadow-xl border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2">
                <div className="text-3xl">{item.icon}</div>
              </div>
              <h3 className="text-2xl font-black text-[#071120] mb-4 tracking-tighter italic">{item.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default OurStory;


