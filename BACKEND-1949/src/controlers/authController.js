
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");

const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Todos los campos son obligatorios",
        });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "El email ya está registrado",
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
  
      res.status(201).json({
        message: "Usuario registrado correctamente",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("ERROR register:", error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  };
  
module.exports = { register };
