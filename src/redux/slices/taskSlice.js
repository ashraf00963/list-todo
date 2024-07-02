import { createSlice } from "@reduxjs/toolkit";
import apiService from '../../api/apiService';

const initialState = {
    tasks: [],
    loading: false,
    error: null,
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        fetchTasksStart: (state) => {
            state.loading = true;
        },
        fetchTasksSuccess: (state, action) => {
            state.tasks = action.payload;
            state.loading = false;
        },
        fetchTasksFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addTask: (state, action) => {
            state.tasks.push(action.payload);
        },
        updateTask: (state, action) => {
            const index = state.tasks.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },
        removeTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
    },
});

export const { fetchTasksStart, fetchTasksSuccess, fetchTasksFailure, addTask, updateTask, removeTask } = taskSlice.actions;

export const fetchTasks = (listId) => async (dispatch) => {
    dispatch(fetchTasksStart());
    try {
        const tasks = await apiService.getTasks(listId);
        dispatch(fetchTasksSuccess(tasks));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
};

export const createTask = (task) => async (dispatch) => {
    try {
        const newTask = await apiService.addTask(task);
        dispatch(addTask(newTask));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
};

export const editTask = (task) => async (dispatch) => {
    try {
        const updatedTask = await apiService.updateTask(task);
        dispatch(updateTask(updatedTask));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
};

export const deleteTask = (taskId) => async (dispatch) => {
    try {
        await apiService.deleteTask(taskId);
        dispatch(removeTask(taskId));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
};

export default taskSlice.reducer;