import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../features/product/productSlice";
import ProductForm from "../components/admin/ProductForm";

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setOpenForm(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Button variant="contained" onClick={() => setOpenForm(true)}>
        Add Product
      </Button>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {items.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography>${product.price}</Typography>
                  <Typography>{product.category}</Typography>
                </CardContent>
                <CardActions>
                  {/* ✅ View product details */}
                  <Button
                    size="small"
                    component={Link}
                    to={`/products/${product._id}`}
                  >
                    View
                  </Button>
                  <Button size="small" onClick={() => handleEdit(product)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openForm} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          <ProductForm product={selectedProduct} onSuccess={handleClose} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductList;
