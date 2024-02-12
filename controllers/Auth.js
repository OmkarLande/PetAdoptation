const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require('../mails/mailSender')


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

exports.changePassword = async(req,res) =>{
    try{
        //fetchData
        const { email, otp} = req.body;
        const userDetails = await User.findOne({email});

        //newPass confirmPass
        const {newPassword, confirmPassword} = req.body;

        
        
        if(otp != userDetails.otp){
            //not matched
            return res.status(402).json({
                success:false,
                message:'Otp is incorrect',
            });
        }

        //newPass is same as confirmPass?
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password is not matched with confirm password",
            });
        }
        //update in DB
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updateUserDetails =await User.findByIdAndUpdate(
            userDetails._id,
            {password:encryptedPassword},
            {new:true},
        );
        const body = "Your Password has been changed recently!!! Login to our website..."
        //send Mail
        try{
            const emailResponse = await mailSender(
                updateUserDetails.email,"Your Password Changed!", body  );
                console.log("Email sent successfully: ", 
                emailResponse.response);
            }
        catch(error){
            console.log("Error while sending email:", error);
            return res.status(500).json({
                success:false,
                message:'Error occured while sending email',
                error:error.message,
            });
        }
        return res.status(200).json({
            success:true,
            message:'Password changed',
        });
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({
            success:false,
            message:'Login Failed!',
        });
    }
};

exports.sendOTP = async (req, res) => {
	try {
		const { email } = req.body; 

		// Check if user is already present
		const checkUserPresent = await User.findOne({ email });

		// If user found with provided email
		if (!checkUserPresent) {
			return res.status(401).json({
				success: false,
				message: `User is not Registered`,
			});
		}

		var otp = otpGenerator.generate(4, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		console.log("OTP", otp);
        checkUserPresent.otp = otp;
        await checkUserPresent.save();
		

        //send Mail
        try {
            const emailResponse = await mailSender(
                checkUserPresent.email, 'OTP', otp,
            );
            console.log("Email sent successfully: ", emailResponse.response)
        }
        catch (error) {
            console.log("Error while sending email:", error);
            return res.status(501).json({
                success: false,
                message: 'Error occured while sending email',
                error: error.message,
            });
        }
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({
            success: false, 
            error: error,
        });
	}
};