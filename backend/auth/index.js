const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "100xDevs";
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  "mongodb+srv://Yash:Hello%401234@cluster0.so8pmoa.mongodb.net/sept-proj"
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("users", userSchema);

app.use(express.json());

// Signup function
async function signup(req, res) {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const existsUser = await User.findOne({
      email: email,
    });

    if (existsUser) {
      return res.status(400).json({
        error: "Email Already Signed Up",
      });
    }

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();
    res.json({
      msg: `Gotcha ${name}!! Your account has been created successfully.`,
    });
  } catch (error) {
    console.error("Error adding task:", error);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
}

// Signin function
async function signin(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const existsUser = await User.findOne({
      email: email,
    });

    if (!existsUser) {
      return res.json({ msg: "Your email has not been registered" });
    }

    if (existsUser.password === password) {
      const token = jwt.sign(
        {
          email,
        },
        JWT_SECRET
      );
      res.json({ token: token });
    } else {
      res.json({ msg: "Password Incorrect" });
    }
  } catch (error) {
    console.error("Error adding task:", error);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
}

app.post("/signup", signup);

app.post("/signin", signin);

function auth(req, res, next) {
  try {
    const token = req.headers.token;
    const verifyToken = jwt.verify(token, JWT_SECRET);
    if (verifyToken) {
      req.username = verifyToken.username;
      next();
    }
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({
      msg: "You are not login user",
    });
  }
}

module.exports = { signup, signin, auth };
