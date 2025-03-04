import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("auth")) || null;

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        addAuth: (state, action) => {
            localStorage.setItem("auth", JSON.stringify(action.payload));
            return action.payload;
        },
        removeAuth: () => {
            localStorage.removeItem("auth");
            return null;
        },
    },
});

export const { addAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;
