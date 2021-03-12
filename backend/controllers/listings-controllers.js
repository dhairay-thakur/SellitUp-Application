const { validationResult } = require("express-validator");
const Listing = require("../models/listing-model");

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

const addListing = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error("Invalid inputs passed, please check your data."));
  }
  const { title, images, description, price, categoryId, location } = req.body;
  const newListing = new Listing({
    title,
    description,
    price,
    images: [
      {
        fileName:
          "https://huronelginwater.ca/wp-content/uploads/2019/03/test.jpg",
      },
    ],
    categoryId,
    userId: "1",
    location,
  });
  try {
    await newListing.save();
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
    listing = await Listing.findById(lid);
  } catch (error) {
    console.log(error);
    return next(new Error("Could not Delete Listing"));
  }
  if (!listing) return next(new Error("Listing does not exist"));
  try {
    await listing.remove();
  } catch (error) {
    console.log(error);
    return next(new Error("Could not Delete Listing"));
  }
  res.status(201).json({ message: "Deleted Listing Successfully" });
};

exports.updateListing = updateListing;
exports.getListings = getListings;
exports.getListingById = getListingById;
exports.addListing = addListing;
exports.deleteListing = deleteListing;
