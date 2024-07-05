import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from '../../api/apiService';

const initialState = {
    attachments: [],
    loading: false,
    error: null,
};

export const fetchAttachments = createAsyncThunk(
    'attachments/fetchAttachments',
    async (taskId, { rejectWithValue }) => {
        try {
            const response = await apiService.getAttachments(taskId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const attachmentSlice = createSlice({
    name: 'attachments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAttachments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAttachments.fulfilled, (state, action) => {
                state.attachments = action.payload;
                state.loading = false;
            })
            .addCase(fetchAttachments.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    }
});

export default attachmentSlice.reducer;