const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const newUserSchema = require("./schemas/newUserSchema");
const NewUser = new mongoose.model("NewUser", newUserSchema);
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `${process.env.DB_URI}`;
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(uri);
}

app.get("/", (req, res) => {
  res.send("House Hunters' Server is Running.");
});

app.post("/users", async (req, res) => {
  const newUser = new NewUser(req.body);
  await newUser
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(port, () => {
  console.log(`House Hunters' Server is listening on ${port}`);
});
