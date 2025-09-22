import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // 🔥 Redirect after login success
  useEffect(() => {
    if (token) {
      navigate("/"); // change "/home" to your homepage route
    }
  }, [token, navigate]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "300px" }}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          style={{ marginTop: "1rem" }}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </form>

      {error && (
        <Typography color="error" style={{ marginTop: "1rem" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Login;
