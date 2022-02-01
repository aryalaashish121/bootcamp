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
    const token = user.getSignedJwtToken();

    res.status(201).send({ success: true, token, data: user });
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

    //signed token
    const token = user.getSignedJwtToken();

    res.status(200).send({ success: true, token })
})

