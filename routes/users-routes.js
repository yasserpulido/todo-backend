const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  [check("email").not().isEmpty(), [check("password").not().isEmpty()]],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

module.exports = router;
