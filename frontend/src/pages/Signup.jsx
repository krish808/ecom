import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../features/auth/authSlice";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const Signup = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser(form));
  };

  return (
    <Box style={{ maxWidth: "400px", margin: "auto", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Signup
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          style={{ marginTop: "20px" }}
        >
          {loading ? <CircularProgress size={24} /> : "Signup"}
        </Button>
      </form>

      {/* ✅ Show messages */}
      {success && (
        <Typography color="green" style={{ marginTop: "15px" }}>
          {success}
        </Typography>
      )}
      {error && (
        <Typography color="error" style={{ marginTop: "15px" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Signup;
