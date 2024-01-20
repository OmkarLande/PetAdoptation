const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const {auth, isApproved} = require('../middlewares/auth')


router.post('/', applicationController.postApplication);
router.get('/get', applicationController.getAllApplications);

module.exports = router;
