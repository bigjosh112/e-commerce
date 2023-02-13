const express = require("express");
const productCrtl = require('../controller/productCtrl');
const auth = require('../middleware/auth')
const router = express.Router();


router.post('/createproduct', auth.auth, auth.isadmin, productCrtl.createProduct);
router.post('/update/:id', auth.auth, auth.isadmin, productCrtl.updateProduct);
router.post('/delete/:id', auth.auth, auth.isadmin, productCrtl.deleteProduct);
router.post('/:id', productCrtl.getaProduct);
router.post('/all/product', productCrtl.getAllProduct);
//router.post('/filter', productCrtl.filterProduct);

module.exports = router;