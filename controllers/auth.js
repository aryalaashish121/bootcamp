const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');


//@desc Register new user
//@route POST /api/v1/auth/register
//@access public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const user = await User.create({
        name,
        password,
        email,
        role
    });
    if (!user) {
        return next(new errorResponse(`Could not register`, 400));
    }

    sendTokenResponse(user, 200, res);

});

//@desc Login user
//@route POST /api/v1/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new errorResponse(`Email and password required`, 401));
    }

    const user = await User.findOne({ email: email }).select('+password');
    if (!user) {
        return next(new errorResponse(`Invalid Credentials`, 401));
    }

    //match user entered password to hasedpassword
    if (! await user.matchPassword(password)) {
        return next(new errorResponse(`Invalid Credentials`, 401));
    }

    sendTokenResponse(user, 200, res);
})

//@desc Register new user
//@route POST /api/v1/auth/register
//@access public
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).send({
        success: true,
        data: user
    })

});

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .send({
            success: true,
            token
        });
}

