import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  updateProduct,
} from "../../features/product/productSlice";
import {
  uploadProductImage,
  resetUpload,
} from "../../features/upload/uploadSlice";

const ProductForm = ({ product = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    stock: product?.stock || "",
  });

  const dispatch = useDispatch();
  const {
    url,
    loading: uploadLoading,
    error: uploadError,
  } = useSelector((state) => state.upload);

  useEffect(() => {
    if (url) {
      setFormData((prev) => ({ ...prev, image: url }));
    }
  }, [url]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) dispatch(uploadProductImage(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product) {
      dispatch(updateProduct({ id: product._id, ...formData }));
    } else {
      dispatch(createProduct(formData));
    }
    onSuccess?.();
    dispatch(resetUpload());
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: 500 }}>
      <Typography variant="h6" gutterBottom>
        {product ? "Update Product" : "Create Product"}
      </Typography>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={3}
        required
      />
      <TextField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Stock"
        name="stock"
        type="number"
        value={formData.stock}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <Box mt={2}>
        <Button variant="contained" component="label">
          Upload Image
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {uploadLoading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        {uploadError && (
          <Typography color="error" sx={{ ml: 2 }}>
            {uploadError}
          </Typography>
        )}
        {url && (
          <Box mt={2}>
            <img
              src={url}
              alt="Preview"
              style={{ width: "100%", maxHeight: 200 }}
            />
          </Box>
        )}
      </Box>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        {product ? "Update" : "Create"}
      </Button>
    </Box>
  );
};

export default ProductForm;
