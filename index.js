const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const newUserSchema = require("./schemas/newUserSchema");
const NewUser = new mongoose.model("NewUser", newUserSchema);
const houseDetailsSchema = require("./schemas/houseDetailsSchema");
const HouseDetails = new mongoose.model("HouseDetails", houseDetailsSchema);
const bookedHouseDetailsSchema = require("./schemas/bookedHouseDetailsSchema");
const BookedHouseDetails = new mongoose.model(
  "BookedHouseDetails",
  bookedHouseDetailsSchema
);

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

// get user info from database
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

// save new house details to database
app.post("/house-details", async (req, res) => {
  try {
    const houseDetails = new HouseDetails({
      ownerName: req.body.ownerName,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      phone: req.body.phone,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      roomSize: req.body.roomSize,
      url: req.body.url,
      availabilityDate: req.body.availabilityDate,
      rent: req.body.rent,
      description: req.body.description,
    });

    await houseDetails
      .save()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (err) {
    res.send(err);
  }
});

// get houses details
app.get("/houses-details", async (req, res) => {
  try {
    const houses = await HouseDetails.find()
      .select({
        _id: 1,
        address: 1,
        roomSize: 1,
        url: 1,
        availabilityDate: 1,
        rent: 1,
      })
      .exec();

    res.send(houses);
  } catch (err) {
    res.send(err);
  }
});

// get house details by id
app.get("/house-details/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const details = await HouseDetails.find({ _id: id }).exec();
    res.send(details);
  } catch (err) {
    res.send(err);
  }
});

// get houses details by email
app.get("/houses-details/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const houses = await HouseDetails.find({ email: email }).exec();
    res.send(houses);
  } catch (err) {
    res.send(err);
  }
});

// delete house details by id
app.delete("/house-details/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await HouseDetails.deleteOne({ _id: id }).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.send(err);
  }
});

// update house details by id
app.put("/house-details/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await HouseDetails.updateOne(
      { _id: id },
      {
        $set: {
          ownerName: req.body.ownerName,
          address: req.body.address,
          city: req.body.city,
          phone: req.body.phone,
          bedrooms: req.body.bedrooms,
          bathrooms: req.body.bathrooms,
          roomSize: req.body.roomSize,
          url: req.body.url,
          availabilityDate: req.body.availabilityDate,
          rent: req.body.rent,
          description: req.body.description,
        },
      }
    ).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.send(err);
  }
});

// save booked house details to database
app.post("/booked-house-details", async (req, res) => {
  try {
    const details = await BookedHouseDetails.find({
      renterEmail: req.body.email,
    }).exec();

    const isHouseBooked = await BookedHouseDetails.findOne({
      houseId: req.body.houseId,
    }).exec();

    if (details.length >= 2) {
      res.json({ isMoreThanTwo: true });
    } else if (isHouseBooked) {
      res.json({ isHouseBooked: true });
    } else if (details.length < 2) {
      const user = await NewUser.findOne({ email: req.body.email })
        .select({
          name: 1,
          email: 1,
          phone: 1,
        })
        .exec();

      const bookedHouseDetails = new BookedHouseDetails({
        renterName: user.name,
        renterEmail: user.email,
        renterPhone: user.phone,
        houseId: req.body.houseId,
      });

      await bookedHouseDetails
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

app.get("/", (req, res) => {
  res.send("House Hunters' Server is Running.");
});

app.listen(port, () => {
  console.log(`House Hunters' Server is listening on ${port}`);
});
