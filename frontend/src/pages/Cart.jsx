import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQty,
  clearCart,
} from "../features/cart/cartSlice";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  TextField,
} from "@mui/material";

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const handleQtyChange = (id, value) => {
    if (value >= 1) {
      dispatch(updateQty({ productId: id, qty: Number(value) }));
    }
  };

  const total = items.reduce((acc, item) => acc + item.price * item, 0);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {items.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item xs={12} key={item.productId}>
                <Card>
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography>${item.price}</Typography>
                    </Box>

                    <TextField
                      type="number"
                      size="small"
                      value={item.qty}
                      onChange={(e) =>
                        handleQtyChange(item.productId, e.target.value)
                      }
                      sx={{ width: 70 }}
                      inputProps={{ min: 1 }}
                    />

                    <IconButton
                      color="error"
                      onClick={() => dispatch(removeFromCart(item.productId))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
            <Button
              variant="contained"
              color="error"
              sx={{ mr: 2 }}
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </Button>
            <Button variant="contained" color="primary">
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;
