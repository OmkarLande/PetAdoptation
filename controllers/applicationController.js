const cloudinary = require('../config/cloudinary')
const Application = require('../models/applicationModel');

module.exports = {
    postApplication: async (req, res) => {
        try {
            const { fullName, email, phoneNumber, q1, q2, q3 } = req.body;
            const photo = req.files.photo

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            
            // Validate phone number format (10 digits)
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phoneNumber)) {
                return res.status(400).json({ error: 'Invalid phone number format' });
            }

            // Validate q1, q2, q3 values
            const validAnswers = ['yes', 'no', 'Yes', 'No'];
            if (!validAnswers.includes(q1) || !validAnswers.includes(q2) || !validAnswers.includes(q3)) {
                return res.status(400).json({ error: 'Invalid values for q1, q2, or q3' });
            }
            
            // Upload photo to Cloudinary
            const result = await cloudinary.uploader.upload(photo.tempFilePath, {
                public_id: `${Date.now()}`,
                resource_type: "auto"
            });

            // Create a new application with Cloudinary photo URL
            const newApplication = new Application({
                fullName,
                email,
                phoneNumber,
                photoUrl: result.secure_url,
                q1,
                q2,
                q3,
            });

            // Save the application to the database
            await newApplication.save();
            res.status(201).json(newApplication);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getAllApplications: async (req, res) => {
        try {
            const applications = await Application.find();
            res.status(200).json(applications);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};
