const router = require('express').Router()

const {login, signUp, approveUser, changePassword, sendOTP} = require('../controllers/Auth')
const {auth, isApproved} = require('../middlewares/auth')

router.post("/login", login)

router.post("/signup", signUp)

router.put('/approve/:userId', approveUser);

router.post('/sendOtp',sendOTP );

router.post('/passChange',changePassword );

module.exports  = router