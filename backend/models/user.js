const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  mobileNumber: { type: String, required: true },
  hostel: { type: String, required: true },
  room: { type: String, required: true },
  listings: [{ type: mongoose.Types.ObjectId, required: true, ref: "Listing" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
