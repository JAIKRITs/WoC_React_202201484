import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: false, 
    userData: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: false, 
        userData: null, // Ensure this is initialized properly
    },
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData || {}; // Ensure userData is not undefined
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
