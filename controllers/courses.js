const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');

//@desc Get all the course
//@route /api/v1/courses
//@route /api/v1/bootcamps/:bootcampId/courses
//@access public
exports.allCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find();
    }

    //executing query
    const courses = await query;
    res.status(200).send({
        success: true,
        total: courses.length,
        data: courses
    });
})