import { configureStore, createReducer } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import productReducer from "./features/product/productSlice";
import uploadReducer from "./features/upload/uploadSlice";
import cartReducer from "./features/cart/cartSlice.jsx";
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    upload: uploadReducer,
    cart: cartReducer,
  },
});

export default store;
