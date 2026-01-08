//////--------CONST-COLLECTION-----------------------------
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {userList} = require("./DataBase/MockedUsers.js");
const connectDB = require("./DataBase/db.js");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/authMiddleware.js");
const app = express();
//////////////////////////////////////////////////////////////////////////////////////////////
///middlewares
app.use(express.json());
connectDB();

////////////////////////////////////////////////////////////////////////////////////////////////
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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


    if (!user) {
        return res.status(401).json({
          message: "Usuario o contraseña incorrectos",
        });
      }
      
     /* if (user.role !== "admin") {
        return res.status(403).json({
          message: "Faltan credenciales",
        });
      }*/
      const token = jwt.sign(
        {
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    
        res.status(200).json({
        token,
        user: {
          email: user.email,
          role: user.role,
        },
        message: "WELCOME ",
      });
    });
////////////////////////////
app.get("/me", authMiddleware, (req, res) => {
    try {
      const user = userList.find(
        (u) => u.email === req.user.email
      );
  
      if (!user) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }
  
      res.status(200).json({
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("ERROR /me:", error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  });

  app.delete("/me", authMiddleware,  (req, res) => {
    const index = userList.findIndex(
      (u) => u.email === req.user.email
    );
  
    if (index === -1) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
  
    userList.splice(index, 1);
  
    res.status(200).json({
      message: "Cuenta eliminada",
    });
  });
  
/////////////////////////////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 3000; ///////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
