import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import {
  fetchProductById,
  clearProduct,
} from "../features/product/productSlice";
import { addToCart } from "../features/cart/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductById(id));

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: 1,
        image: product.image,
      })
    );
  };

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  if (error)
    return (
      <Typography sx={{ p: 3 }} color="error">
        {error}
      </Typography>
    );
  if (!product) return <Typography sx={{ p: 3 }}>Product not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        {product.image && (
          <CardMedia
            component="img"
            sx={{ width: { xs: "100%", md: 400 }, objectFit: "cover" }}
            image={product.image}
            alt={product.name}
          />
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            ${product.price}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {product.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {product.category}
          </Typography>
          <Typography
            variant="body2"
            color={product.stock > 0 ? "green" : "red"}
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDetails;
