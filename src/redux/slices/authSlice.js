
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers, registerUser as createUser } from "../../services/userService";

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData) => {
    const users = await getUsers();

    const exists = users.find(
      (user) => user.email === userData.email
    );

    if (exists) {
      throw new Error("Email already registered");
    }

    return await createUser(userData);
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const users = await getUsers();

    const user = users.find(
      (user) =>
        user.email === email &&
        user.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    return user;
  }
);

const savedUser = localStorage.getItem("user");

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    loading: false,
    error: null
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
