const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"] },
    description: { type: String },
    price: { type: Number, required: [true, "Price is required"] },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
