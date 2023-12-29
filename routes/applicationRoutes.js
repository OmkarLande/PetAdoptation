const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/', applicationController.postApplication);
router.get('/get', applicationController.getAllApplications);

module.exports = router;
