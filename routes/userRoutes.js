const router = require('express').Router()

const {login, signUp} = require('../controllers/Auth')
const {auth, isApproved} = require('../middlewares/auth')

router.post("/login", login)

router.post("/signup", signUp)


module.exports  = router