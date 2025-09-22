import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import AuthRoute from "./routes/AuthRoute";
import Dashboard from "./pages/Dashboard";

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
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App;
