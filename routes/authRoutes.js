const express = require('express')
const router = express.Router();
const createUser = require('../controller/userCtrl')
const auth = require('../middleware/auth')

router.post('/register',  createUser.createUser);
router.post('/forgot-password',  createUser.forgotPasswordToken);
router.post('/login',  createUser.loginUserCtrl);
router.post('/updatepassword', auth.auth, createUser.updatePassword);
router.post('/all-users',  createUser.getallUser);
router.post('/refresh', createUser.handleRefreshToken);
router.post('/logout', createUser.logout);
router.post('/:id', auth.auth, auth.isadmin, createUser.getaUser);
router.post('/delete/:id',  createUser.deleteaUser);
router.post('/update/user', auth.auth, createUser.updateaUser);
router.post('/block/user/:id', auth.auth, auth.isadmin, createUser.blockUser);
router.post('/unblock/user/:id', auth.auth, auth.isadmin, createUser.unblockUser);


module.exports = router;