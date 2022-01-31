const express = require('express');
const { allCourses } = require('../controllers/courses');
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(allCourses);

module.exports = router;