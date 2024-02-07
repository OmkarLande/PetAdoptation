const router = require('express').Router()

const {login, signUp, approveUser} = require('../controllers/Auth')
const {auth, isApproved} = require('../middlewares/auth')

router.post("/login", login)

router.post("/signup", signUp)

router.put('/approve/:userId', approveUser);

module.exports  = router