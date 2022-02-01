const asyncHandler = require('../middleware/async');
const GeoCoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

//@desc GET all the bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).send(res.advanceResult);
})


//@desc get single bootcamp
//@route GET /api/v1/bootcamp/:id
//@access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');
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
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    bootcamp.remove();
    res.status(200).send({ success: true });

})

//@desc Get bootcamps in certian radius
//@route DELETE /api/v1/bootcamps/radius/:zipcode/:distance
//@access private
exports.bootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    //Get latitude and logitude from geocoder
    const loc = await GeoCoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lan = loc[0].longitude

    //get the raidus
    //Divide distance by raidus of the earth i.e earth radius = 3,963 miles || 6378 km

    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [[lan, lat], radius] }
        }
    });
    console.log(bootcamps);

    res.status(200).send({ success: true, total: bootcamps.length, data: bootcamps });

})

//@desc Upload Image
//@route PUT /api/v1/bootcamp/:id/photo
//@access private
exports.uploadBootCampPhoto = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please select file`, 400));
    }

    const file = req.files.photo;
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please select image`, 400));
    }

    //check max file size
    if (file.size > process.env.MAX_FILE_SIZE) {
        return next(new ErrorResponse(`Please image upload less than ${process.env.MAX_FILE_SIZE}`, 400));
    }

    //change file name
    file.name = `image_${req.params.id}${path.parse(file.name).ext}`;

    //move file to uploads folder
    file.mv(`${process.env.FILE_UPLOAD}/${file.name}`, async err => {
        if (err) {
            return next(new ErrorResponse(`Problem while uploading image! Please try again.`, 400));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    })
    console.log(file.name);
    res.status(200).send({ success: true, data: file.name });

})