const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require("multer"); //multer not process(pass in express) any form which is not multipart (multipart/from-data) and it is use to uploading file .
const {storage} = require("../cloudconfig.js")
const upload = multer({ storage});//inisetilize multer and it store file in cloudanary

//router.route is a methode in which we can write all same path(like ("/")) vala in which we write get ,post all the  etc. 

router
   .route("/")
   .get( wrapAsync(listingController.index))
   .post(isLoggedIn,
    validateListing,
    upload.single("listing[image]"),//middleware or //upload.single("file") it is to save the file  multer sve krega req.file me she(shyed conroller me save kra rha hai)
    wrapAsync(listingController.createListing)
);

//New route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
    .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);

//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;