import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { getSiteSettings } from '../redux/slices/settingsSlice';
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

const Contact = () => {
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

  if (loading) {
    return <div className="min-h-screen bg-[#F6F6F7] flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const contact = siteSettings?.contact;

  return (
    <div className="bg-[#F6F6F7] min-h-screen pt-32 pb-24 font-['Outfit'] selection:bg-primary selection:text-white">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,4rem)]">
        
        {/* Header */}
        <motion.div 
          initial="initial" 
          animate="whileInView" 
          variants={{
            initial: {},
            whileInView: { transition: { staggerChildren: 0.2 } },
          }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.span variants={fadeInUp} className="text-primary font-black uppercase tracking-[8px] text-[10px] mb-6 block">
            {contact?.subtitle || 'Private Consultations'}
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-[clamp(3rem,6vw,5rem)] font-black text-[#071120] tracking-tighter leading-[0.9] italic mb-8">
            {contact?.title || 'Get in Touch'}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-gray-500 text-lg font-medium leading-relaxed">
            {contact?.description || 'Connect with our global concierge team for personalized sourcing, bespoke commissions, or general inquiries.'}
          </motion.p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100 space-y-8 md:space-y-10">
              <h3 className="text-3xl font-black text-[#071120] tracking-tighter italic mb-8 border-b border-gray-100 pb-6">Direct Channels</h3>
              
              <div className="flex items-start space-x-6 group">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                  <FiMail className="text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 mb-2">Electronic Mail</h4>
                  <a href={`mailto:${contact?.email}`} className="text-lg md:text-xl font-bold text-[#071120] hover:text-primary transition-colors break-all md:break-normal">{contact?.email || 'concierge@kinkibazar.com'}</a>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                  <FiPhone className="text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 mb-2">Concierge Desk</h4>
                  <a href={`tel:${contact?.phone}`} className="text-lg md:text-xl font-bold text-[#071120] hover:text-primary transition-colors">{contact?.phone || '+1 (800) 555-0199'}</a>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                  <FiMapPin className="text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 mb-2">Flagship Location</h4>
                  <p className="text-base md:text-lg font-medium text-[#071120] leading-relaxed max-w-[250px]">{contact?.address || '123 Luxury Ave, Beverly Hills, CA 90210'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map Embed */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-full min-h-[350px] md:min-h-[500px]"
          >
            <div className="w-full h-full min-h-[350px] md:min-h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white relative group">
              <div className="absolute inset-0 bg-[#071120]/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10" />
              {contact?.mapUrl ? (
                <iframe 
                  src={contact.mapUrl} 
                  width="100%" 
                  height="100%" 
                  className="absolute inset-0 w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-1000"
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="w-full h-full min-h-[500px] bg-gray-200 flex items-center justify-center text-gray-400">
                  <FiMapPin className="text-4xl" />
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;


