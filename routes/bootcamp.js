const express = require('express');
const router = express.Router();
const { getBootcamps, getBootcamp, updateBootcamp, createBootcamp, deleteBootcamp, bootcampsInRadius, uploadBootCampPhoto } = require('../controllers/bootcamps');
const courseRoute = require('./course');
const Bootcamp = require('../models/Bootcamp');
const advanceResult = require('../middleware/advanceResult');

const { auth, authorize } = require('../middleware/auth');

router.route('/radius/:zipcode/:distance').get(bootcampsInRadius);

router.use('/:bootcampId/courses', courseRoute);
router.route('/:id/photo').put(auth, uploadBootCampPhoto);
router
    .route('/')
    .get(advanceResult(Bootcamp, 'courses'), getBootcamps)
    .post(auth, authorize('publisher', 'admin'), createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(auth, updateBootcamp)
    .delete(auth, deleteBootcamp);
module.exports = router;