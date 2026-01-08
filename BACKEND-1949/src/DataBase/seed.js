const mongoose = require("mongoose");

require("dotenv").config();



const seedUsers = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  const users = [
    {
      name: "Admin",
      email: "admin@email.com",
      pass: "12345678",
      role: "admin",
    },
    {
        name: "user",
        email: "user@email.com",
        pass: "12345678",
        role: "user",
      },
  ];

  
  await User.insertMany(users);

  console.log("Usuarios creados");
  process.exit();
};


seedUsers()