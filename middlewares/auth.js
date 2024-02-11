const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {

        //token extraction
        const token = req.cookies.token
            || req.body.token
            || req.header("Authorisation").replace("Bearer", "");
        console.log("Token Extracted");
        //token missing

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'token is missing',
            });
        }
        //verify token
        try {z
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (error) {
            //token issue
            return res.status(401).json({
                success: false,
                message: 'token is not valid',
            });
        }
        next();
        console.log("1");
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'error while token validation',
        });
    }
};

exports.isApproved = async (req, res, next) => {
    try {
        if (req.user.approved !== false) {
            return res.status(401).json({
                success: false,
                message: 'This is protected route only for approved users',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User is cannot be approved",
        });
    }
};