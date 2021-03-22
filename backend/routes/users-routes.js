const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");
const checkAuth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("mobileNumber").not().isEmpty(),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

router.use(checkAuth);
router.get("/", usersController.getUsers);
router.get("/:uid", usersController.getUserDetails);

module.exports = router;
