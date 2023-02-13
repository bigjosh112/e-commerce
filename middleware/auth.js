const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

 exports.auth = asyncHandler(async(req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        //console.log(token);
        try{
            if(token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                //console.log(decoded.id);
                const user = await User.findById(decoded?.id)
                //console.log(user);
                 req.user = user;
                
                next();
            }
        } catch(error){
            throw new Error("Not Authorized, Token expired, Please Login again")
        }
    } else {
        throw new Error("There is no token attached to header")
    }
});


exports.isadmin = asyncHandler(async (req, res, next) => {
    //console.log(req.user)
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if (adminUser.role !== "admin") {
        throw new Error("You are not an admin")
    } else {
        next();
    }
})
//module.exports = auth