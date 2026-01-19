require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes.js");
const User = require("./models/user.js");
const Appointment = require("./models/Appointment.js");

const connectDB = require("./DataBase/db.js");
const authMiddleware = require("./middlewares/authMiddleware.js");
const adminMiddleware = require("./middlewares/adminMiddleware.js");

const app = express();

/* ---------------- MIDDLEWARES ---------------- */
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();
app.use("/auth", authRoutes);


app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Error interno" });
  }
});
app.patch("/me", authMiddleware, async (req, res) => {
  try {
    const { name, secondName, email, phone, password, repeatPassword } = req.body;

    if (!name || !secondName || !email || !phone) {
      return res.status(400).json({ message: "Campos obligatorios incompletos" });
    }

    if (password && password !== repeatPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const updateData = { name, secondName, email, phone };
    if (password) updateData.password = password;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch {
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
});


app.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

app.patch("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json(user);
});

app.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json({ message: "Usuario eliminado" });
});

app.post("/appointments", authMiddleware, async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Solo usuarios pueden crear citas" });
  }

  const { service, date } = req.body;
  if (!service || !date) {
    return res.status(400).json({ message: "Servicio y fecha obligatorios" });
  }

  const appointment = await Appointment.create({
    user: req.user.id,
    service,
    date,
  });

  res.status(201).json(appointment);
});

app.get("/appointments/me", authMiddleware, async (req, res) => {
  const appointments = await Appointment.find({ user: req.user.id }).sort({ date: 1 });
  res.json(appointments);
});

app.get("/appointments", authMiddleware, adminMiddleware, async (req, res) => {
  const appointments = await Appointment.find()
    .populate("user", "name secondName email phone")
    .sort({ date: 1 });

  res.json(appointments);
});

app.patch("/appointments/:id", authMiddleware, async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Cita no encontrada" });

  if (
    req.user.role !== "admin" &&
    appointment.user.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: "No autorizado" });
  }

  const { status, date, service } = req.body;
  if (status) appointment.status = status;
  if (date) appointment.date = date;
  if (service) appointment.service = service;

  await appointment.save();
  res.json(appointment);
});
app.delete(
  "/appointments/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const appointment = await Appointment.findByIdAndDelete(req.params.id);

      if (!appointment) {
        return res.status(404).json({
          message: "Cita no encontrada",
        });
      }

      res.status(200).json({
        message: "Cita eliminada",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al eliminar cita",
      });
    }
  }
);

app.post("/auth/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token requerido" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: "Refresh token inválido" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
