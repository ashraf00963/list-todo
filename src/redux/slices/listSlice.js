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
        addListStart: (state) => {
            state.loading = true;
        },
        addListSuccess: (state, action) => {
            state.lists.push(action.payload);
            state.loading = false;
        },
        addListFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteListStart: (state) => {
            state.loading = true;
        },
        deleteListSuccess: (state, action) => {
            state.lists = state.lists.filter(list => list.id !== action.payload);
            state.loading = false;
        },
        deleteListFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { fetchListsStart, fetchListsSuccess, fetchListsFailure, addListStart, addListSuccess, addListFailure, deleteListStart, deleteListSuccess, deleteListFailure } = listSlice.actions;

export const fetchLists = (userId) => async (dispatch) => {
    dispatch(fetchListsStart());
    try {
        const lists = await apiService.getLists(userId);
        dispatch(fetchListsSuccess(lists));
    } catch (error) {
        dispatch(fetchListsFailure(error.message));
    }
};

export const addListAsync = (list) => async (dispatch) => {
    dispatch(addListStart());
    try {
        const newList = await apiService.addList(list);
        dispatch(addListSuccess(newList));
    } catch (error) {
        dispatch(addListFailure(error.message));
    }
};

export const deleteListAsync = (listId) => async (dispatch) => {
    dispatch(deleteListStart());
    try {
        await apiService.deleteList(listId);
        dispatch(deleteListSuccess(listId));
    } catch (error) {
        dispatch(deleteListFailure(error.message));
    }
}

export default listSlice.reducer;