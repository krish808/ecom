import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import AuthRoute from "./routes/AuthRoute";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import AdminProducts from "./pages/AdminProducts";
import Cart from "./pages/Cart";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/signup"
          element={
            <AuthRoute type="public">
              <Signup />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute type="public">
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthRoute type="private">
              <Dashboard />
            </AuthRoute>
          }
        />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route
          path="/admin/products"
          element={
            <AuthRoute type="private" role="admin">
              <AdminProducts />
            </AuthRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default App;
