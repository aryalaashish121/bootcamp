const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');
const errorResponse = require('../utils/errorResponse');

//@desc Get all the reviews
//@route GET /api/v1/reviews
//@access private/admin
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });

        res.status(200).send({
            success: true,
            total: reviews.total,
            data: reviews
        });
    } else {
        res.status(200).send(res.advanceResult);
    }
});

//@desc Get single bootcamp review
//@route GET /api/v1/bootcamps/:id/reviews
//@access private/admin
exports.getReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(new errorResponse('Review not found', 404));
    }
    res.status(200).send({ success: true, data: review });
});

//@desc Create single Review
//@route POST /api/v1/bootcamps/:bootcampId/reviews
//@access private/admin
exports.createReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;


    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new errorResponse(`Bootcamp with id ${req.params.bootcampId} not found`, 404));
    }

    const review = await Review.create(req.body);
    if (!review) {
        return next(new errorResponse('Review not added!', 400));
    }

    res.status(200).send({
        success: true,
        data: review
    });
});


//@desc Update single user
//@route PUT /api/v1/reviews/:id
//@access private/admin
exports.updateReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!review) {
        return next(new errorResponse('Review not found!', 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse('You are not authorized for this action!', 404));
    }
    res.status(200).send({
        success: true,
        data: review
    });
});

//@desc Delete single review
//@route DELETE /api/v1/reviews/:id
//@access private/admin
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(new errorResponse('Review not found!', 404));
    }
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse('You are not authorized for this action!', 404));
    }
    await review.remove();
    res.status(200).send({
        success: true,
    });
});