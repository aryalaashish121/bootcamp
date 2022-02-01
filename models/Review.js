const mongoose = require('mongoose');
const ReviewSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter review title'],
        trim: true
    },
    text: {
        type: String,
        required: [false, 'Please enter text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please provide rating between 1 to 10'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: [true, 'Please select bootcamp!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true]
    }

});
//prevent user from submiting multiple review on same bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

//calculating avg ratings

ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        })
    } catch (error) {
        console.log(error);
    }
}

ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.bootcamp);
})

ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.bootcamp);
})
module.exports = mongoose.model('Review', ReviewSchema);