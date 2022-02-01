const express = require('express');
const router = express.Router();
const { getBootcamps, getBootcamp, updateBootcamp, createBootcamp, deleteBootcamp, bootcampsInRadius, uploadBootCampPhoto } = require('../controllers/bootcamps');
const courseRoute = require('./course');
const Bootcamp = require('../models/Bootcamp');
const advanceResult = require('../middleware/advanceResult');
router.route('/radius/:zipcode/:distance').get(bootcampsInRadius);

router.use('/:bootcampId/courses', courseRoute);
router.route('/:id/photo').put(uploadBootCampPhoto);
router
    .route('/')
    .get(advanceResult(Bootcamp, 'courses'), getBootcamps)
    .post(createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);
module.exports = router;