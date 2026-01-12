//////--------CONST-COLLECTION-----------------------------
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes.js");
const User = require("./models/user.js");
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
console.log("APP.JS CARGADO");

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

////////////////////////////


app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("ERROR /me:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 3000; ///////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
