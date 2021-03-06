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
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true]
    }

});

CourseSchema.statics.getAverageCourse = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10 * 10)
        })
    } catch (error) {
        console.log(error);
    }
}

CourseSchema.post('save', function () {
    this.constructor.getAverageCourse(this.bootcamp);
})

CourseSchema.pre('remove', function () {
    this.constructor.getAverageCourse(this.bootcamp);
})

module.exports = mongoose.model('Course', CourseSchema);