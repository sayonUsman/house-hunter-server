const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const newUserSchema = require("./schemas/newUserSchema");
const NewUser = new mongoose.model("NewUser", newUserSchema);
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// get database uri
const uri = `${process.env.DB_URI}`;

// connect to database
async function main() {
  await mongoose.connect(uri);
}

main().catch((err) => console.log(err));

// save new user info to database
app.post("/signup", async (req, res) => {
  try {
    const user = await NewUser.findOne({ email: req.body.email }).exec();

    if (user) {
      res.json({ isEmailRegistered: true });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new NewUser({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPassword,
        role: req.body.role,
      });

      await newUser
        .save()
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  } catch (err) {
    res.send(err);
  }
});

// login user
app.post("/login", async (req, res) => {
  try {
    const user = await NewUser.findOne({ email: req.body.email }).exec();

    if (user) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        res.json({ isLoginSuccess: true, role: user.role });
      } else {
        res.json({ isLoginSuccess: false });
      }
    } else {
      res.json({ isLoginSuccess: false });
    }
  } catch (err) {
    res.send(err);
  }
});

app.get("/", (req, res) => {
  res.send("House Hunters' Server is Running.");
});

app.listen(port, () => {
  console.log(`House Hunters' Server is listening on ${port}`);
});
