const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

router.post('/pet', petController.addPet);
router.get('/pets', petController.getAllPets);

module.exports = router;
