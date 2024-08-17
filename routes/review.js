const express=require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../public/utils/wrapAsync.js");
const ExpressError = require("../public/utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing= require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}= require("../middleware.js");

const reviewController= require("../controllers/reviews.js");

//review post route
router.post("/", validateReview, isLoggedIn,
    wrapAsync(reviewController.createReview));

//review delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports=router;