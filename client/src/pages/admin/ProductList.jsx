import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, deleteProduct } from '../../redux/slices/productSlice';
import toast from 'react-hot-toast';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [keyword, setKeyword] = React.useState('');

  React.useEffect(() => {
    dispatch(listProducts({ keyword }));
  }, [dispatch, keyword]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id)).then(() => {
        toast.success('Product deleted');
        dispatch(listProducts({ keyword }));
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96 mb-4 md:mb-0">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <Link to="/admin/product/create" className="btn-primary flex items-center space-x-2 w-full md:w-auto justify-center">
          <FiPlus />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Product</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Category</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Price</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Stock</th>
                  <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(Array.isArray(products) ? products : []).map((product) => (
                  <tr key={product?._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img src={product?.images?.[0]?.url || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-sm leading-tight">{product?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{product?.category?.name || 'Uncategorized'}</span>
                    </td>
                    <td className="p-6 font-black text-sm">${product?.price || 0}</td>
                    <td className="p-6 text-sm font-bold text-gray-500">{product?.stock || 0}</td>
                    <td className="p-6">
                      <div className="flex items-center space-x-3">
                        <Link to={`/product/${product?._id}`} className="p-2 text-gray-400 hover:text-primary transition-colors"><FiEye /></Link>
                        <Link to={`/admin/product/${product?._id}/edit`} className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><FiEdit2 /></Link>
                        <button onClick={() => deleteHandler(product?._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;


