const mongoose = require('mongoose')
const { stack } = require('../routes/authRoutes')

const productSchema =new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String},
    price:{type:Number,required:true},
    category:{type:String},
    stock:{type:Number,default:0},
    image:{type:String}
},{timestamps:true}) 

module.exports=mongoose.model("Product",productSchema)