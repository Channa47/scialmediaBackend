const express = require('express');
const jwt = require("jsonwebtoken");
const PostModel = require("../Models/Postmodel");
require('dotenv').config
const post = express.Router();

post.get("/",async(req,res)=>{
    let token = req.headers.authorization; 
    let query = req.query;
    if(query.device){
        try{
            const decode = jwt.verify(token,process.env.key)
            if(decode){
                const userID = decode.userID;
                const data = await PostModel.find({userID:userID});
                let FilteredData = data.filter((e)=>{
                    return e.device === query.device
                });
                res.send({Data:FilteredData});
            }else{
                res.send({Data:[]});
            }
            }catch(e){
                res.send(e)
            }
    }else{
        try{
        const decode = jwt.verify(token,process.env.key)
        if(decode){
            const userID = decode.userID;
            const data = await PostModel.find({userID:userID});
            res.send({Data:data})
        }else{
            res.send({Data:[]});
        }
        }catch(e){
            res.send(e)
        }
    }
    
});

post.post("/add",async(req,res)=>{
    const payload = req.body;
    try{
        const newNote = new PostModel(payload);
        await newNote.save();
        res.send({msg:"done",new:newNote});
    }catch(e){
        res.send({"msg":e});
    }
})

post.patch("/update/:id",async(req,res)=>{
    const payload = req.body;
    const id = req.params.id
    try{
        await PostModel.findByIdAndUpdate(id,{...payload});
        let UpdatedPost = await PostModel.findById(id);
        res.send({msg:"Updated",Data:UpdatedPost});
    }catch(e){
        res.send({msg:"error",reason:e})
    }
})
post.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id
    try{
        await PostModel.findByIdAndDelete(id);
        res.send({msg:"deleted"});
    }catch(e){
        res.send({msg:"error",reason:e})
    }
})



module.exports = post