const express = require('express');
const storeController = require('../controllers/storecontroller')
const authController = require('../controllers/authController')
const reviewRouter = require('../routes/review')
const router = express.Router();

//GET petShops based on ratings
router.get('/storeRatings',storeController.store_ratings)
//GET stores
router.get('/',storeController.get_stores);
//GET store based on ID
router.get('/:storeId',storeController.get_store)
//POST(create) stores
router.post('/create',authController.authenticateRoutes,authController.authorizeRoutes('owner'),storeController.create_stores);
//UPDATE stores
router.patch('/update/:storeId',authController.authenticateRoutes,authController.authorizeRoutes('owner'),storeController.update_stores);
//DELETE stores
router.delete('/delete/:storeId',authController.authenticateRoutes,authController.authorizeRoutes('owner'),storeController.delete_stores);

//Route to get all pet shops distances from users location
router.get('/get-distance/current-lat/:lat/current-lng/:lng/unit/:unit',storeController.getAll_distances);
//Route to get pet shops within a certain distance
router.get('/distance/:distance/unit/:unit/current-lat/:lat/current-lng/:lng',storeController.get_stores_distance);

//Route for reviews
router.use('/:storeId/reviews',reviewRouter)


module.exports = router;
