const express = require("express");


const UserModel = require('../Models/UserModel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const user = express.Router();

// user.get("/",(req,res)=>{
//     res.send("hello")
// })

user.post("/register",async(req,res)=>{
    const {name,email,gender,password} = req.body;
    try {
          bcrypt.hash(password, 5, async (err, hash) => {
          if (err) {
            console.log(err);
          } else {
            let ExistingUser = await UserModel.findOne({ email: email });
            if (ExistingUser) {
              res.send({ msg: "User Already Exist Try Login" });
            } else {
              let NewUser = new UserModel({ name, email, password: hash,gender });
              await NewUser.save();
              res.send({ msg: "New User Added", user: NewUser });
            }
          }
        });
      } catch (e) {
        console.log("Error While Registering", e);
        res.send(`registration Err:-${e}`);
      }
})

user.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try{
        let User = await UserModel.find({email:email});
        if(User.length>0){
            bcrypt.compare(password,User[0].password,async(err,result)=>{
                if(result){
                    var token = jwt.sign( {userID:User[0]._id} , "channa");

                    res.send({msg:`Login Success WelcomeBack ${User[0].name}`,token:token});
                }else{
                    res.send({msg:"Wrong Password"})
                }
            })
        }else{
            res.send({msg:`Email[${email}] Not Exist Try Reigesting`})
        }

    }catch(e){
        res.send({msg:"error",reason:e});
    }
})





module.exports = user