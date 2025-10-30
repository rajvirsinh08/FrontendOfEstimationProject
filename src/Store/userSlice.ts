import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  email: string | null;
  role: string | null; // 🟢 add this
}

const initialState: UserState = {
  token: null,
  email: null,
  role: null, // 🟢 add this
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ token: string; email: string; role: string }>
    ) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.role = action.payload.role; // 🟢 store role
    },
    clearUser: (state) => {
      state.token = null;
      state.email = null;
      state.role = null; // 🟢 reset role
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
