import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiLayers, FiSearch, FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch categories');
        setLoading(false);
      }
    };
    fetchCategories();
    window.scrollTo(0, 0);
  }, []);

  const filteredCategories = (Array.isArray(categories) ? categories : []).filter(cat => 
    cat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-accent py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-primary font-black uppercase tracking-[5px] text-xs mb-6 block">Elite Selection</span>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.1]">
              Explore Our <br/> <span className="text-primary italic">Collections</span>
            </h1>
            <p className="text-white/60 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              Discover a universe of premium kitchen essentials and designer home decor, each collection curated to reflect timeless elegance and modern functionality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-3xl border border-gray-50 flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-grow w-full">
            <FiSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-primary text-2xl" />
            <input 
              type="text" 
              placeholder="What are you looking for today?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-transparent rounded-xl py-6 pl-20 pr-8 text-accent font-black text-lg focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>
          <div className="bg-accent text-white px-10 py-6 rounded-xl font-black text-sm uppercase tracking-[3px] hidden lg:block shadow-xl">
            {filteredCategories.length} Collections Found
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-[420px] bg-gray-50 rounded-2xl animate-pulse border border-gray-100 shadow-inner"></div>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
            >
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl text-gray-200">
                <FiLayers className="text-5xl" />
              </div>
              <h3 className="text-3xl font-black text-accent mb-4 tracking-tighter">No Collections Found</h3>
              <p className="text-gray-400 font-medium max-w-sm mx-auto mb-10">We couldn't find any collections matching your search criteria. Try a different keyword.</p>
              <button onClick={() => setSearchTerm('')} className="btn-primary px-12 h-16">View All Collections</button>
            </motion.div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {filteredCategories.map((cat, i) => (
                <motion.div 
                  key={cat?._id}
                  variants={item}
                  className="group relative h-[420px] rounded-2xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-700 hover:-translate-y-2"
                >
                  <Link to={`/categories/${cat?.slug}`} className="block h-full w-full">
                    <img 
                      src={cat?.image?.url || 'https://images.unsplash.com/photo-1594913785162-e67860432560?auto=format&fit=crop&w=800&q=80'} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1594913785162-e67860432560?auto=format&fit=crop&w=800&q=80' }}
                    />
                    
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f16] via-[#0a0f16]/60 to-transparent p-8 flex flex-col justify-end transition-all duration-700 group-hover:from-[#0a0f16]/90 group-hover:via-[#0a0f16]/70">
                      <motion.div className="transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out">
                        <div className="flex items-center space-x-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <span className="w-8 h-[2px] bg-primary"></span>
                          <span className="text-primary font-black uppercase tracking-[4px] text-[9px]">
                            Curated
                          </span>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight group-hover:text-white transition-colors drop-shadow-md">
                          {cat?.name}
                        </h3>
                        
                        <p className="text-white/70 text-xs leading-relaxed line-clamp-2 mb-6 font-medium opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 h-0 group-hover:h-auto overflow-hidden">
                          {cat?.description || 'Exclusive premium selection curated for high-end lifestyle and modern kitchen aesthetics.'}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 group-hover:rotate-[360deg] transition-all duration-1000 group-hover:bg-white group-hover:text-primary">
                            <FiArrowRight className="text-xl" />
                          </div>
                          <div className="text-white/10 font-black text-5xl italic tracking-tighter opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-x-4 group-hover:translate-x-0">
                            0{i + 1}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Luxury Promo Section */}
      <section className="pb-32 px-6">
        <div className="container mx-auto bg-primary rounded-2xl p-16 md:p-24 relative overflow-hidden shadow-2xl shadow-primary/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
                Tailored Solutions <br/> For Your Sanctuary.
              </h2>
              <p className="text-white/80 text-xl font-medium leading-relaxed">Our concierge team assists in sourcing the rarest and most elegant pieces globally for your elite lifestyle.</p>
            </div>
            <Link to="/shop" className="btn-secondary h-20 px-16 text-xl shadow-2xl whitespace-nowrap">
              Discover Rare Pieces
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;


