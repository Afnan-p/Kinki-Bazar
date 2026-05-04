import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/stats');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: {
      totalRevenue: 0,
      ordersCount: 0,
      usersCount: 0,
      productsCount: 0,
      recentOrders: [],
      chartData: []
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.stats = {
          totalRevenue: Number(payload.totalRevenue) || 0,
          ordersCount: Number(payload.ordersCount) || 0,
          usersCount: Number(payload.usersCount) || 0,
          productsCount: Number(payload.productsCount) || 0,
          recentOrders: Array.isArray(payload.recentOrders) ? payload.recentOrders : [],
          chartData: Array.isArray(payload.chartData) ? payload.chartData : []
        };
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
