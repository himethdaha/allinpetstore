const express = require('express');
const petController = require('../controllers/petController')
const authController = require('../controllers/authController')
const router = express.Router();

//GET pet
router.get('/',petController.get_pet);
//GET store based on ID
router.get('/:petId',petController.get_pet)
//POST(create) pet
router.post('/create',authController.authenticateRoutes,authController.authorizeRoutes('breeder'),petController.create_pet);
//UPDATE pet
router.patch('/update/:petId',authController.authenticateRoutes,authController.authorizeRoutes('breeder'),petController.update_pet);
//DELETE pet
router.delete('/delete/:petId',authController.authenticateRoutes,authController.authorizeRoutes('breeder'),petController.delete_pet);

module.exports = router;