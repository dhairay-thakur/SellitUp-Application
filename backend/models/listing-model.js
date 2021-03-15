const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  images: [{ fileName: { type: String, required: true } }],
  price: { type: Number, required: true },
  categoryId: { type: Number, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

module.exports = mongoose.model("Listing", listingSchema);
