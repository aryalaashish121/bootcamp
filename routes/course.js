const express = require('express');
const { allCourses, createCourse, getCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const advanceResult = require('../middleware/advanceResult');
const Course = require('../models/Course');

const { auth, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });
router
    .route('/')
    .get(advanceResult(Course, 'bootcamp'), allCourses)
    .post(auth, authorize('publisher', 'admin'), createCourse);

router
    .route('/:id')
    .get(getCourse)
    .put(auth, updateCourse)
    .delete(auth, deleteCourse);
module.exports = router;