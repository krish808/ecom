import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();
connectDB();

const products = [
  {
    name: "Apple iPhone 15",
    description: "Latest iPhone with A17 chip",
    price: 1200,
    category: "Electronics",
    stock: 10,
    image: "https://example.com/iphone15.jpg",
  },
  {
    name: "Samsung Galaxy S24",
    description: "Flagship Samsung phone",
    price: 1100,
    category: "Electronics",
    stock: 15,
    image: "https://example.com/galaxyS24.jpg",
  },
  {
    name: "Nike Air Max",
    description: "Comfortable running shoes",
    price: 150,
    category: "Footwear",
    stock: 50,
    image: "https://example.com/nikeairmax.jpg",
  },
  {
    name: "Apple MacBook Pro 16",
    description: "High-performance laptop with M3 Pro chip",
    price: 2499,
    category: "Electronics",
    stock: 8,
    image: "https://example.com/macbookpro16.jpg",
  },
  {
    name: "Sony WH-1000XM5",
    description: "Noise cancelling wireless headphones",
    price: 399,
    category: "Electronics",
    stock: 25,
    image: "https://example.com/sonyxm5.jpg",
  },
  {
    name: "Adidas Ultraboost 23",
    description: "Premium running shoes for daily comfort",
    price: 180,
    category: "Footwear",
    stock: 40,
    image: "https://example.com/ultraboost23.jpg",
  },
  {
    name: "Levi’s 511 Jeans",
    description: "Slim fit stretch jeans",
    price: 70,
    category: "Clothing",
    stock: 100,
    image: "https://example.com/levis511.jpg",
  },
  {
    name: "Samsung 55'' QLED TV",
    description: "Smart QLED TV with 4K resolution",
    price: 999,
    category: "Electronics",
    stock: 12,
    image: "https://example.com/samsungqled.jpg",
  },
  {
    name: "Ikea Markus Chair",
    description: "Ergonomic office chair with lumbar support",
    price: 229,
    category: "Home",
    stock: 18,
    image: "https://example.com/ikeachair.jpg",
  },
  {
    name: "Casio G-Shock Watch",
    description: "Durable sports watch with water resistance",
    price: 120,
    category: "Accessories",
    stock: 60,
    image: "https://example.com/gshock.jpg",
  },
  {
    name: "Dyson V15 Detect",
    description: "Powerful cordless vacuum cleaner",
    price: 699,
    category: "Home",
    stock: 10,
    image: "https://example.com/dysonv15.jpg",
  },
];

const importData = async () => {
  try {
    await Product.deleteMany(); // clears old data
    await Product.insertMany(products);
    console.log("✅ Sample products imported!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
