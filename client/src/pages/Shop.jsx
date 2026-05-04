import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FiFilter, FiChevronDown, FiGrid, FiList, FiSearch, FiX, FiStar, FiCheck, FiArrowRight, FiSliders } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { useLocation, useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import axios from 'axios';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// Premium Shimmer Skeleton Card
const SkeletonCard = () => (
  <div className="bg-white rounded-[40px] overflow-hidden p-6 space-y-6 shadow-sm border border-gray-100">
    <div className="aspect-[4/5] bg-gray-100 rounded-[30px] animate-shimmer relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-100 rounded-full w-2/3 animate-shimmer" />
      <div className="h-6 bg-gray-100 rounded-full w-full animate-shimmer" />
      <div className="h-4 bg-gray-100 rounded-full w-1/2 animate-shimmer" />
    </div>
  </div>
);

const Shop = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  const queryParams = new URLSearchParams(location.search);
  const keywordFromUrl = queryParams.get('keyword') || '';
  const categoryFromUrl = queryParams.get('category') || '';

  const { products, loading, error, pages, page } = useSelector((state) => state.products);

  const [view, setView] = useState('grid');
  const [priceRange, setPriceRange] = useState(100000000); 
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedRating, setSelectedRating] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [searchTerm, setSearchTerm] = useState(keywordFromUrl);
  const [isFilterBarSticky, setIsFilterBarSticky] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Handle Sticky Filter Bar
  useEffect(() => {
    const handleScroll = () => {
      setIsFilterBarSticky(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Data Fetching
  useEffect(() => {
    dispatch(listProducts({ 
      pageNumber: 1, 
      pageSize: 40,
      keyword: searchTerm,
      category: selectedCategory,
      price: priceRange
    }));
  }, [dispatch, searchTerm, selectedCategory, priceRange]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    const prods = Array.isArray(products) ? products : [];
    if (prods.length === 0) return [];
    
    return prods.filter((product) => {
      const productCatName = (product.category?.name || "").toString().trim().toLowerCase();
      const productCatId = (product.category?._id || product.category || "").toString();
      const targetCat = selectedCategory.trim().toLowerCase();
      
      const matchesCategory = !selectedCategory || productCatName === targetCat || productCatId === selectedCategory;
      const searchStr = searchTerm.toLowerCase().trim();
      const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchStr) || product.description.toLowerCase().includes(searchStr);
      const matchesPrice = Number(product.price) <= Number(priceRange);
      const matchesRating = !selectedRating || Number(product.ratings) >= Number(selectedRating);

      return matchesCategory && matchesSearch && matchesPrice && matchesRating;
    }).sort((a, b) => {
      if (sortOrder === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === 'price_low') return a.price - b.price;
      if (sortOrder === 'price_high') return b.price - a.price;
      if (sortOrder === 'popular') return b.ratings - a.ratings;
      return 0;
    });
  }, [products, searchTerm, selectedCategory, priceRange, selectedRating, sortOrder]);

  const debouncedSearch = useCallback(
    debounce((value) => setSearchTerm(value), 500),
    []
  );

  const handleCategorySelect = (cat) => {
    const catValue = cat?.name || cat;
    const newCat = selectedCategory === catValue ? '' : catValue;
    setSelectedCategory(newCat);
    navigate(`/shop${newCat ? `?category=${encodeURIComponent(newCat)}` : ''}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedRating('');
    setPriceRange(100000000);
    setSortOrder('latest');
    navigate('/shop');
  };

  return (
    <div className="bg-[#F5F5F7] min-h-screen pb-40 font-['Outfit']">
      
      {/* 1. CINEMATIC LUXURY HERO SECTION */}
      <section className="relative h-[90vh] min-h-[600px] bg-[#0B1020] overflow-hidden flex items-center">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            animate={{ 
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF2156]/20 rounded-full blur-[150px]"
          />
          <motion.div 
            animate={{ 
              x: [0, -80, 0],
              y: [0, 100, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[130px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F5F7]" />
        </div>

        <div className="container mx-auto px-6 lg:px-20 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="max-w-2xl text-center lg:text-left w-full">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block px-5 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[6px] mb-8"
            >
              Curated Luxury Collection
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="text-4xl sm:text-5xl md:text-[100px] font-black text-white leading-[0.85] tracking-tighter mb-8 px-4 sm:px-0"
            >
              Discover <br />
              <span className="text-primary italic">Timeless</span> Living
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/40 text-base md:text-2xl font-medium leading-relaxed mb-12 max-w-lg mx-auto lg:mx-0 px-6 md:px-0"
            >
              Explore handcrafted home essentials designed for modern premium lifestyles.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 px-6 sm:px-0"
            >
              <button className="w-full sm:w-auto h-14 sm:h-16 px-10 sm:px-12 bg-primary text-white rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-[4px] shadow-2xl shadow-primary/40 hover:scale-105 transition-all flex items-center justify-center group">
                Explore Collection
                <FiArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="w-full sm:w-auto h-14 sm:h-16 px-10 sm:px-12 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-[4px] hover:bg-white/10 transition-all">
                New Arrivals
              </button>
            </motion.div>
          </div>

          {/* Right Side: Floating Glass Product */}
          <div className="hidden lg:block relative w-[450px] h-[550px]">
            <motion.div
              animate={{ 
                y: [-20, 20, -20],
                rotate: [-2, 2, -2]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[60px] p-8 shadow-2xl flex flex-col justify-between"
            >
              <div className="w-full aspect-square bg-white/10 rounded-[40px] overflow-hidden">
                <img src={products?.[0]?.images?.[0]?.url || 'https://via.placeholder.com/600'} alt="Featured" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="space-y-4 pt-6">
                <span className="text-[10px] font-black text-primary tracking-[4px] uppercase">Trending Piece</span>
                <h3 className="text-2xl font-black text-white tracking-tighter">{products?.[0]?.name || "Luxury Essentials"}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-white">${products?.[0]?.price || "999"}</span>
                  <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center">
                    <FiArrowRight className="text-xl" />
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Small glow behind */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/40 blur-[100px] rounded-full" />
          </div>
        </div>
      </section>

      {/* 2. PREMIUM FLOATING FILTER BAR */}
      <div className={`container mx-auto px-4 md:px-10 lg:px-20 relative z-[100] transition-all duration-500 ${isFilterBarSticky ? 'fixed top-4 md:top-8 inset-x-0 !px-4' : '-mt-12 md:-mt-16'}`}>
        <motion.div 
          layout
          className={`bg-white/80 backdrop-blur-3xl p-4 md:p-6 rounded-[28px] md:rounded-[35px] shadow-2xl border border-white flex flex-col lg:flex-row items-center gap-4 md:gap-6 lg:gap-10 ${isFilterBarSticky ? 'max-w-5xl mx-auto' : 'max-w-7xl mx-auto'}`}
        >
          {/* Search */}
          <div className="relative w-full lg:w-80 group">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-primary text-xl transition-transform group-hover:scale-125" />
            <input 
              type="text" 
              placeholder="Search masterpieces..." 
              className="w-full bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white pl-16 pr-8 py-4 rounded-[20px] md:rounded-[22px] font-bold text-accent transition-all placeholder:text-gray-300 outline-none"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>

          {/* 3. CATEGORY PILLS (Horizontal Scroll) */}
          <div className="flex-grow overflow-x-auto no-scrollbar py-1 w-full lg:w-auto">
            <div className="flex items-center space-x-3 pr-4">
              <button 
                onClick={() => handleCategorySelect('')}
                className={`px-6 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[3px] whitespace-nowrap transition-all duration-500 border-2 ${
                  !selectedCategory ? 'bg-accent border-accent text-white shadow-xl shadow-accent/20 scale-105' : 'bg-transparent border-gray-100 text-gray-400 hover:border-primary/30 hover:text-primary'
                }`}
              >
                All Collections
              </button>
              {(Array.isArray(categories) ? categories : []).map((cat) => {
                const isSelected = selectedCategory === cat?._id || selectedCategory?.toLowerCase() === cat?.slug?.toLowerCase() || selectedCategory?.toLowerCase() === cat?.name?.toLowerCase();
                return (
                  <button 
                    key={cat?._id} 
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-6 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[3px] whitespace-nowrap transition-all duration-500 border-2 ${
                      isSelected ? 'bg-accent border-accent text-white shadow-xl shadow-accent/20 scale-105' : 'bg-transparent border-gray-100 text-gray-400 hover:border-primary/30 hover:text-primary'
                    }`}
                  >
                    {cat?.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4 w-full lg:w-auto">
            <div className="hidden sm:flex bg-gray-50/50 p-2 rounded-2xl">
              <button onClick={() => setView('grid')} className={`p-3 rounded-xl transition-all ${view === 'grid' ? 'bg-white shadow-lg text-primary scale-110' : 'text-gray-300'}`}><FiGrid /></button>
              <button onClick={() => setView('list')} className={`p-3 rounded-xl transition-all ${view === 'list' ? 'bg-white shadow-lg text-primary scale-110' : 'text-gray-300'}`}><FiList /></button>
            </div>

            <div className="relative flex-grow lg:flex-grow-0 min-w-[200px]">
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-accent text-white pl-6 pr-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[3px] appearance-none cursor-pointer focus:ring-4 focus:ring-primary/20"
              >
                <option value="latest">Sort By: Latest</option>
                <option value="price_low">Price: Low - High</option>
                <option value="price_high">Price: High - Low</option>
                <option value="popular">Most Popular</option>
              </select>
              <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary" />
            </div>

            <button onClick={() => setIsMobileFiltersOpen(true)} className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:scale-110 transition-all">
              <FiSliders className="text-xl" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 4. PRODUCT GRID & MAIN CONTENT */}
      <div className="container mx-auto px-4 md:px-10 lg:px-20 mt-24">
        <div className="flex flex-col gap-16">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonCard key={i} />)}
              </motion.div>
            ) : error ? (
              <div className="text-center py-20 bg-white rounded-[60px] shadow-sm border border-red-50">
                <p className="text-red-500 font-black text-2xl">{error}</p>
                <button onClick={() => fetchProducts(1)} className="mt-8 btn-primary px-12">Retry</button>
              </div>
            ) : filteredProducts.length === 0 ? (
              /* 9. LUXURY EMPTY STATE */
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 md:p-40 rounded-[50px] md:rounded-[70px] text-center border-2 border-dashed border-gray-100 shadow-premium mx-4 md:mx-0"
              >
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-32 h-32 md:w-48 md:h-48 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-12 shadow-inner"
                >
                  <span className="text-5xl md:text-7xl">🔍</span>
                </motion.div>
                <h3 className="text-2xl md:text-4xl font-black text-accent mb-4 md:mb-6 tracking-tighter">No curated products found</h3>
                <p className="text-gray-400 mb-10 md:mb-14 max-w-sm mx-auto font-medium text-sm md:text-lg leading-relaxed px-4">We couldn't find any premium masterpieces matching your current lens. Try relaxing your filters.</p>
                <button onClick={clearFilters} className="h-14 md:h-18 px-12 md:px-16 bg-primary text-white rounded-2xl md:rounded-3xl font-black text-[10px] md:text-[11px] uppercase tracking-[5px] shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                  Explore Everything
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                layout
                className={`grid gap-4 md:gap-12 ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      key={product?._id}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {!loading && !error && pages > 1 && (
            <div className="flex justify-center items-center space-x-6 mt-20">
              {[...Array(pages).keys()].map((x) => (
                <button 
                  key={x + 1}
                  onClick={() => handlePageChange(x + 1)}
                  className={`w-16 h-16 rounded-3xl font-black text-lg transition-all duration-700 ${
                    x + 1 === page ? 'bg-accent text-white shadow-2xl shadow-accent/30 scale-125 z-10' : 'bg-white text-accent hover:bg-gray-50 border border-gray-100 hover:scale-110'
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-[1000] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="absolute inset-0 bg-[#0B1020]/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="relative w-full max-w-md bg-white h-full p-12 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-16">
                <h3 className="text-4xl font-black tracking-tighter">Filters</h3>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-4 bg-gray-50 rounded-2xl"><FiX className="text-2xl" /></button>
              </div>

              <div className="space-y-16">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[5px] text-primary mb-8">Price Threshold</h4>
                  <input 
                    type="range" min="0" max="5000" step="50"
                    value={priceRange > 5000 ? 5000 : priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary mb-8" 
                  />
                  <div className="p-8 bg-gray-50 rounded-[35px] border border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-400">Limit:</span>
                    <span className="text-3xl font-black text-accent tracking-tighter">${priceRange > 5000 ? "Unlimited" : priceRange}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[5px] text-primary mb-8">Minimum Rating</h4>
                  <div className="grid grid-cols-5 gap-3">
                    {[5,4,3,2,1].map(star => (
                      <button 
                        key={star}
                        onClick={() => setSelectedRating(selectedRating === star ? '' : star)}
                        className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all border-2 ${selectedRating === star ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30' : 'bg-white border-gray-100 text-gray-300'}`}
                      >
                        <FiStar className={selectedRating === star ? 'fill-current' : ''} />
                        <span className="text-[10px] mt-1 font-black">{star}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={clearFilters} className="w-full py-6 bg-accent text-white rounded-3xl font-black text-[11px] uppercase tracking-[4px] shadow-2xl shadow-accent/30">
                  Reset Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
