const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
//@desc get all the bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
    res.status(200).send({
        success: true,
        total: bootcamps.length,
        data: bootcamps
    });

})


//@desc get single bootcamp
//@route GET /api/v1/bootcamp/:id
//@access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    res.status(200).send({ success: true, data: bootcamp });

})


//@desc create new bootcamp
//@route POST /api/v1/bootcamp
//@access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).send({
        success: true,
        data: bootcamp
    });

})

//@desc update bootcamp
//@route PUT /api/v1/bootcamp/:id
//@access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true,
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    res.status(200).send({ success: true, data: bootcamp });
})

//@desc delete bootcamp
//@route DELETE /api/v1/bootcamp/:id
//@access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    res.status(200).send({ success: true });

})