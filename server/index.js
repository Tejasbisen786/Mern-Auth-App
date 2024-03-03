// MERN- Mongo + Express + React + NOde

// Development - Node.js Server and React Server

// Production = Node.js Server + Static React Files

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/full-mern-stack-video");

app.post("/api/register", async (req, res) => {
  console.log(req.body);

  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "eror", error: "Duplicate Email" });
  }

  res.json({ status: "ok" });
});

// Login Route

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

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

app.listen(1337, () => {
  console.log("Server Started on 1337");
});
