import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiTarget, 
  FiHeart, 
  FiShield, 
  FiTruck, 
  FiUsers, 
  FiPackage, 
  FiAward, 
  FiArrowRight, 
  FiCheckCircle 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { label: 'Happy Customers', value: '50k+', icon: <FiUsers /> },
    { label: 'Premium Products', value: '2k+', icon: <FiPackage /> },
    { label: 'Orders Delivered', value: '120k+', icon: <FiCheckCircle /> },
    { label: 'Design Awards', value: '12', icon: <FiAward /> },
  ];

  const features = [
    {
      title: 'Curated Excellence',
      desc: 'We handpick every item in our collection to ensure it meets our strict standards of design and durability.',
      icon: <FiTarget />,
      color: 'bg-primary/10 text-primary'
    },
    {
      title: 'Customer Obsession',
      desc: 'Your satisfaction is our heartbeat. We provide 24/7 support to ensure your journey is seamless.',
      icon: <FiHeart />,
      color: 'bg-red-100 text-red-500'
    },
    {
      title: 'Secure Integrity',
      desc: 'Shop with total peace of mind. Our payment gateways are protected by world-class encryption.',
      icon: <FiShield />,
      color: 'bg-blue-100 text-blue-500'
    },
    {
      title: 'Express Logistics',
      desc: 'Global reach with local speed. Our logistics network ensures your pieces arrive in pristine condition.',
      icon: <FiTruck />,
      color: 'bg-emerald-100 text-emerald-500'
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 bg-accent overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-6 py-2 bg-primary/20 backdrop-blur-md rounded-full text-primary text-[10px] font-black uppercase tracking-[5px] mb-8"
          >
            Our Legacy
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter"
          >
            Redefining <span className="text-primary italic">Modern</span> Living
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-xl max-w-2xl mx-auto font-medium leading-relaxed"
          >
            <span className="font-['Bricolage_Grotesque'] lowercase text-primary">kinki</span> <span className="font-['Bricolage_Grotesque'] uppercase text-white">Bazar</span> is more than an ecommerce platform. We are a curated destination for those who seek elegance, quality, and soul in their everyday essentials.
          </motion.p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-[60px] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80" 
                  alt="Craftsmanship" 
                  className="w-full h-[600px] object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-primary p-12 rounded-[48px] shadow-2xl hidden md:block">
                <p className="text-white font-black text-4xl italic">Since 2021</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div>
                <span className="text-primary font-black uppercase tracking-[5px] text-xs mb-4 block">The Vision</span>
                <h2 className="text-4xl md:text-6xl font-black text-accent tracking-tighter mb-8">Crafting Memories Through Design.</h2>
                <p className="text-gray-500 text-lg leading-loose">
                  Our journey began with a simple observation: the objects we surround ourselves with define the quality of our lives. At Kinki Bazar, we bridge the gap between artisanal craftsmanship and contemporary lifestyle. 
                  <br/><br/>
                  We believe that your home is a sanctuary, and every piece of crockery, every storage unit, and every essential should tell a story of beauty and purpose.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100">
                  <h4 className="font-black text-accent text-2xl mb-2">100%</h4>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Artisanal Selection</p>
                </div>
                <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100">
                  <h4 className="font-black text-accent text-2xl mb-2">24h</h4>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Support Response</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-accent">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary text-2xl mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {stat.icon}
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">{stat.value}</h3>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary font-black uppercase tracking-[5px] text-xs mb-4 block">Core Values</span>
            <h2 className="text-4xl md:text-6xl font-black text-accent tracking-tighter">Why Elevate With Us?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[48px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group"
              >
                <div className={`${feature.color} w-16 h-16 rounded-[24px] flex items-center justify-center text-2xl mb-8 group-hover:rotate-12 transition-transform`}>
                  {feature.icon}
                </div>
                <h4 className="font-black text-accent text-xl mb-4">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-[60px] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter">Ready to Start Your <br/> Premium Journey?</h2>
              <p className="text-white/80 text-xl max-w-xl mx-auto mb-12 font-medium">Join thousands of satisfied customers who have redefined their lifestyle with Kinki Bazar.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/shop" className="btn-secondary h-16 px-12 text-lg flex items-center space-x-3 w-full sm:w-auto">
                  <span>Explore Catalog</span>
                  <FiArrowRight />
                </Link>
                <Link to="/contact" className="bg-white/10 backdrop-blur-md text-white border border-white/20 h-16 px-12 rounded-full flex items-center justify-center font-black hover:bg-white/20 transition-all w-full sm:w-auto">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
