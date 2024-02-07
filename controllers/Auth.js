const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");


exports.signUp = async(req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required'
            })
        };
        //password matching
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password not matched',
            })
        };
        //alredy user?
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User is alredy register',
            })
        };
        //hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        return res.status(200).json({
            success: true,
            message: 'User is registered',
            user,
        });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "User cannot registered, try again",
        })
    }
};

exports.login = async(req, res) => {
    try {
        //data fetch
        const { email, password } = req.body;
        //validate?
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: 'All fields are required',
            });
        }
        //alredyUser?
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not exists',
            });
        }
        //passCheck?
        if (await bcrypt.compare(password, user.password)) {

            //creteToken
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "3h",
            });

            user.token = token;
            user.password = undefined;

            //creteCookie
            const options = {
                expires: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'Logged in successful'
            });
        }
        else {
            return res.status(500).json({
                success: false,
                message: 'Password not matched',
            });
        }

    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: 'Login Failed!',
        });
    }
}

exports.approveUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const isUser = await User.findById(userId)
        const isApproved = isUser.approved
        if(isApproved == false){
            const user = await User.findByIdAndUpdate(userId, { approved: true }, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'User approved successfully', user });
        }else{
            return res.status(201).json({ message: 'Already Approved'});
        }


    } catch (error) {
        console.error('Error approving user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};