const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Listing = require("../models/listing-model");
const User = require("../models/user");

const getListings = async (req, res, next) => {
  let listings;
  try {
    listings = await Listing.find();
  } catch (error) {
    console.log(error);
    return next(new Error("Could not get Listings"));
  }
  res.json({ listings: listings.map((l) => l.toObject({ getters: true })) });
};

const getListingById = async (req, res, next) => {
  const lid = req.params.lid;
  let listing;
  try {
    listing = await Listing.findById(lid);
  } catch (error) {
    console.log(error);
    return next(new Error("Could not get Listing"));
  }
  if (!listing)
    return next(
      new Error("Could not find listing for the provided listing id.")
    );
  res.json({ listing: listing.toObject({ getters: true }) });
};

const getListingsByUserId = async (req, res, next) => {
  const uid = req.params.uid;
  let listings = [];
  try {
    listings = await Listing.find({ userId: uid });
  } catch (error) {
    console.log(error);
    return next(new Error("Could not get Listings"));
  }
  if (listings.length === 0)
    return next(
      new Error("Could not find any listings for the provided user id.")
    );
  res.json({ listings: listings.map((l) => l.toObject({ getters: true })) });
};

const addListing = async (req, res, next) => {
  const errors = validationResult(req);
  // console.log(errors);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs passed, please check your data."));
  }
  const { title, description, price, categoryId, location, userId } = req.body;
  let images = [];
  req.files.forEach((image) => {
    images.push({
      fileName: "http://192.168.43.210:5000/" + image.path,
    });
  });

  const newListing = new Listing({
    title,
    description,
    price,
    images,
    categoryId,
    userId,
    location,
  });

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
    return next(new Error("Unable to add Listing"));
  }
  if (!user) {
    return next(new Error("User does not exist!"));
  }
  try {
    // using session as we want all these events to succeed together
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newListing.save({ session: sess });
    user.listings.push(newListing);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(new Error("Unable to add Listing"));
  }
  res.status(201).json({ listing: newListing });
};

const updateListing = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs passed, please check your data."));
  }
  const { title, images, description, price, categoryId, location } = req.body;
  const lid = req.params.lid;
  let listing;
  try {
    listing = await Listing.findById(lid);
  } catch (error) {
    console.log(error);
    return next(new Error("Could not Update Listing"));
  }

  listing.title = title;
  listing.description = description;
  listing.price = price;
  listing.categoryId = categoryId;
  listing.location = location;

  try {
    await listing.save();
  } catch (error) {
    console.log(error);
    return next(new Error("Could not Update Listing"));
  }
  res.status(200).json({ listing: listing.toObject({ getters: true }) });
};

const deleteListing = async (req, res, next) => {
  const lid = req.params.lid;
  let listing;
  try {
    // populate can only be used with related schemas
    listing = await Listing.findById(lid).populate("userId");
  } catch (error) {
    console.log(error);
    return next(new Error("Could not Delete Listing"));
  }
  if (!listing) return next(new Error("Listing does not exist"));
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await listing.remove({ session: sess });
    listing.userId.listings.pull(listing);
    await listing.userId.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(new Error("Could not Delete Listing"));
  }
  res.status(201).json({ message: "Deleted Listing Successfully" });
};

exports.updateListing = updateListing;
exports.getListingsByUserId = getListingsByUserId;
exports.getListings = getListings;
exports.getListingById = getListingById;
exports.addListing = addListing;
exports.deleteListing = deleteListing;
