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

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });
module.exports = mongoose.model('Review', ReviewSchema);