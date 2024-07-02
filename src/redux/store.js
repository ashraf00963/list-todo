import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import listReducer from './slices/listSlice';
import taskReducer from './slices/taskSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        lists: listReducer,
        tasks: taskReducer,
    },
});