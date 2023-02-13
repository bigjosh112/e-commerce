const { resourceLimits } = require('worker_threads');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { findOne } = require('../models/userModel');
const generateToken = require('../config/jwt');
//const router = require('../routes/authRoutes');
const auth = require('../middleware/auth') 
const validateMongoDbId = require('../utils/validationMongodbid')
const generateRefreshToken = require('../config/refreshtoken');
const jwt  = require('jsonwebtoken');


//create a user
exports.createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser =  await User.findOne({email: email});
        if(!findUser) {
            //create a new user
            const newUser = await User.create(req.body);
           return res.json(newUser);
        } else {
            throw new Error("User Already Exists") 
        }
    
})

//login in a user
exports.loginUserCtrl = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    //console.log(email, password)

    //token
    //const token = generateToken._id

    //checks if user exists or not
    const findUser = await User.findOne({email: email})
    if(findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken
            },
            {
                new: true
            }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.status(200).json({
            findUser,
        token:generateToken(findUser?._id)})
    } else {
        throw new Error("Invalid credentials")
    }
});

//handles refresh token
exports.handleRefreshToken = asyncHandler( async (req, res) => {
    const cookie = req.cookies
    //console.log(cookie)
    if(!cookie?.refreshToken) throw new Error('No token refresh token in the cookie');
    const refreshToken = cookie.refreshToken
    //console.log(refreshToken)
    const user = await User.findOne({refreshToken})
    if(!user) throw new Error('No refresh token present in the db')
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode)=> {
        //console.log(decode)
        if(err || user.id !== decode.id) throw new Error('There is something wrong with refresh token')
    })
    const accessToken = generateToken(user?.id)
    res.json({accessToken})
})

//logout functionality
exports.logout = asyncHandler(async (req, res)=> {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error ('No Refresh token in cookie')
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); //forbidden
    }
    await User.findOneAndUpdate('refreshToken',{
        refreshToken: "",
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); //forbidden
})


//update a user
exports.updateaUser = asyncHandler(async (req, res) => {

    const {_id} = req.user
    //console.log(req.user)
    validateMongoDbId(_id)
    try{
        const updateaUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile
            },
            {
                new: true
            }
        );
        res.json(updateaUser)
    } catch(error) {
        throw new Error(error)
    }
})

//get all user
exports.getallUser = asyncHandler(async (req,res) => {
    try{
        const getUsers = await User.find();
        res.json(getUsers)
    } catch(error) {
        throw new Error(error);
    }
})

//get a user
exports.getaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    //console.log(req.user)
    try{
        const getaUser = await User.findById(id)
        res.json({
            getaUser
        })
    } catch(error) {
        throw new Error(error)
    }
})


//delete a user
exports.deleteaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id)
    try{
        const deleteaUser = await User.findByIdAndDelete(id)
        res.json({
            deleteaUser
        })
    } catch(error) {
        throw new Error(error)
    }
})

exports.blockUser = asyncHandler(async (req, res, next) => {
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true
            },
    {
        new: true
    });
    res.json({
        message: "User blocked"
        
    })
    } catch (error){
        throw new Error(error)
    }
})

exports.unblockUser = asyncHandler(async (req, res, next) => {
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false
            },
    {
        new: true
    });
    res.json({
        message: "User Unblocked"
    })
    } catch (error){
        throw new Error(error)
    }

});


//update password
exports.updatePassword = asyncHandler(async(req, res)=> {
    const { _id } = req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    console.log(_id)
    const user = await User.findById(_id);
    if(password) {
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);

    }else {
        res.json(user);
    }
});

exports.forgotPasswordToken = asyncHandler(async(req, res)=> {
    const {email} = req.body;
    const user = await User.findOne({ email});
    if(!user) throw new Error('This email is not found');
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
    }catch(error){
        throw new Error(error)
    }
})
//module.export = this.createUser