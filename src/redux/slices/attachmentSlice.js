import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../api/apiService';

export const fetchAttachments = createAsyncThunk('attachments/fetchAttachments', async (taskId) => {
  const response = await apiService.getAttachments(taskId);
  return response.attachments;
});

export const uploadAttachment = createAsyncThunk('attachments/uploadAttachment', async ({ taskId, attachment }) => {
  const formData = new FormData();
  formData.append('file', attachment);
  formData.append('task_id', taskId);

  const response = await fetch('http://localhost/todo-app/uploadAttachment.php', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  if (result.message === 'File uploaded successfully') {
    return { id: result.file_id, task_id: taskId, file_path: result.file_path };
  } else {
    throw new Error('Attachment upload failed');
  }
});

export const deleteAttachment = createAsyncThunk('attachments/deleteAttachment', async (attachmentId) => {
    const response = await apiService.deleteAttachment({ id: attachmentId });
    return attachmentId; // Return the attachmentId for updating state
});

const attachmentSlice = createSlice({
  name: 'attachments',
  initialState: {
    attachments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchAttachments.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchAttachments.fulfilled, (state, action) => {
          state.loading = false;
          state.attachments = action.payload;
        })
        .addCase(fetchAttachments.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(uploadAttachment.pending, (state) => {
          state.loading = true;
        })
        .addCase(uploadAttachment.fulfilled, (state, action) => {
          state.loading = false;
          if (Array.isArray(state.attachments)) {
            state.attachments.push(action.payload);
          } else {
            state.attachments = [action.payload];
          }
        })
        .addCase(uploadAttachment.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(deleteAttachment.pending, (state) => {
          state.loading = true;
        })
        .addCase(deleteAttachment.fulfilled, (state, action) => {
          state.loading = false;
          state.attachments = state.attachments.filter(attachment => attachment.id !== action.payload.id);
        })
        .addCase(deleteAttachment.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
  },
});

export default attachmentSlice.reducer;
