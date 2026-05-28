import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { FiArrowLeft, FiFilter, FiLoader, FiShoppingBag } from 'react-icons/fi';
import api from '../utils/api';
import { motion } from 'framer-motion';

const CategoryProducts = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  
  const [category, setCategory] = useState(null);
  const [catLoading, setCatLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  const { products, loading, error, pages, page } = useSelector((state) => state.products);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setCatLoading(true);
        // Find category by slug
        const { data: categories } = await api.get('/categories');
        const foundCat = categories.find(c => c.slug === slug);
        
        if (foundCat) {
          setCategory(foundCat);
          dispatch(listProducts({ category: foundCat._id, pageNumber, pageSize: 8 }));
        }
        setCatLoading(false);
      } catch (err) {
        console.error('Error fetching category products');
        setCatLoading(false);
      }
    };

    fetchCategoryAndProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, slug, pageNumber]);

  if (catLoading || (loading && products.length === 0)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <FiLoader className="text-4xl text-primary animate-spin" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Loading {slug} collection...</p>
      </div>
    );
  }

  if (!category && !catLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-4xl font-black text-accent mb-4">Collection Not Found</h2>
        <p className="text-gray-400 mb-8">The collection you are looking for does not exist or has been moved.</p>
        <Link to="/categories" className="btn-primary px-10 h-16 inline-flex">Back to Collections</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Dynamic Header */}
      <div className="relative h-[400px] md:h-[600px] overflow-hidden bg-accent">
        <img 
          src={category?.image?.url || 'https://images.unsplash.com/photo-1594913785162-e67860432560?auto=format&fit=crop&w=1920&q=80'} 
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
          alt={category?.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-accent via-accent/40 to-transparent flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link to="/categories" className="inline-flex items-center space-x-2 text-primary font-black uppercase tracking-[3px] text-xs mb-8 hover:text-white transition-colors">
                <FiArrowLeft />
                <span>All Collections</span>
              </Link>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6">
                {category?.name}
              </h1>
              <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                {category?.description || `Explore our exclusive selection of premium products in the ${category?.name} category.`}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white p-6 rounded-xl shadow-premium mb-16 flex items-center justify-between border border-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl">
              <FiShoppingBag />
            </div>
            <span className="font-black text-accent tracking-tight">{products.length} Items in Collection</span>
          </div>
          <Link to="/shop" className="text-gray-400 hover:text-primary font-black text-xs uppercase tracking-widest flex items-center space-x-2">
            <FiFilter />
            <span>Detailed Filters</span>
          </Link>
        </div>

        {error ? (
          <div className="text-center py-20 text-red-500 font-bold">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-black uppercase tracking-widest">No products in this collection yet.</p>
            <Link to="/shop" className="btn-primary mt-8 inline-flex px-10">Browse Other Items</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            {pages > 1 && (
              <div className="flex justify-center items-center mt-20 space-x-2">
                {[...Array(pages).keys()].map((x) => (
                  <button
                    key={x + 1}
                    onClick={() => setPageNumber(x + 1)}
                    className={`w-14 h-14 rounded-full font-black text-lg flex items-center justify-center transition-all ${
                      x + 1 === page
                        ? 'bg-primary text-white shadow-xl shadow-primary/30'
                        : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
                    }`}
                  >
                    {x + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;


