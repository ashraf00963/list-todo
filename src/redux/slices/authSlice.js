import { createSlice } from "@reduxjs/toolkit";
import apiService from '../../api/apiService';

const initialState = {
    user: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        registerStart: (state) => {
            state.loading = true;
        },
        registerSuccess: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        registerFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, registerStart, registerSuccess, registerFailure, logout } = authSlice.actions;

export const loginUser = (credentials) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const user = await apiService.login(credentials);
        dispatch(loginSuccess(user));
    } catch (error) {
        dispatch(loginFailure(error.message));
    }
};

export const registerUser = (userData) => async (dispatch) => {
    dispatch(registerStart());
    try {
        const user = await apiService.register(userData);
        dispatch(registerSuccess(user));
    } catch (error) {
        dispatch(registerFailure(error.message));
    }
};

export default authSlice.reducer;