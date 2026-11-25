import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrder, getUserOrders } from "../../services/orderService";

// Place order
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData) => {
    return await createOrder(orderData);
  }
);

// Fetch user orders
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId) => {
    return await getUserOrders(userId);
  }
);

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    items: [],
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default orderSlice.reducer;