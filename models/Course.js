const mongoose = require('mongoose');
const CourseSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter course title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please enter course description']
    },
    weeks: {
        type: Number,
        required: [true, 'Please enter course weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please enter tution fee!']
    },
    minimumSkill: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: [true, 'Please select your skill']
    },
    scholarshipAvaiable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: [true, 'Please select bootcamp!']
    }

});


module.exports = mongoose.model('Course', CourseSchema);