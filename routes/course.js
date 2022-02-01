const express = require('express');
const { allCourses, createCourse, getCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const advanceResult = require('../middleware/advanceResult');
const Course = require('../models/Course');
const router = express.Router({ mergeParams: true });
router
    .route('/')
    .get(advanceResult(Course, 'bootcamp'), allCourses)
    .post(createCourse);


router
    .route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);
module.exports = router;