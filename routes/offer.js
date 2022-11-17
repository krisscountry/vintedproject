const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;

const fileUpload = require("express-fileupload");

const isAuthenticated = require("../middlewares/isAuthenticated");

const { convertToBase64, test } = require("../utils/converterB64");

const Offer = require("../models/Offer");

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      const pictureToUpload = convertToBase64(req.files.picture);
      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          {
            MARQUE: brand,
          },
          {
            TAILLE: size,
          },
          {
            ÉTAT: condition,
          },
          {
            COULEUR: color,
          },
          {
            EMPLACEMENT: city,
          },
        ],
        owner: req.user,
      });

      const uploadResult = await cloudinary.uploader.upload(pictureToUpload, {
        folder: `/vinted/offers/${newOffer._id}`,
      });
      newOffer.product_image = uploadResult;
      await newOffer.save();
      res.status(201).json(newOffer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
