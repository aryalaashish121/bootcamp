const asyncHandler = require('../middleware/async');
const GeoCoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const { findById } = require('../models/Bootcamp');


//@desc GET all the bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    //take a copy of req.query to reqQuery
    let reqQuery = { ...req.query };

    //remove fields which exist
    let removeFields = ['select', 'sort', 'page', 'limit'];

    //remove removefields data which matches reqQuery from it 
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    //convert json to string to mainipulate it to convert lte=$lte
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //creating query
    query = Bootcamp.find(JSON.parse(queryStr)).populate({ path: 'courses' });

    //selectig fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);
    //executing query
    const bootcamps = await query;

    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    res.status(200).send({
        success: true,
        total: bootcamps.length,
        pagination,
        data: bootcamps
    });

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