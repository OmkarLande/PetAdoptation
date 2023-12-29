const cloudinary = require("../config/cloudinary")
const Pet = require('../models/petModel');

module.exports = {
  addPet: async (req, res) => {
    try {
        const { name, species, breed, vaccination } = req.body;
        const image = req.files.image
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
            public_id: `${Date.now()}`, 
            resource_type: "auto"
        });
        // Create a new pet with Cloudinary image URL
        const newPet = new Pet({
          name,
          species,
          breed,
          vaccination,
          imageUrl: result.secure_url,
        });
        // Save the pet to the database
        await newPet.save();
        res.status(201).json(newPet);    
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAllPets: async (req, res) => {
    try {
        const pets = await Pet.find();
        res.status(200).json(pets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
