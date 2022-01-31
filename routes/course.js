const express = require('express');
const { allCourses, createCourse, getCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const router = express.Router({ mergeParams: true });
router
    .route('/')
    .get(allCourses)
    .post(createCourse);


router
    .route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);
module.exports = router;