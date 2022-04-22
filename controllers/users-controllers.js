const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (error) {
    const err = new HttpError("Could not find any user.", 500);
    return next(err);
  }

  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new HttpError("Invalid inputs passed, please check your data.");
    return next(err);
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Signin up failed, please try again.", 500);
    return next(err);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exits already, please loging instead.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    email,
    password,
  });

  try {
    createdUser.save();
  } catch (error) {
    const err = new HttpError("Creating user failed, please try again.", 500);
    return next(err);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Logging failed, please try again.", 500);
    return next(err);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid credentials, could not log you in.", 401);
    return next(error);
  }

  res.json({ message: "Logged in." });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
