import { createSlice } from "@reduxjs/toolkit";
import apiService from '../../api/apiService';

const initialState = {
    lists: [],
    loading: false,
    error: null,
};

const listSlice = createSlice({
    name: 'lists',
    initialState,
    reducers: {
        fetchListsStart: (state) => {
            state.loading = true;
        },
        fetchListsSuccess: (state, action) => {
            state.lists = action.payload;
            state.loading = false;
        },
        fetchListsFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false; 
        },
        addList: (state, action) => {
            state.lists.push(action.payload);
        },
        removeList: (state, action) => {
            state.lists = state.lists.filter(list => list.id !== action.payload);
        },
    },
});

export const { fetchListsStart, fetchListsSuccess, fetchListsFailure, addList, removeList } = listSlice.actions;

export const fetchLists = (userId) => async (dispatch) => {
    dispatch(fetchListsStart());
    try {
        const lists = await apiService.getLists(userId);
        dispatch(fetchListsSuccess(lists));
    } catch (error) {
        dispatch(fetchListsFailure(error.message));
    }
};

export default listSlice.reducer;