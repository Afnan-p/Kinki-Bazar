import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const listProducts = createAsyncThunk(
  'products/listProducts',
  async ({ 
    keyword = '', 
    pageNumber = '', 
    pageSize = '',
    category = '', 
    price = '', 
    rating = '', 
    sort = '',
    isFeatured = '',
    isTrending = '',
    isBestSeller = '',
    isNewArrival = '',
    isSignatureVault = ''
  }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/products?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}&category=${category}&price=${price}&rating=${rating}&sort=${sort}&isFeatured=${isFeatured}&isTrending=${isTrending}&isBestSeller=${isBestSeller}&isNewArrival=${isNewArrival}&isSignatureVault=${isSignatureVault}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const listProductDetails = createAsyncThunk(
  'products/listProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (product, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/products', product);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/products/${product._id}`, product);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  pages: 1,
  page: 1,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.products = Array.isArray(payload.products) ? payload.products : [];
        state.pages = Number(payload.pages) || 1;
        state.page = Number(payload.page) || 1;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(listProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.product = {
          ...payload,
          images: Array.isArray(payload.images) ? payload.images : [],
          specifications: Array.isArray(payload.specifications) ? payload.specifications : []
        };
      })
      .addCase(listProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;

