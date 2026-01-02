const express = require("express");
const cors = require("cors");
const {userList} = require("./config/MockedUsers.js");
const PORT = 3000;
const app = express();
app.use(express.json());


app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","OPTIONS"],
    allowedHeaders:["Content-Type"],
}));

//////////////////////////////////////////////////////////
///////------------enviar un objeto----------------------
app.get("/users", (req, res)=>{

    res.status(200).json(userList);
})
console.log(userList);
///---------enpoints------------------------------------
app.post("/login", (req,res)=>{
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
    })
})
////////////////////////////
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
