//////--------CONST-COLLECTION-----------------------------
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routers/authRoutes.js");

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
app.get("/users", (req, res) => {
    res.status(501).json({
      message: "Endpoint pendiente de implementación",
    });
  });
  
  app.use("/auth", authRoutes)
///---------enpoints------------------------------------
app.post("/login", (req, res) => {
    res.status(501).json({
      message: "Login pendiente de implementación",
    });
  });
  
////////////////////////////
app.get("/me", authMiddleware, (req, res) => {
    res.status(501).json({
      message: "Endpoint pendiente de implementación",
    });
  });
  app.delete("/me", authMiddleware, (req, res) => {
    res.status(501).json({
      message: "Endpoint pendiente de implementación",
    });
  });
  
/////////////////////////////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 3000; ///////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
