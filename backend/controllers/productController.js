const Product= require("../models/Product")

// get all Products

const getProducts = async(req,res)=>{
    try{
        const products= await Product.find()
        res.json(products)
    }catch(err){

        res.status(500).json({ error: err.message })
    }
}

// get single product

const getProductById = async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id)
        if(!product) return res.status(404).json({ message: "Product not found" })
    res.json(product)
     }catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// creating the product admin only

const createProduct = async(req,res)=>{
    try{
        const{name,description,price,category,stock,image}= req.body
        const product = new Product({name,description,price,category,stock,image})
        await product.save()
        res.status(500).json(product)
    }catch(err){
        res.status(500).json({ error: err.message })
    }
}

// update product admin only

const updateProduct = async(req,res)=>{
    try{
        const product=await Product.findById(req.params.id)
        if(!product) return res.status(404).json({ message: "Product not found" })

            Object.assign(product,req.body)
            await product.save()
            res.status(200).json(product)
    }catch(err){
        res.status(500).json({ error: err.message })
    }
}

// delete product admin only

const deleteProduct =async(req,res)=>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) return res.status(404).json({ message: "Product not found" })
    res.json({ message: "Product removed" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}