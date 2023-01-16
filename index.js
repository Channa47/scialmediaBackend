const express = require("express");
require('dotenv').config
const Connection = require("./config/db")
const user = require("./Routes/UserRoutes")
const post = require("./Routes/PostRoutes")
const AuthMiddleware = require("./Middlewares/AuthMiddleWare")
var cors = require('cors')



const app = express();
app.use(cors({origin:"*"}))
app.use(express.json())
app.use("/users",user);
app.use(AuthMiddleware);
app.use("/posts",post);

app.listen(process.env.port,async()=>{
    try{
        Connection
        console.log("Connected To BooksDB")
    }catch(e){
        console.log(e);
    }
    console.log(`api Running at ${process.env.port}`)
})