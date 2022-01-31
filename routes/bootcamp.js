const express = require('express');
const router = express.Router();
const { getBootcamps, getBootcamp, updateBootcamp, createBootcamp, deleteBootcamp, bootcampsInRadius } = require('../controllers/bootcamps');

router.route('/radius/:zipcode/:distance').get(bootcampsInRadius);
router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);


module.exports = router;