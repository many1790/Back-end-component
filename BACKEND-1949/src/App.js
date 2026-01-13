//////--------CONST-COLLECTION-----------------------------
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const User = require("./models/user.js");
const connectDB = require("./DataBase/db.js");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/authMiddleware.js");
const adminMiddleware = require("./middlewares/adminMiddleware");
const app = express();
//////////////////////////////////////////////////////////////////////////////////////////////
///
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use("/auth", authRoutes)
////////////////////////////////////////////////////////////////////////////////////////////////
connectDB();
//////////////////////////////////////////////////////////
//////---------------------------------------
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
///////////////////////////////////////////////////////////////////////
app.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener usuarios",
      });
    }
  }
);
app.delete(
  "/users/:id",
  authMiddleware,
 /// adminMiddleware,
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      res.status(200).json({
        message: "Usuario eliminado",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al eliminar usuario",
      });
    }
  }
);
app.patch("/me", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      secondName,
      email,
      phone,
      password,
      repeatPassword,
    } = req.body;

    if (!name || !secondName || !email || !phone) {
      return res.status(400).json({
        message: "Campos obligatorios incompletos",
      });
    }

    if (password && password !== repeatPassword) {
      return res.status(400).json({
        message: "Las contraseñas no coinciden",
      });
    }

    const updateData = {
      name,
      secondName,
      email,
      phone,
    };

    if (password) {
      updateData.password = password;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.error("ERROR PATCH /me:", error);
    res.status(500).json({
      message: "Error al actualizar perfil",
    });
  }
});

app.patch(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        secondName,
        email,
        phone,
        role,
        password,
      } = req.body;

      if (!name || !secondName || !email || !phone || !role) {
        return res.status(400).json({
          message: "Todos los campos son obligatorios",
        });
      }

      const updateData = {
        name,
        secondName,
        email,
        phone,
        role,
      };

      if (password) {
        updateData.password = password;
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("ERROR PATCH /users/:id:", error);
      res.status(500).json({
        message: "Error al actualizar usuario",
      });
    }
  }
);

/////////////////////////////////////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 3000; ///////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
