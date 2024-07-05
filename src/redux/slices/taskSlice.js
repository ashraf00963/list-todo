import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../api/apiService';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async ({ listId, userId }) => {
  const response = await apiService.getTasks(listId, userId);
  return response.tasks; // Return only the tasks array
});

export const addTask = createAsyncThunk('tasks/addTask', async (task) => {
  const response = await apiService.addTask(task);
  return response;
});

export const updateTaskNote = createAsyncThunk('tasks/updateTaskNote', async ({ taskId, note }) => {
  const response = await apiService.updateTaskNote(taskId, note);
  return response;
});

export const updateTaskPosition = createAsyncThunk('tasks/updateTaskPosition', async ({ id, position }) => {
  const task = { id, position }; // Assuming the task object structure
  const response = await apiService.updateTask(task);
  return response;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
  await apiService.deleteTask(taskId);
  return taskId;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.tasks)) {
          state.tasks.push(action.payload);
        } else {
          state.tasks = [action.payload];
        }
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTaskNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskNote.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.tasks)) {
          const index = state.tasks.findIndex(task => task.id === action.payload.id);
          if (index !== -1) {
            state.tasks[index] = { ...state.tasks[index], ...action.payload };
          }
        } else {
          state.tasks = []; // Reset to an empty array to prevent further errors
        }
      })
      .addCase(updateTaskNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTaskPosition.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskPosition.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.tasks)) {
          const index = state.tasks.findIndex(task => task.id === action.payload.id);
          if (index !== -1) {
            state.tasks[index].position = action.payload.position;
          }
        } else {
          state.tasks = []; // Reset to an empty array to prevent further errors
        }
      })
      .addCase(updateTaskPosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.tasks)) {
          state.tasks = state.tasks.filter(task => task.id !== action.payload);
        } else {
          state.tasks = []; // Reset to an empty array to prevent further errors
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default taskSlice.reducer;
