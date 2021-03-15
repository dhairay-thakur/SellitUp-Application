const { validationResult } = require("express-validator");
const User = require("../models/user");

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

  const createdUser = new User({
    name,
    email,
    password,
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
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
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

  if (!existingUser || existingUser.password !== password) {
    return next(
      new Error("Could not identify user, credentials seem to be wrong")
    );
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
