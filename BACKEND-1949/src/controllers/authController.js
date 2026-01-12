const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

    const user = await User.create({
      name,
      email,
      password, 
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

  /////////////////////////////////////////////////////////////////////////////////////////////////
  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          message: "Email y password obligatorios",
        });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          message: " no userrrr",
        });
      }
  
      const isValidPassword = await bcrypt.compare(
        password,
        user.password
      );
  
      if (!isValidPassword) {
        return res.status(401).json({
          message: "pass no paassss ahahahahha",
        });
      }
  
      const token = jwt.sign(
        {
          id: user._id,
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
      });
    } catch (error) {
      console.error("ERROR login:", error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  };
  

module.exports = { register, login };
