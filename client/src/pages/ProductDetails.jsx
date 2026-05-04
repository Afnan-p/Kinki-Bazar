import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FiHeart, 
  FiShoppingCart, 
  FiShare2, 
  FiMinus, 
  FiPlus, 
  FiCheckCircle, 
  FiTruck, 
  FiShield,
  FiStar,
  FiMessageSquare,
  FiSend,
  FiLoader
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { listProductDetails } from '../redux/slices/productSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/authSlice';
import Rating from '../components/Rating';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { product, loading, error } = useSelector((state) => state.products);
  const { wishlist, userInfo } = useSelector((state) => state.auth);

  const isWishlisted = product && wishlist.some(
    (item) => (item._id || item) === product._id
  );

  useEffect(() => {
    dispatch(listProductDetails(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  const toggleWishlist = () => {
    if (!userInfo) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: (Array.isArray(product?.images) && product.images.length > 0) ? product.images[0].url : '',
      price: product.price,
      qty,
      stock: product.stock
    }));
    toast.success('Added to cart!');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please add a comment');
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      dispatch(listProductDetails(id)); // Refresh product details
      setSubmittingReview(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (error) return <div className="container mx-auto px-6 py-20 text-center text-red-500 font-black">{error}</div>;
  if (!product) return null;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[2px] text-gray-400 mb-12">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="opacity-30">/</span>
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span className="opacity-30">/</span>
          <span className="text-accent">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[4/5] rounded-[48px] overflow-hidden border border-gray-50 shadow-premium group"
            >
              <img 
                src={product?.images?.[activeImg]?.url || 'https://via.placeholder.com/800x1000'} 
                alt={product?.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4 px-4">
              {(product?.images || []).map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImg === i ? 'border-primary shadow-xl shadow-primary/20 scale-105' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img src={img?.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="mb-10">
              <div className="flex items-center space-x-3 mb-6">
                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[3px] px-5 py-2 rounded-full">
                  {product.category?.name || 'Premium Series'}
                </span>
                {product.stock > 0 ? (
                  <span className="bg-emerald-50 text-emerald-500 text-[10px] font-black uppercase tracking-[3px] px-5 py-2 rounded-full flex items-center">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-[3px] px-5 py-2 rounded-full">Out of Stock</span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-accent mb-6 leading-[1.1] tracking-tighter">
                {product.name}
              </h1>

              <div className="flex items-center space-x-6 pb-8 border-b border-gray-100">
                <Rating value={product.ratings} text={`${product.numOfReviews} Verified Reviews`} size="text-lg" />
              </div>
            </div>

            <div className="flex items-baseline space-x-4 mb-10">
              <span className="text-5xl font-black text-primary tracking-tighter">${product.price}</span>
              {product.discountPrice > 0 && (
                <span className="text-2xl text-gray-300 line-through font-bold">${product.discountPrice}</span>
              )}
            </div>

            <p className="text-gray-500 leading-relaxed mb-12 text-lg font-medium">
              {product.description}
            </p>

            {/* Qty & Add to Cart */}
            <div className="flex flex-wrap items-center gap-6 mb-12">
              <div className="flex items-center bg-gray-50 rounded-3xl p-2 h-20 w-48 justify-between border border-gray-100 shadow-inner">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-accent hover:text-primary transition-all shadow-sm active:scale-90"
                >
                  <FiMinus />
                </button>
                <span className="text-2xl font-black w-10 text-center text-accent">{qty}</span>
                <button 
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-accent hover:text-primary transition-all shadow-sm active:scale-90"
                >
                  <FiPlus />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-grow btn-primary h-20 text-xl flex items-center justify-center space-x-4 shadow-xl shadow-primary/30 disabled:opacity-50 disabled:shadow-none"
              >
                <FiShoppingCart className="text-2xl" />
                <span>ADD TO BASKET</span>
              </button>
              
              <button 
                onClick={toggleWishlist}
                className={`w-20 h-20 rounded-3xl border-2 flex items-center justify-center transition-all duration-500 ${
                  isWishlisted 
                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-110' 
                    : 'border-gray-100 text-gray-300 hover:border-primary hover:text-primary'
                }`}
              >
                <FiHeart className={`text-2xl ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-gray-50">
              <div className="flex items-center space-x-5 group">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
                  <FiTruck />
                </div>
                <div>
                  <h4 className="font-black text-accent text-sm tracking-tight">Express Logistics</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">2-3 Business Days</p>
                </div>
              </div>
              <div className="flex items-center space-x-5 group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
                  <FiShield />
                </div>
                <div>
                  <h4 className="font-black text-accent text-sm tracking-tight">Buyer Protection</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Certified Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-32">
          <div className="flex flex-wrap border-b border-gray-100 mb-16 justify-center md:justify-start gap-4 md:gap-0">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-6 font-black text-xs uppercase tracking-[4px] relative transition-all duration-300 ${
                  activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-accent'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary rounded-t-full shadow-lg shadow-primary/20" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div 
                  key="desc"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-gray-500 leading-loose text-lg font-medium text-center md:text-left"
                >
                  <p className="mb-8">{product.description}</p>
                  <div className="bg-gray-50 p-12 rounded-[48px] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-center md:text-left">
                      <h4 className="text-2xl font-black text-accent mb-4">Crafted for Excellence</h4>
                      <p className="max-w-md text-base">Every piece in our collection undergoes rigorous quality checks to ensure it meets the Kinki Bazar standard of luxury.</p>
                    </div>
                    <div className="w-32 h-32 rounded-full border-8 border-white bg-primary flex items-center justify-center text-white shadow-xl">
                      <FiCheckCircle className="text-5xl" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div 
                  key="specs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {(product?.specifications || []).map((spec, i) => (
                    <div key={i} className="flex justify-between items-center p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
                      <span className="font-black text-[10px] uppercase tracking-widest text-gray-400">{spec?.key}</span>
                      <span className="font-black text-accent text-lg">{spec?.value}</span>
                    </div>
                  ))}
                  {product?.specifications?.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-400 font-black uppercase tracking-widest">No specifications listed</div>
                  )}
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div 
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-16"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left: Review List */}
                    <div className="lg:col-span-7 space-y-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-3xl font-black text-accent tracking-tighter">Community Feedback</h3>
                        <div className="px-4 py-2 bg-accent text-white rounded-xl font-black text-xs uppercase tracking-widest">
                          {product.reviews?.length || 0} Reviews
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {(product.reviews || []).length > 0 ? (
                          product.reviews.map((review, i) => (
                            <motion.div 
                              key={review._id} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="p-10 bg-white border border-gray-100 rounded-[40px] shadow-sm group hover:shadow-xl transition-all duration-500"
                            >
                              <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center space-x-5">
                                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-black shadow-inner">
                                    {review.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="font-black text-accent text-lg">{review.name}</h4>
                                    <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">
                                      {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                  </div>
                                </div>
                                <Rating value={review.rating} size="text-sm" />
                              </div>
                              <p className="text-gray-500 text-lg leading-relaxed italic">"{review.comment}"</p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                            <FiMessageSquare className="text-5xl text-gray-200 mx-auto mb-6" />
                            <p className="text-gray-400 font-black uppercase tracking-widest">No reviews yet. Be the first!</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Submission Form */}
                    <div className="lg:col-span-5">
                      <div className="sticky top-32">
                        <div className="bg-accent p-12 rounded-[56px] text-white shadow-3xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                          
                          <h3 className="text-3xl font-black tracking-tighter mb-4">Leave a Review</h3>
                          <p className="text-white/60 mb-10 text-sm font-medium">Share your experience with this premium piece to help our community.</p>
                          
                          {!userInfo ? (
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">
                              <p className="font-bold mb-6">Please login to share your thoughts.</p>
                              <Link to="/login" className="btn-primary w-full inline-flex">Login Now</Link>
                            </div>
                          ) : (
                            <form onSubmit={submitReviewHandler} className="space-y-8">
                              <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[4px] text-white/40 ml-2">Your Rating</label>
                                <div className="flex space-x-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                                  {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                      key={num}
                                      type="button"
                                      onClick={() => setRating(num)}
                                      className={`text-2xl transition-all duration-300 ${
                                        rating >= num ? 'text-primary drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]' : 'text-white/20 hover:text-white/40'
                                      }`}
                                    >
                                      <FiStar className={rating >= num ? 'fill-current' : ''} />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[4px] text-white/40 ml-2">Detailed Comment</label>
                                <textarea
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  placeholder="What did you love about this piece?"
                                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all min-h-[150px] resize-none"
                                />
                              </div>

                              <button
                                type="submit"
                                disabled={submittingReview}
                                className="w-full h-16 bg-primary text-accent font-black rounded-2xl flex items-center justify-center space-x-3 hover:bg-white transition-all shadow-xl shadow-black/20 group disabled:opacity-50"
                              >
                                {submittingReview ? (
                                  <FiLoader className="animate-spin text-2xl" />
                                ) : (
                                  <>
                                    <span>POST REVIEW</span>
                                    <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                  </>
                                )}
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
