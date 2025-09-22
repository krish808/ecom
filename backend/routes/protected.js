const express = require('express')
const {protect} = require("../middleware/authMiddleware")

const router = express.Router()

router.get('/profile',protect,(req,res)=>{
    res.json({message: "This is a protected route",
    user: req.user})
})

module.exports=router