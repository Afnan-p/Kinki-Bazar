import React, { useState, useEffect } from 'react';
import Meta from '../components/Meta';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  FiLoader,
  FiCamera,
  FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { listProductDetails } from '../redux/slices/productSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/authSlice';
import ProductCard from '../components/ProductCard';
import Rating from '../components/Rating';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  useEffect(() => {
    if (product?.category?._id) {
      api.get(`/products?category=${product.category._id}&pageSize=5`)
        .then(res => setRelatedProducts(res.data.products.filter(p => p._id !== product._id).slice(0, 4)))
        .catch(console.error);
    }
  }, [product]);

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

  const handleBuyNow = () => {
    if (product.stock === 0) return;
    const directBuyItem = {
      product: product._id,
      name: product.name,
      image: (Array.isArray(product?.images) && product.images.length > 0) ? product.images[0].url : '',
      price: product.price,
      qty,
      stock: product.stock
    };
    navigate('/checkout', { state: { directBuyItem } });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploadingImage(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await api.post('/upload', formData, config);
      setReviewImages([...reviewImages, data.image]);
      setUploadingImage(false);
      toast.success('Image uploaded');
    } catch (error) {
      console.error(error);
      setUploadingImage(false);
      toast.error('Image upload failed');
    }
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
      await api.post(`/products/${id}/reviews`, { rating, comment, images: reviewImages });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      setReviewImages([]);
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
      <Meta 
        title={`${product.name} | Kinki Bazar`} 
        description={product.description.substring(0, 160)} 
        image={product.images?.[0]?.url} 
      />
      <div className="container mx-auto px-4 md:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[2px] text-gray-400 mb-12">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="opacity-30">/</span>
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span className="opacity-30">/</span>
          <span className="text-accent">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start relative">
          {/* Left: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 relative">
            <div className="sticky top-32">
              {/* Main Image Container */}
              <div className="w-full bg-[#f8f9fa] rounded-3xl border border-primary/20 shadow-sm overflow-hidden relative aspect-[4/5] group cursor-crosshair">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={product?.images?.[activeImg]?.url || 'https://via.placeholder.com/800x1000'}
                    alt={product?.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.15]"
                  />
                </motion.div>
              </div>
              
              {/* Thumbnails */}
              {(product?.images || []).length > 1 && (
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  {product.images.map((img, i) => (
                    <button 
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl p-1 bg-white border transition-all duration-300 ${
                        activeImg === i 
                          ? 'border-primary shadow-lg shadow-primary/20 scale-105' 
                          : 'border-gray-100 opacity-60 hover:opacity-100 hover:border-gray-300 hover:scale-105'
                      }`}
                    >
                      <img src={img?.url} alt={`Thumbnail ${i+1}`} className="w-full h-full object-cover rounded-[12px]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info (7 cols) */}
          <div className="lg:col-span-7 flex flex-col pt-4">
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
            <div className="flex flex-wrap items-center gap-4 mb-14">
              <div className="flex items-center bg-[#f8f9fa] rounded-full p-1.5 h-16 w-36 justify-between border border-gray-100">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-accent hover:text-primary transition-all shadow-sm active:scale-95"
                >
                  <FiMinus className="text-sm" />
                </button>
                <span className="text-lg font-black w-8 text-center text-accent">{qty}</span>
                <button 
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-accent hover:text-primary transition-all shadow-sm active:scale-95"
                >
                  <FiPlus className="text-sm" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 flex-grow">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="bg-[#0a0f16] text-white font-black h-16 rounded-full text-xs md:text-sm tracking-widest uppercase flex items-center justify-center space-x-3 hover:bg-primary transition-colors disabled:opacity-50"
                >
                  <FiShoppingCart className="text-lg" />
                  <span>Add to Basket</span>
                </button>

                <button 
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="btn-primary h-16 rounded-full text-xs md:text-sm flex items-center justify-center space-x-2 shadow-xl shadow-primary/30 disabled:opacity-50 disabled:shadow-none"
                >
                  <span>Acquire Now</span>
                </button>
              </div>
              
              <button 
                onClick={toggleWishlist}
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                  isWishlisted 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                    : 'border-gray-100 text-gray-400 hover:border-primary hover:text-primary bg-white'
                }`}
              >
                <FiHeart className={`text-xl ${isWishlisted ? 'fill-current' : ''}`} />
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
        <div className="mt-20 md:mt-32">
          <div className="flex flex-wrap justify-center gap-3 bg-gray-50/80 backdrop-blur-3xl p-2 rounded-full w-fit mx-auto border border-gray-100 shadow-sm mb-16">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[4px] transition-all duration-500 relative group overflow-hidden ${
                  activeTab === tab 
                    ? 'bg-[#071120] text-white shadow-xl scale-105' 
                    : 'text-gray-400 hover:text-[#071120]'
                }`}
              >
                <span className="relative z-10">{tab}</span>
                {activeTab === tab && (
                  <motion.div layoutId="pdpTabGlow" className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50" />
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
                  <p className="mb-16 text-[#071120]/80 text-xl md:text-2xl leading-relaxed font-medium tracking-tight max-w-4xl mx-auto text-center">
                    {product.description}
                  </p>
                  
                  <div className="bg-[#071120] p-12 md:p-16 rounded-[32px] border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
                    
                    <div className="text-center md:text-left relative z-10 flex-1">
                      <h4 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter italic">Crafted for Excellence</h4>
                      <p className="max-w-md mx-auto md:mx-0 text-white/60 text-lg leading-relaxed">
                        Every piece in our collection undergoes rigorous quality checks to ensure it meets the elite Kinki Bazar standard of luxury.
                      </p>
                    </div>
                    
                    <div className="w-24 h-24 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-primary shadow-2xl relative z-10 group hover:scale-110 transition-transform">
                      <FiCheckCircle className="text-4xl" />
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
                    <div key={i} className="flex justify-between items-center p-8 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
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
                              className="p-10 bg-white border border-gray-100 rounded-2xl shadow-sm group hover:shadow-xl transition-all duration-500"
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
                              <p className="text-gray-500 text-lg leading-relaxed italic mb-4">"{review.comment}"</p>
                              {review.images && review.images.length > 0 && (
                                <div className="flex gap-4 mt-4">
                                  {review.images.map((img, idx) => (
                                    <div key={idx} className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                                      <img src={img.url} className="w-full h-full object-cover" alt="Review upload" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <FiMessageSquare className="text-5xl text-gray-200 mx-auto mb-6" />
                            <p className="text-gray-400 font-black uppercase tracking-widest">No reviews yet. Be the first!</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Submission Form */}
                    <div className="lg:col-span-5">
                      <div className="sticky top-32">
                        <div className="bg-accent p-12 rounded-xl text-white shadow-3xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                          
                          <h3 className="text-3xl font-black tracking-tighter mb-4">Leave a Review</h3>
                          <p className="text-white/60 mb-10 text-sm font-medium">Share your experience with this premium piece to help our community.</p>
                          
                          {!userInfo ? (
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
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
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-white placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all min-h-[150px] resize-none"
                                />
                              </div>

                              <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[4px] text-white/40 ml-2">Add Photos</label>
                                <div className="flex flex-wrap gap-4 items-center">
                                  {reviewImages.map((img, idx) => (
                                    <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/20">
                                      <img src={img.url} className="w-full h-full object-cover" alt="Upload preview" />
                                      <button 
                                        type="button"
                                        onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-red-600 transition-colors"
                                      >
                                        <FiX className="text-xs" />
                                      </button>
                                    </div>
                                  ))}
                                  <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-colors cursor-pointer group">
                                    {uploadingImage ? <FiLoader className="animate-spin text-xl" /> : <FiCamera className="text-xl mb-1 group-hover:scale-110 transition-transform" />}
                                    <input type="file" accept="image/*" className="hidden" onChange={uploadFileHandler} disabled={uploadingImage} />
                                  </label>
                                </div>
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-40 mb-20 border-t border-gray-100 pt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-primary font-black uppercase tracking-[6px] text-[10px] mb-4 block">
                  Curated Match
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-[#0B1020] tracking-tighter italic">
                  You May Also <span className="text-primary text-glow">Like</span>
                </h2>
              </div>
              <Link to="/shop" className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 hover:text-primary transition-colors flex items-center group">
                View All <FiPlus className="ml-2 group-hover:rotate-90 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              <AnimatePresence>
                {relatedProducts.map(prod => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;


