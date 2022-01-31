const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const Bootcamp = require('./models/Bootcamp');
const { json } = require('express/lib/response');
const { deleteMany } = require('./models/Bootcamp');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connected for seeder");
});

// read the json file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

//import into db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log(`Data imported..`.green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

//Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        console.log("Data destroyed".red.inverse);
        process.exit();

    } catch (error) {
        console.log(error);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} else {
    console.log('Provide arg');
}