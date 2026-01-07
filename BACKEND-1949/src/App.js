//////--------CONST-COLLECTION-----------------------------
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {userList} = require("./DataBase/MockedUsers.js");
const connectDB = require("./DataBase/db.js");

const app = express();
//////////////////////////////////////////////////////////////////////////////////////////////
///middlewares
app.use(express.json());
connectDB();
////////////////////////////////////////////////////////////////////////////////////////////////
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type"],
}));
//////////////////////////////////////////////////////////
//////-------CHECK-POINT--------------------------------
app.get("/", (req,res)=>{
    res.send("Hola")
})
///////------------enviar un objeto----------------------
app.get("/users", (req, res)=>{

    res.status(200).json(userList);
})

///---------enpoints------------------------------------
app.post("/login", (req,res)=>{
    const { email, pass } = req.body;
    const user = userList.find((u) => u.email === email && u.pass === pass);

    console.log(user);


    if(!user){
        return res.status(200).json({
            statu:"success",
            message:"usuario o contraseña incorrectos",
        })
    }
    if(user.role !== "admin"){
        return res.status(200).json({
            statu:"success",
            message:"Faltan credenciales",
        })
    }
    res.status(200).json({
        statu:"success",
        userData: user,
        message:"WELCOME ADMIN!"
    })
})
////////////////////////////
const PORT = process.env.PORT || 3000; ///////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
