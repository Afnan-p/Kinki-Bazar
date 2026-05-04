import React, { useState, useEffect, useRef } from 'react';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiLayers, 
  FiX, 
  FiCheck, 
  FiCamera, 
  FiUploadCloud, 
  FiStar,
  FiLoader 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [currentCategory, setCurrentCategory] = useState({ 
    name: '', 
    description: '',
    isFeatured: false 
  });

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch categories');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setCurrentCategory({
        _id: cat._id,
        name: cat.name,
        description: cat.description || '',
        isFeatured: cat.isFeatured || false
      });
      setPreview(cat.image?.url || null);
      setEditMode(true);
    } else {
      setCurrentCategory({ name: '', description: '', isFeatured: false });
      setPreview(null);
      setEditMode(false);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', currentCategory.name);
    formData.append('description', currentCategory.description);
    formData.append('isFeatured', currentCategory.isFeatured);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editMode) {
        await api.put(`/categories/${currentCategory._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = (Array.isArray(categories) ? categories : []).filter(cat => 
    cat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 gap-6">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-primary text-xl" />
          <input 
            type="text" 
            placeholder="Search collections..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-16 pr-6 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold"
          />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center space-x-3 w-full md:w-auto justify-center h-16 px-10 shadow-xl shadow-primary/20"
        >
          <FiPlus className="text-xl" />
          <span className="text-lg">Add New Category</span>
        </button>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-[48px] shadow-premium border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center space-y-4">
            <FiLoader className="text-4xl text-primary animate-spin mx-auto" />
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Curating Collections...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-8 font-black uppercase text-[10px] tracking-[4px] text-gray-400">Preview</th>
                  <th className="p-8 font-black uppercase text-[10px] tracking-[4px] text-gray-400">Category Name</th>
                  <th className="p-8 font-black uppercase text-[10px] tracking-[4px] text-gray-400">Status</th>
                  <th className="p-8 font-black uppercase text-[10px] tracking-[4px] text-gray-400">Description</th>
                  <th className="p-8 font-black uppercase text-[10px] tracking-[4px] text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCategories.map((cat) => (
                  <tr key={cat?._id} className="group hover:bg-gray-50/30 transition-all duration-300">
                    <td className="p-8">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                        <img 
                          src={cat?.image?.url || 'https://via.placeholder.com/150'} 
                          alt={cat.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="font-black text-accent text-lg">{cat?.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">/{cat?.slug}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      {cat.isFeatured ? (
                        <span className="inline-flex items-center space-x-2 px-4 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-100">
                          <FiStar className="fill-current" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gray-100 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <span>Standard</span>
                        </span>
                      )}
                    </td>
                    <td className="p-8 max-w-xs">
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {cat?.description || 'No description provided.'}
                      </p>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => handleOpenModal(cat)}
                          className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary hover:shadow-lg transition-all flex items-center justify-center group/btn"
                        >
                          <FiEdit2 className="text-lg group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat?._id)}
                          className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-500 hover:shadow-lg transition-all flex items-center justify-center group/btn"
                        >
                          <FiTrash2 className="text-lg group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCategories.length === 0 && (
              <div className="p-20 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                  <FiLayers className="text-4xl" />
                </div>
                <p className="text-gray-400 font-bold">No collections found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Management Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => !submitting && setIsModalOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[56px] shadow-3xl w-full max-w-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl">
                    <FiLayers />
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter">{editMode ? 'Edit Collection' : 'New Collection'}</h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  disabled={submitting}
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: Image Upload */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 ml-2">Collection Cover</label>
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="relative aspect-square rounded-[40px] overflow-hidden border-4 border-dashed border-gray-100 hover:border-primary transition-all cursor-pointer group bg-gray-50/50"
                    >
                      {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-gray-300">
                          <FiUploadCloud className="text-5xl group-hover:text-primary transition-colors" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Click to Upload</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white backdrop-blur-sm">
                        <FiCamera className="text-3xl" />
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*" 
                    />
                  </div>

                  {/* Right: Info */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 ml-2">Display Name</label>
                      <input 
                        type="text" 
                        value={currentCategory.name}
                        onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-5 px-8 focus:bg-white focus:border-primary transition-all font-black text-accent" 
                        placeholder="e.g. Modern Ceramics"
                        required 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-[32px] border border-gray-100 cursor-pointer group" onClick={() => setCurrentCategory({...currentCategory, isFeatured: !currentCategory.isFeatured})}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${currentCategory.isFeatured ? 'bg-yellow-400 text-white shadow-lg' : 'bg-white text-gray-300'}`}>
                        <FiStar className={currentCategory.isFeatured ? 'fill-current' : ''} />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-black text-sm text-accent">Feature This</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Promote on Home Page</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${currentCategory.isFeatured ? 'border-yellow-400 bg-yellow-400' : 'border-gray-200'}`}>
                        {currentCategory.isFeatured && <FiCheck className="text-white text-xs" />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 ml-2">Collection Narrative</label>
                  <textarea 
                    rows="4" 
                    value={currentCategory.description}
                    onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                    className="w-full bg-gray-50 border border-transparent rounded-[32px] py-6 px-8 focus:bg-white focus:border-primary transition-all font-bold resize-none" 
                    placeholder="Describe the aesthetic and purpose of this collection..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full btn-primary h-20 flex items-center justify-center space-x-4 shadow-2xl shadow-primary/30 rounded-[32px] disabled:opacity-50"
                >
                  {submitting ? (
                    <FiLoader className="animate-spin text-2xl" />
                  ) : (
                    <>
                      <FiCheck className="text-2xl" />
                      <span className="text-xl font-black">{editMode ? 'Update Collection' : 'Launch Collection'}</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryList;
