const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
//@desc Get all the course
//@route /api/v1/courses
//@route /api/v1/bootcamps/:bootcampId/courses
//@access public
exports.allCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
        const courses = await query;
        return res.status(200).send({
            success: true,
            total: courses.length,
            data: courses
        });
    } else {
        res.status(200).send(res.advanceResult);
    }

})


//@desc get single bootcamp
//@route GET /api/v1/bootcamp/:id
//@access public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if (!course) {
        return next(new ErrorResponse(`Course not found with id ${req.params.id}`, 404));
    }
    res.status(200).send({ success: true, data: course });

})


//@desc Create new course with bootcamp
//@route POST /api/v1/bootcamps/:bootcampId/courses
//@access private
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.bootcampId}`));
    }
    const course = await Course.create(req.body);
    res.status(201).send({
        success: true,
        data: course
    });
})

//@desc update courses
//@route PUT /api/v1/courses/:id
//@access private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true,
    });
    if (!course) {
        return next(new ErrorResponse(`Course not found with id ${req.params.id}`, 404));
    }
    res.status(200).send({ success: true, data: course });
})

//@desc delete course
//@route DELETE /api/v1/course/:id
//@access private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`Course not found with id ${req.params.id}`, 404));
    }
    course.remove();
    res.status(200).send({ success: true });

})
