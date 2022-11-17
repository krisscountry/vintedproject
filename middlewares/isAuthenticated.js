const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const userFound = await User.findOne({ token: token }).select("account");
      if (userFound) {
        req.user = userFound;
        return next();
      } else {
        res.status(401).json("Unauthorized");
      }
    } else {
      res.status(401).json("Pas de token envoyé");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
