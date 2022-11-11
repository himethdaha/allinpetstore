const express = require('express');
const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController')
const router = express.Router({mergeParams:true});

//GET review
router.get('/',reviewController.getReviews)
//GET review based on ID
router.get('/:reviewId',reviewController.getReview)
//POST review
router.post('/create',authController.authenticateRoutes,authController.authorizeRoutes('user'),reviewController.create_Review)
//DELETE review
router.delete('/delete/:reviewId',authController.authenticateRoutes,authController.authorizeRoutes('user'),reviewController.delete_Review)
//PATCH review
router.patch('/update/:reviewId',authController.authenticateRoutes,authController.authorizeRoutes('user'),reviewController.update_Review)

module.exports = router