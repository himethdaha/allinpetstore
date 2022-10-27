const express = require('express');
const itemController = require('../controllers/itemController')
const authController = require('../controllers/authController')
const router = express.Router();

//GET item
router.get('/',itemController.get_item);
//GET store based on ID
router.get('/:itemId',itemController.get_item)
//POST(create) item
router.post('/create',authController.authenticateRoutes,authController.authorizeRoutes('owner','breeder'),itemController.create_item);
//UPDATE item
router.patch('/update/:itemId',authController.authenticateRoutes,authController.authorizeRoutes('owner','breeder'),itemController.update_item);
//DELETE item
router.delete('/delete/:itemId',authController.authenticateRoutes,authController.authorizeRoutes('owner','breeder'),itemController.delete_item);

module.exports = router;