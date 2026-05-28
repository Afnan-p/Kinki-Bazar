import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getSiteSettings = createAsyncThunk(
  'settings/getSettings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/settings');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSiteSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/settings', settingsData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    data: null,
    loading: false,
    error: null,
    updateLoading: false,
    updateSuccess: false,
    updateError: null,
  },
  reducers: {
    resetSettingsUpdate: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSiteSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSiteSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getSiteSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSiteSettings.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.updateError = null;
      })
      .addCase(updateSiteSettings.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.data = action.payload;
      })
      .addCase(updateSiteSettings.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  }
});

export const { resetSettingsUpdate } = settingsSlice.actions;
export default settingsSlice.reducer;
