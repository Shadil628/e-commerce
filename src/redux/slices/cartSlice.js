
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, createCart, updateCart } from "../../services/cartServices";// Fetch cart from database
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId) => {
    const carts = await getCart(userId);

    return carts[0] || {
      id: null,
      userId,
      items: []
    };
  }
);

// Save cart to database
export const saveCart = createAsyncThunk(
  "cart/saveCart",
  async ({ userId, items }) => {
    const carts = await getCart(userId);

    if (carts.length > 0) {
      return await updateCart(carts[0].id, {
        items
      });
    }

    return await createCart({
      userId,
      items
    });
  }
);

const initialState = {
  items: [],
  dbCartId: null,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      const selectedColor = product.selectedColor || "";

      const existing = state.items.find(
        (item) =>
          item.id === product.id &&
          (item.selectedColor || "") === selectedColor
      );

      if (existing) {
        if (existing.quantity < product.stock) {
          existing.quantity += 1;
        }
      } else {
        if (product.stock > 0) {
          state.items.push({
            ...product,
            selectedColor,
            quantity: 1
          });
        }
      }
    },

    removeFromCart: (state, action) => {
      const { id, selectedColor } = action.payload;

      state.items = state.items.filter(
        (item) =>
          !(
            item.id === id &&
            (item.selectedColor || "") === (selectedColor || "")
          )
      );
    },

    clearCart: (state) => {
      state.items = [];
    },

    updateQuantity: (state, action) => {
      const { id, selectedColor, quantity } = action.payload;

      const item = state.items.find(
        (product) =>
          product.id === id &&
          (product.selectedColor || "") === (selectedColor || "")
      );

      if (item && quantity >= 1 && quantity <= item.stock) {
        item.quantity = quantity;
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.dbCartId = action.payload.id;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveCart.fulfilled, (state, action) => {
        state.dbCartId = action.payload.id;
      });
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
