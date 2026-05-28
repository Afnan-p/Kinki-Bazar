import React, { useState, useEffect } from 'react';
import { FiUpload, FiX, FiPlus, FiArrowLeft, FiCheck, FiLoader } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, updateProduct, clearProductError } from '../../redux/slices/productSlice';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ProductEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isSignatureVault, setIsSignatureVault] = useState(false);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);

  const [categories, setCategories] = useState([]);

  const { loading, error, success, product } = useSelector((state) => state.products);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product._id === id) {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category?._id || product.category);
      setStock(product.stock);
      setImages(product.images || []);
      setIsFeatured(product.isFeatured || false);
      setIsTrending(product.isTrending || false);
      setIsBestSeller(product.isBestSeller || false);
      setIsNewArrival(product.isNewArrival || false);
      setIsSignatureVault(product.isSignatureVault || false);
      setSpecs(product.specifications?.length > 0 ? product.specifications : [{ key: '', value: '' }]);
    }
  }, [product, id]);

  useEffect(() => {
    if (success) {
      toast.success('Product updated successfully!');
      dispatch(clearProductError());
      navigate('/admin/products');
    }
    if (error) {
      toast.error(error);
      dispatch(clearProductError());
    }
  }, [success, error, navigate, dispatch]);

  const handleAddSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const handleRemoveSpec = (index) => setSpecs(specs.filter((_, i) => i !== index));
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadedImages = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        
        const { data } = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (data.success) {
          uploadedImages.push(data.image);
        }
      }

      setImages([...images, ...uploadedImages]);
      setUploading(false);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Upload Error:', error);
      setUploading(false);
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  const removeImageHandler = (public_id) => {
    setImages(images.filter((img) => img.public_id !== public_id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error('Please upload at least one image');
    
    dispatch(updateProduct({
      _id: id,
      name,
      price,
      description,
      category,
      stock,
      images,
      isFeatured,
      isTrending,
      isBestSeller,
      isNewArrival,
      isSignatureVault,
      specifications: specs.filter(s => s.key && s.value)
    }));
  };

  if (loading && !product) return (
    <div className="flex items-center justify-center h-96">
      <FiLoader className="text-4xl text-primary animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center space-x-4 mb-10">
        <Link to="/admin/products" className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 shadow-sm">
          <FiArrowLeft />
        </Link>
        <h2 className="text-3xl font-black">Edit Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-black mb-4 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-3 text-sm">1</span>
              General Information
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Product Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Ceramic Plate" 
                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-4 px-6 focus:outline-none focus:border-primary transition-all" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
              <textarea 
                rows="6" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product in detail..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-4 px-6 focus:outline-none focus:border-primary transition-all resize-none" 
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Price ($)</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg py-4 px-6 focus:outline-none focus:border-primary transition-all" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Stock Quantity</label>
                <input 
                  type="number" 
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg py-4 px-6 focus:outline-none focus:border-primary transition-all" 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-black mb-4 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-3 text-sm">2</span>
              Product Specifications
            </h3>
            
            <div className="space-y-4">
              {specs.map((spec, index) => (
                <div key={index} className="flex space-x-4">
                  <input 
                    type="text" 
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    placeholder="Key (e.g. Color)" 
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-lg py-3 px-6 focus:outline-none focus:border-primary transition-all" 
                  />
                  <input 
                    type="text" 
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    placeholder="Value (e.g. Red)" 
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-lg py-3 px-6 focus:outline-none focus:border-primary transition-all" 
                  />
                  <button type="button" onClick={() => handleRemoveSpec(index)} className="p-3 text-gray-300 hover:text-red-500 transition-colors"><FiX /></button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={handleAddSpec}
                className="flex items-center space-x-2 text-primary font-bold text-sm hover:underline py-2"
              >
                <FiPlus /> <span>Add Specification</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-black mb-4 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-3 text-sm">3</span>
              Media
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {images.map((img) => (
                <div key={img.public_id} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={img.url} className="w-full h-full object-cover" alt="" />
                  <button 
                    type="button"
                    onClick={() => removeImageHandler(img.public_id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>

            <div className="relative border-2 border-dashed border-gray-100 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
              <input 
                type="file" 
                multiple
                onChange={uploadFileHandler}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 mb-4 group-hover:text-primary">
                {uploading ? <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div> : <FiUpload className="text-2xl" />}
              </div>
              <p className="text-sm font-bold text-gray-500">Drop files here or click to upload</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-black mb-4 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-3 text-sm">4</span>
              Organization
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg py-4 px-6 focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 space-y-4">
                {[
                  { label: 'Featured', value: isFeatured, setter: setIsFeatured },
                  { label: 'Trending', value: isTrending, setter: setIsTrending },
                  { label: 'Best Seller', value: isBestSeller, setter: setIsBestSeller },
                  { label: 'New Arrival', value: isNewArrival, setter: setIsNewArrival },
                  { label: 'Signature Vault', value: isSignatureVault, setter: setIsSignatureVault },
                ].map((flag) => (
                  <label key={flag.label} className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm font-bold text-gray-600">{flag.label} Product</span>
                    <input 
                      type="checkbox" 
                      checked={flag.value}
                      onChange={(e) => flag.setter(e.target.checked)}
                      className="w-6 h-6 rounded-lg border-gray-200 text-primary focus:ring-primary" 
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || uploading}
            className="w-full btn-primary h-16 flex items-center justify-center space-x-3 shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FiCheck className="text-2xl" />}
            <span className="text-lg font-black">Update Product</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;


