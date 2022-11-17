require("dotenv").config();
const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const app = express();
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

const User = require("./models/User");

const Offer = require("./models/Offer");

const userRoutes = require("./routes/user");
app.use(userRoutes);
const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

app.get("/offers", async (req, res) => {
  try {
    const filters = {};

    const offers = await Offer.find();

    res.status(200).json(offers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  try {
    res.status(404).json("Not found");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = 3000;
app.listen(process.env.PORT, () => {
  console.log("Server is on fire 🔥 on port " + PORT);
});
