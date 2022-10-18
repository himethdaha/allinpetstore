const express = require('express');
const storeController = require('../controllers/storecontroller')
const authController = require('../controllers/authController')
const router = express.Router();

//GET stores
router.get('/',storeController.get_stores);
//GET store based on ID
router.get('/:storeId',storeController.get_store)
//POST(create) stores
router.post('/create',authController.authorizeRoute,storeController.create_stores);
//UPDATE stores
router.patch('/update/:storeId',storeController.update_stores);
//DELETE stores
router.delete('/delete/:storeId',storeController.delete_stores);

module.exports = router;
