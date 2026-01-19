require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected to MongoDB");

    await User.deleteMany();


    await User.create([
      {
        name: "Admin",
        secondName: "Demo",
        email: "123@test.com",
        password: "12345678",
        phone: "600000001",
        role: "admin",
      },
      {
        name: "User",
        secondName: "Demo",
        email: "om2@gamail.com",
        password: "12345678",
        phone: "600000002",
        role: "user",
      },
    ]);

    console.log("Seed completed");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
