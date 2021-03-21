const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const listingRoutes = require("./routes/listing-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/api/listings", listingRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new Error("Could not find this route");
  throw error;
});

app.use((error, req, res, next) => {
  if (req.files) {
    req.files.forEach((image) => {
      fs.unlink(image.path);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://dhairay:LAnej5doJIMuoWpH@cluster0.wlsdc.mongodb.net/listings?retryWrites=true&w=majority"
  )
  .then(() => app.listen(5000))
  .catch((error) => console.log(error));
