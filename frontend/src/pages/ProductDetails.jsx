import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  clearProduct,
} from "../features/product/productSlice";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return null;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <strong>${product.price}</strong>
    </div>
  );
}

export default ProductDetail;
