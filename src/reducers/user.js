import { createSlice } from "@reduxjs/toolkit";

import { getPayload } from "../utils/token";

const initialState = {
	name: "",
	email: "",
};

const loadedUser = getPayload();

const userSlice = createSlice({
	name: "user",
	initialState: loadedUser || initialState,
	reducers: {
		setUser: (state, action) => {
			state = {
				...state,
				...action.payload,
			};
			return state;
		},
		removeUser: (state) => {
			state = { ...initialState };
			return state;
		},
	},
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
