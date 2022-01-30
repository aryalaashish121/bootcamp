const mongoose = require('mongoose');

const bootcampSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please add a name'],
        unique: [true, 'Name have to be unique'],
        trim: true,
        maxLength: [50, 'Max length of char is 50'],
    },

    slug: String,
    description: {
        type: String,
        required: [true, 'Please add description'],
        maxLength: [500, 'Can only accept 500 char.'],
    },

    website: {
        type: String,
        match: [/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
            'Enter vaild website url']
    },
    phone: {
        type: String,
        maxLength: [20, 'Please enter vaild phone '],
    },
    email: {
        type: String,
        match: [
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            'Please enter vaild email!'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please enter bootcamp address'],
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        }
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
    careers: {
        type: [String],
        required: [true, 'Please selected careers'],
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Others'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [1, 'Rating cannot be more than 10'],
    },
    averageCost: {
        type: Number,
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false,
    },
    jobAssistance: {
        type: Boolean,
        default: false,
    },
    jobGuarantee: {
        type: Boolean,
        default: false,
    },
    acceptGi: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Bootcamp', bootcampSchema);