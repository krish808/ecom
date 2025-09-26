import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../features/product/productSlice";
import { Card, CardContent, Typography, Grid } from "@mui/material";

function ProductList() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Grid container spacing={2} sx={{ mt: 10, p: 2 }}>
      {items.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          <Card
            component={Link}
            to={`/products/${product._id}`}
            sx={{ textDecoration: "none" }}
          >
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography>{product.description}</Typography>
              <Typography color="primary">${product.price}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductList;
