import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor for adding JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => API.post('/users/login', data);
export const register = (data) => API.post('/users', data);
export const getProfile = () => API.get('/users/profile');

export const fetchProducts = (keyword = '', pageNumber = '') => 
  API.get(`/products?keyword=${keyword}&pageNumber=${pageNumber}`);
export const fetchProductDetails = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const fetchCategories = () => API.get('/categories');
export const createCategory = (data) => API.post('/categories', data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/myorders');
export const getOrderDetails = (id) => API.get(`/orders/${id}`);
export const getAllOrders = () => API.get('/orders');

export default API;
