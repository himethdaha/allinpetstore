const express = require('express');
const petShopController = require('../controllers/petShopController.js')
const authController = require('../controllers/authController')
const reviewRouter = require('../routes/review');
const router = express.Router();

//Route to get all pet shops distances from users location
router.get('/get-distance/current-lat/:lat/current-lng/:lng/unit/:unit',petShopController.getAll_distances)
//GET petShops based on ratings
router.get('/petShopRatings',petShopController.petShop_ratings)
//GET petShop
router.get('/',petShopController.get_petShops);
//GET petShop based on ID
router.get('/:petShopId',petShopController.get_petShop)
//POST(create) petShop
router.post('/create',authController.authenticateRoutes,authController.authorizeRoutes('breeder'),petShopController.create_petShop);
//UPDATE petShop
router.patch('/update/:petShopId',authController.authenticateRoutes,authController.authorizeRoutes('breeder'),petShopController.update_petShop);
//DELETE petShop
router.delete('/delete/:petShopId',authController.authenticateRoutes,authController.authorizeRoutes('breeder'),petShopController.delete_petShop);

;
//Route to get pet shops within a certain distance
// router.get('/distance/:distance/unit/:unit/current-lat/:lat/current-lng/:lng',petShopController.get_petShops_distance);

//Route for reviews
router.use('/:petShopId/reviews',reviewRouter)



module.exports = router;