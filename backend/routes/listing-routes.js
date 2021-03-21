const express = require("express");

const { check } = require("express-validator");

const listingsControllers = require("../controllers/listings-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", listingsControllers.getListings);
router.get("/:lid", listingsControllers.getListingById);
router.get("/user/:uid", listingsControllers.getListingsByUserId);
router.get("/category/:cid", listingsControllers.getListingsByCategoryId);
// router.use(checkAuth);
router.post(
  "/",
  fileUpload.array("images"),
  [
    check("title").not().isEmpty(),
    check("price").not().isEmpty(),
    check("categoryId").not().isEmpty(),
  ],
  listingsControllers.addListing
);
router.patch(
  "/:lid",
  [
    check("title").not().isEmpty(),
    check("price").not().isEmpty(),
    check("categoryId").not().isEmpty(),
  ],
  listingsControllers.updateListing
);
router.delete("/:lid", listingsControllers.deleteListing);

module.exports = router;
