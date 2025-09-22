const express = require('express')
const { protect } = require("../middleware/authMiddleware")
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')

const router = express.Router()

// Public routes
router.get('/', getProducts)
router.get('/:id', getProductById)

// Protected routes (later we’ll restrict to admin)
router.post('/', protect, createProduct)
router.put('/:id', protect, updateProduct)
router.delete('/:id', protect, deleteProduct)

module.exports = router
