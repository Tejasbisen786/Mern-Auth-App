// MERN- Mongo + Express + React + NOde

// Development - Node.js Server and React Server

// Production = Node.js Server + Static React Files

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/full-mern-stack-video");

app.post("/api/register", async (req, res) => {
  console.log(req.body);

  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "eror", error: "Duplicate Email" });
     return
  }
  res.json({ status: "ok" });
});

// Login Route

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return  { status: "error", error: "Invalid login" };
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (user) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );

    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "eror", user: false });
  }
});

app.get("/api/quote", async (req, res) => {
  const token = req.headers("x-access-token");
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return { status: "ok", quote: user.quote };
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid Token" });
  }
});

app.post("/api/quote", async (req, res) => {
  const token = req.headers("x-access-token");
  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await User.updateOne(
      { email: email },
      { $set: { quote: req.body.quote } }
    );

    return res.json({ status: "ok", quote: user.quote });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid Token" });
  }
});

app.listen(1337, () => {
  console.log("Server Started on 1337");
});
