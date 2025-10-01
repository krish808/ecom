import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For modal form
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open modal for add / edit
  const handleOpen = (product = null) => {
    setEditingProduct(product);
    setForm(
      product || {
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      }
    );
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save product
  const handleSave = async () => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, form);
      } else {
        await api.post("/products", form);
      }
      handleClose();
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving product");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting product");
    }
  };

  if (loading)
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography sx={{ mt: 10 }} color="error">
        {error}
      </Typography>
    );

  return (
    <Box sx={{ mt: 10, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Products
      </Typography>

      <Button variant="contained" onClick={() => handleOpen()}>
        Add Product
      </Button>

      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>${p.price}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleOpen(p)}>
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            value={form.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            fullWidth
            value={form.price}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Category"
            name="category"
            fullWidth
            value={form.category}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Stock"
            name="stock"
            fullWidth
            value={form.stock}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Image URL"
            name="image"
            fullWidth
            value={form.image}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingProduct ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminProducts;
