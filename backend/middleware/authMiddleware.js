import jwt from "jsonwebtoken";
import User from "../models/User";

export const protect = (req, res, next) => {
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try{
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        req.user = await User.findById(decoded.id).select("-password");

        if(!req.user) {
            return res.status(401).json({ message: "User not found" }); 
        }

        next()
    }catch(err){
        console.error("Auth error:", err.message)
        return res.status(401).json({message:"Not authorized, token failed"})
    }
    }else{
        return res.status(401).json({message:"No token not authorized"})
  }
};

export const admin = (req,res,next)=>{

    if(req.user?.role === "admin"){
        next()
    }else{
        res.status(403).json({message:"Admin access required"})
    }
}

