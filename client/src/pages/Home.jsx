import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import Logo from '../components/Logo';
import DesignerToaster from "../assets/Designer Toaster.jpg"
import ArtisanKettle from "../assets/Artisan Kettle.jpg"
import blender from "../assets/blender.jpg"
import cookingPot from "../assets/cooking pot.jpg"
import kitchen from "../assets/kitchen.jpg"
import { 
  FiArrowRight, 
  FiShield, 
  FiTruck, 
  FiRefreshCw, 
  FiHeadphones,
  FiStar,
  FiMail,
  FiArrowUp,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiAward,
  FiZap,
  FiUsers,
  FiShoppingBag,
  FiLock,
  FiCpu,
  FiHeart,
  FiEye,
  FiCheckCircle,
  FiActivity,
  FiCommand
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const Home = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [signatureVaultProducts, setSignatureVaultProducts] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');
  
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingSections(true);
      try {
        const [catRes, featRes, trendRes, bestRes, newRes, vaultRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?isFeatured=true&pageSize=8'),
          api.get('/products?isTrending=true&pageSize=8'),
          api.get('/products?isBestSeller=true&pageSize=8'),
          api.get('/products?isNewArrival=true&pageSize=8'),
          api.get('/products?isSignatureVault=true&pageSize=12')
        ]);

        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setFeaturedProducts(featRes.data.products || []);
        setTrendingProducts(trendRes.data.products || []);
        setBestSellers(bestRes.data.products || []);
        setNewArrivals(newRes.data.products || []);
        setSignatureVaultProducts(vaultRes.data.products || []);
      } catch (err) {
        console.error('Failed to fetch homepage data', err);
      } finally {
        setLoadingSections(false);
      }
    };
    fetchData();
  }, []);

  const tabData = {
    featured: featuredProducts,
    trending: trendingProducts,
    bestSellers: bestSellers,
    newArrivals: newArrivals
  };

  const containerClass = "max-w-[1400px] mx-auto px-[clamp(1rem,4vw,3rem)]";

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    viewport: { once: true }
  };

  return (
    <div className="bg-[#F6F6F7] min-h-screen overflow-x-hidden font-['Outfit'] relative selection:bg-primary selection:text-white">
      
      {/* 1. CINEMATIC PREMIUM HERO SECTION - UPGRADED */}
      <section className="relative h-[min(110vh,1000px)] bg-[#071120] overflow-hidden flex items-center pt-32 md:pt-48 pb-24 md:pb-32">
        {/* Cinematic Background Layer */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="w-full h-full will-change-transform"
          >
            <motion.img 
              initial={{ scale: 1.2, filter: 'blur(10px)', opacity: 0 }}
              animate={{ scale: 1, filter: 'blur(0px)', opacity: 0.4 }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
              className="w-full h-full object-cover will-change-transform"
              alt="Luxury Colorful Kitchen"
            />
          </motion.div>
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/20 rounded-full blur-[180px] pointer-events-none will-change-transform" 
          />
          <motion.div 
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none will-change-transform" 
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-[#071120] via-[#071120]/20 to-transparent z-10" />
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#071120] to-transparent z-10" />
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#F6F6F7] via-[#F6F6F7]/20 to-transparent z-20" />
        </div>

        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] relative z-30 grid lg:grid-cols-2 gap-20 items-center w-full">
          <div className="text-left relative z-40 max-w-2xl">
            <motion.div
              initial="initial"
              animate="whileInView"
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center space-x-3 px-6 py-2.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full mb-10"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]" />
                <span className="text-primary text-[10px] font-black uppercase tracking-[4px]">Luxury Living Redefined</span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-[clamp(2.4rem,5vw,5rem)] font-black text-white leading-[0.95] tracking-tighter mb-8"
              >
                Crafting <br />
                <span className="text-primary italic">Elegant</span> <br />
                Spaces For <br />
                Modern Living
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-white/50 text-[clamp(1rem,1.2vw,1.3rem)] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 mb-14"
              >
                Discover curated home essentials blending timeless craftsmanship with modern elegance. Designed for those who appreciate the finer details.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8"
              >
                <Link to="/shop" className="group relative h-20 px-16 bg-primary text-white rounded-[24px] font-black text-[11px] uppercase tracking-[5px] shadow-[0_20px_50px_-15px_rgba(var(--primary-rgb),0.5)] hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center justify-center overflow-hidden">
                  <span className="relative z-10">Enter The Collection</span>
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                  <FiArrowRight className="ml-4 group-hover:translate-x-2 transition-transform relative z-10 text-lg" />
                </Link>
                
                <button className="flex items-center space-x-6 group text-white/50 hover:text-white transition-all">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <FiPlay className="text-sm ml-1" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-black text-[10px] uppercase tracking-[4px]">Watch Film</span>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-[2px]">The Legacy of Craft</span>
                  </div>
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side: High-End Composition */}
          <div className="hidden lg:flex relative h-[650px] items-center justify-center">
            {/* Main Hero Asset */}
            <motion.div
              style={{ y: yParallax }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[400px] aspect-[3/4.2] rounded-[80px] overflow-hidden shadow-[0_100px_150px_-50px_rgba(0,0,0,0.9)] border border-white/10 z-10 bg-[#071120] group will-change-transform"
            >
              <img 
                src={kitchen}
                className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110 opacity-70" 
                alt="Classic Vase" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071120] via-transparent to-transparent opacity-90" />
              
              <div className="absolute bottom-16 left-16 right-16">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-[1px] bg-primary" />
                    <span className="text-primary font-black text-[10px] uppercase tracking-[4px]">Artisanal Selection</span>
                  </div>
                  <h3 className="text-5xl font-black text-white tracking-tighter leading-none italic">The Classic <br/> <span className="text-primary">Vase</span></h3>
                  <button className="text-white/40 font-black text-[9px] uppercase tracking-[3px] flex items-center group-hover:text-white transition-colors">
                    <span>View Piece Details</span>
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </motion.div>


            {/* Accent Elements */}
            <div className="absolute -left-10 bottom-20 w-32 h-32 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full pointer-events-none" />
          </div>
        </div>

        {/* Dynamic Scroll Indicator */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-4"
        >
          <span className="text-white/20 text-[8px] font-black uppercase tracking-[4px] rotate-90 mb-8 origin-left">Scroll Down</span>
          <div className="w-[1px] h-24 bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
        </motion.div>
      </section>

      <section className="relative z-40 bg-white border-y border-gray-100 py-20">
        <div className={containerClass}>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 md:gap-y-0"
          >
            {[
              { title: 'Global Concierge', icon: <FiHeadphones />, desc: 'Personalized assistance for every acquisition.' },
              { title: 'Secured Logistics', icon: <FiTruck />, desc: 'White-glove delivery across 140 countries.' },
              { title: 'Artisan Verified', icon: <FiAward />, desc: 'Digital twin certificates for authenticity.' },
              { title: 'Encrypted Vault', icon: <FiLock />, desc: 'Highest standard of transaction security.' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className={`flex flex-col items-center lg:items-start text-center lg:text-left lg:px-12 ${
                  i !== 3 ? 'lg:border-r lg:border-gray-100' : ''
                } group`}
              >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl text-[#071120] group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-8 shadow-sm">
                  {item.icon}
                </div>
                <h4 className="text-xs font-black uppercase tracking-[4px] text-[#071120] mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-[11px] font-bold leading-relaxed max-w-[200px]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. THE LUXURY EDIT SHOWCASE - KEPT SECTION */}
      <section className="py-24 bg-[#F6F6F7] relative overflow-hidden" id="luxury-edit">
        <div className={containerClass}>
          <div className="text-center mb-20">
            <motion.span 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="text-primary font-black uppercase tracking-[10px] text-[8px] mb-6 block"
            >
              Premium Catalog
            </motion.span>
            <motion.h2 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="text-[clamp(2.5rem,5vw,5rem)] font-black text-[#071120] tracking-tighter mb-14"
            >
              The Luxury <span className="text-primary italic">Edit</span>
            </motion.h2>
            
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="flex flex-wrap justify-center gap-3 bg-white/60 backdrop-blur-3xl p-2 rounded-full w-fit mx-auto border border-white/50 shadow-2xl shadow-black/5"
            >
              {['featured', 'trending', 'bestSellers', 'newArrivals'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 rounded-full font-black text-[8px] uppercase tracking-[4px] transition-all duration-500 relative group overflow-hidden ${
                    activeTab === tab 
                      ? 'bg-[#071120] text-white shadow-2xl scale-105' 
                      : 'text-gray-400 hover:text-[#071120]'
                  }`}
                >
                  <span className="relative z-10">{tab.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50"
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10"
          >
            <AnimatePresence mode="wait">
              {loadingSections ? (
                [1,2,3,4].map(i => (
                  <motion.div key={i} className="aspect-[4/5] bg-white rounded-[40px] animate-pulse" />
                ))
              ) : (
                tabData[activeTab]?.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 4. NEW: IMMERSIVE SHOWCASE SECTION */}
      <section className="py-40 bg-[#071120] relative overflow-hidden">
        {/* Cinematic Particles & Glows */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className={containerClass}>
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative group"
            >
              <div className="relative rounded-[80px] overflow-hidden aspect-[4/5.5] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5">
                <motion.img 
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 2.5 }}
                  src="https://images.unsplash.com/photo-1616489953149-866993244903?q=80&w=1200&auto=format" 
                  className="w-full h-full object-cover" 
                  alt="Showcase" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071120] via-[#071120]/20 to-transparent" />
              </div>
              
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-12 -right-12 w-80 p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[50px] shadow-3xl hidden md:block"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <FiActivity className="text-2xl" />
                  </div>
                  <span className="text-white font-black text-xs tracking-widest uppercase">Precision Metrics</span>
                </div>
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[4px] mb-2">Excellence Rating</p>
                <p className="text-4xl font-black text-white tracking-tighter italic">99.9% <span className="text-primary">Mastery</span></p>
              </motion.div>
            </motion.div>

            <div className="space-y-16">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
              >
                <motion.span variants={fadeInUp} className="text-primary font-black uppercase tracking-[10px] text-[12px] block mb-8">Unrivaled Detail</motion.span>
                <motion.h2 variants={fadeInUp} className="text-[clamp(3rem,6vw,5.5rem)] font-black text-white tracking-tighter leading-[0.9] mb-12">
                  The Anatomy Of <br/> <span className="text-primary italic">Absolute</span> Perfection
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-white/40 text-2xl font-medium leading-relaxed max-w-xl mb-16">
                  We don't just curate furniture; we orchestrate sensory experiences. Every stitch, every grain, and every reflection is calculated to transcend the mundane.
                </motion.p>
                
                <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-12 mb-20">
                  <div className="group relative">
                    <h4 className="text-4xl font-black text-white tracking-tighter italic mb-4 transition-colors group-hover:text-primary">Sustainable</h4>
                    <p className="text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-6">Eco-Elite Materials</p>
                    <div className="w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-700" />
                  </div>
                  <div className="group relative">
                    <h4 className="text-4xl font-black text-primary tracking-tighter italic mb-4 transition-colors group-hover:text-white">Timeless</h4>
                    <p className="text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-6">Generational Value</p>
                    <div className="w-0 h-[2px] bg-white group-hover:w-full transition-all duration-700" />
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Link to="/about" className="h-20 px-16 border border-white/20 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[5px] inline-flex items-center hover:bg-white hover:text-[#071120] transition-all group overflow-hidden relative">
                    <span className="relative z-10">Our Philosophy</span>
                    <FiArrowRight className="ml-4 group-hover:translate-x-3 transition-transform relative z-10 text-lg" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW: CURATED EXPERIENCE - ASYMMETRICAL GRID */}
      <section className="py-40 bg-white relative">
        <div className={containerClass}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
            <div className="max-w-3xl">
              <span className="text-primary font-black uppercase tracking-[12px] text-[12px] block mb-8">The Gallery</span>
              <h2 className="text-[clamp(3rem,7vw,6rem)] font-black text-[#071120] tracking-tighter leading-[0.85]">
                Curated <span className="text-primary italic">Visual</span> <br/> Narratives
              </h2>
            </div>
            <p className="text-gray-400 text-xl font-medium max-w-sm leading-relaxed">
              Where high-fashion aesthetics converge with architectural mastery to define the modern sanctuary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Left Masonry Column */}
            <div className="md:col-span-4 space-y-12">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group rounded-[60px] overflow-hidden shadow-2xl aspect-[3/4.2]"
              >
                <img src={DesignerToaster} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Designer Toaster" />
                <div className="absolute inset-0 bg-[#071120]/60 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center backdrop-blur-sm">
                  {/* <span className="px-10 py-4 bg-white text-[#071120] rounded-full font-black text-[10px] uppercase tracking-[4px] shadow-2xl">View Piece</span> */}
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-12 bg-[#071120] text-white rounded-[60px] shadow-[0_40px_80px_-20px_rgba(7,17,32,0.4)] group"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <FiZap className="text-3xl" />
                </div>
                <h3 className="text-4xl font-black tracking-tighter mb-6 italic">The Kinetic Collection</h3>
                <p className="text-white/40 text-lg leading-relaxed mb-10">Intelligent design that anticipates movement, blending fluid motion with uncompromising comfort.</p>
                <button className="flex items-center space-x-3 text-primary font-black text-[11px] uppercase tracking-[5px] group/btn">
                  <span>Explore Intelligence</span>
                  <FiArrowRight className="group-hover/btn:translate-x-3 transition-transform text-lg" />
                </button>
              </motion.div>
            </div>

            {/* Middle Tall Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 1 }}
              className="md:col-span-5 relative group rounded-[80px] overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.3)] aspect-[4/6.5]"
            >
              <img src={ArtisanKettle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s]" alt="Artisan Kettle" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071120] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-16 left-16 right-16">
                <span className="text-primary font-black text-[10px] uppercase tracking-[6px] mb-4 block">The Sanctuary Series</span>
                <h3 className="text-5xl font-black text-white tracking-tighter mb-6 italic leading-none">The Silence of Luxury</h3>
                <p className="text-white/60 text-lg max-w-xs mb-10">A dialogue between space, light, and the quiet power of exceptional design.</p>
                {/* <Link to="/shop" className="w-20 h-20 bg-white text-[#071120] rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-2xl transform group-hover:scale-110">
                  <FiArrowRight className="text-2xl" />
                </Link> */}
              </div>
            </motion.div>

            {/* Right Small Column */}
            <div className="md:col-span-3 space-y-12 mt-20">
              {[
                blender,
                cookingPot
              ].map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.2) }}
                  className="relative group rounded-[50px] overflow-hidden shadow-xl aspect-square border border-gray-100"
                >
                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Detail" />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW: SIGNATURE COLLECTION STRIP - HORIZONTAL MARQUEE */}
      <section className="py-32 bg-[#071120] overflow-hidden border-y border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_70%)] pointer-events-none" />
        
        <div className="flex flex-col items-center mb-24 px-6 text-center">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: '20px' }}
            whileInView={{ opacity: 1, letterSpacing: '12px' }}
            viewport={{ once: true }}
            className="text-primary font-black uppercase text-[10px] mb-8 block"
          >
            Elite Pieces
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic">The Signature <span className="text-primary">Vault</span></h2>
          <div className="w-24 h-1 bg-primary mt-10 rounded-full" />
        </div>
        
        <div className="flex space-x-12 animate-scroll-horizontal hover:pause px-12">
          {signatureVaultProducts?.length > 0 ? (
            [...signatureVaultProducts, ...signatureVaultProducts].map((product, idx) => (
              <motion.div 
                key={`${product._id}-${idx}`}
                whileHover={{ y: -10, scale: 1.02 }}
                className="flex-shrink-0 w-[300px] md:w-[550px] aspect-[16/10] bg-white/5 border border-white/10 rounded-[40px] md:rounded-[60px] overflow-hidden relative group cursor-pointer shadow-2xl"
              >
                <Link to={`/product/${product._id}`}>
                  <img src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1581781870027-04212e231e96?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s]" alt={product.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071120] via-[#071120]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                  <div className="absolute inset-0 p-16 flex flex-col justify-end">
                    <span className="text-primary font-black text-[8px] md:text-[10px] uppercase tracking-[4px] md:tracking-[6px] mb-2 md:mb-4">Vault Series 00{idx + 1}</span>
                    <h4 className="text-2xl md:text-4xl font-black text-white tracking-tighter mb-2 md:mb-4 italic leading-tight">{product.name}</h4>
                    <div className="h-[2px] w-0 group-hover:w-full bg-primary transition-all duration-1000 mt-6" />
                    <div className="flex items-center justify-between mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-10 group-hover:translate-y-0">
                      <span className="text-white/60 font-black text-[10px] uppercase tracking-[4px]">Investment Grade</span>
                      <span className="text-white font-black text-xl italic">${product.price?.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            /* Fallback if no products tagged for vault */
            [1,2,3,4,5,6,1,2,3,4,5,6].map((i, idx) => (
              <motion.div 
                key={idx}
                className="flex-shrink-0 w-[550px] aspect-[16/10] bg-white/5 border border-white/10 rounded-[60px] animate-pulse"
              />
            ))
          )}
        </div>
      </section>



      <section className="py-32 bg-white">
        <div className={containerClass}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black text-[#071120] tracking-tighter mb-8 italic">
                Stay <span className="text-primary text-glow">Connected</span>
              </h2>
              <p className="text-gray-400 text-xl font-medium mb-12 max-w-2xl mx-auto">
                Join our exclusive circle for seasonal premieres, private gallery openings, and artisanal insights.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto p-2 bg-gray-50 rounded-[30px] border border-gray-100">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-grow h-14 bg-transparent rounded-2xl px-8 focus:outline-none font-medium text-gray-700"
                />
                <button className="h-14 px-10 bg-[#071120] text-white rounded-[22px] font-black text-[10px] uppercase tracking-[4px] hover:bg-primary transition-all shadow-xl active:scale-95">
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scroll To Top - POLISHED */}
      <AnimatePresence>
        <motion.button 
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-10 right-10 z-[100] w-14 h-14 bg-[#071120] text-white rounded-2xl flex items-center justify-center shadow-3xl border border-white/10 hover:bg-primary transition-all group"
        >
          <FiArrowUp className="text-xl group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      </AnimatePresence>

    </div>
  );
};

export default Home;
