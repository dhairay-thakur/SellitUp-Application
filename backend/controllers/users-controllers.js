const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    console.log(error);
    return next(new Error("Could not get Users"));
  }
  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password, mobileNumber, hostel, room } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    console.log(error);
    return next(new Error("Signup Failed, Please Try Again Later"));
  }

  if (existingUser) {
    return next(new Error("User Already Exists, Please Login Instead"));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    console.log(error);
    return next(new Error("Signup Failed, Please Try Again Later"));
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    mobileNumber,
    hostel,
    room,
    listings: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    console.log(error);
    return next(new Error("Signup Failed, Please Try Again Later"));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "sellitup-private-key",
      { expiresIn: "7d" }
    );
  } catch (error) {
    console.log(error);
    return next(new Error("Signup Failed, Please Try Again Later"));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    console.log(error);
    return next(new Error("Login Failed, Please Try Again Later"));
  }

  if (!existingUser) {
    return next(
      new Error("Could not identify user, credentials seem to be wrong")
    );
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    console.log(error);
    return next(new Error("Login Failed, Please Try Again Later"));
  }

  if (!isValidPassword) {
    return next(new Error("Wrong Password"));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "sellitup-private-key",
      { expiresIn: "7d" }
    );
  } catch (error) {
    console.log(error);
    return next(new Error("Login Failed, Please Try Again Later"));
  }

  res.json({ userId: createdUser.id, email: createdUser.email, token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
