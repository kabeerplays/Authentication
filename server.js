const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersModel = require('./Models/Users');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://kabeer:123@cluster0.me6fph8.mongodb.net/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected successfully.");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

app.post("/signup", (req, res) => {
  usersModel.create(req.body).then(() => {
    res.status(201).send("User created successfully");
  }).catch((error) => {
    res.status(500).send("Error creating user: " + error.message);
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  usersModel.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    if (user.password !== password) { // Note: For production, hash passwords and use bcrypt to compare
      return res.status(400).send("Invalid email or password");
    }
    res.status(200).json({ username: user.username });
  }).catch((error) => {
    res.status(500).send("Error logging in: " + error.message);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`);
});
