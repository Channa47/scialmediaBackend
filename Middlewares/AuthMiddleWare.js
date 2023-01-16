const jwt = require("jsonwebtoken");
require('dotenv').config

const AuthMiddleware = (req,res,next)=>{
    const token = req.headers.authorization; 
   if(token){
        const decode = jwt.verify(token,process.env.key);
        if(decode){
            const userID = decode.userID;
            req.body.userID = userID;
            next();
        }else{
            console.log("token missmatched")
            res.send("decode errr");
        }
   }else{
        console.log('erroin authmiddleware')
        res.send("Please Login");
   }
}


module.exports = AuthMiddleware