const express = require('express');
const petShopController = require('../controllers/petShopController.js')
const authController = require('../controllers/authController')
const router = express.Router();

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

module.exports = router;