const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const path = require('path');
const uploadImage = require('express-fileupload');
const errorHandle = require('./middleware/error');
const connectDB = require('./config/database');
require('dotenv').config({ path: './config/config.env' });
const bootcampRoute = require('./routes/bootcamp');
const courseRoute = require('./routes/course');
const authRoute = require('./routes/auth');

const app = express();
const PORT = process.env.PORT ?? 3000;
//set static folder to public
app.use(express.static(path.join(__dirname, 'public')));
app.use(uploadImage());
app.use(express.json());
class Server {
    constructor() {
        this.runServer();
        this.routes();
        connectDB();
    }

    routes() {
        if (process.env.NODE_ENV == "development") {
            app.use(morgan('dev'));
        }
        app.use('/api/v1/bootcamps', bootcampRoute);
        app.use('/api/v1/courses', courseRoute);
        app.use('/api/v1/auth', authRoute);

        app.use(errorHandle);
    }

    runServer() {
        const server = app.listen(PORT, () => {
            console.log(`Application running on ${process.env.NODE_ENV} mode with port ${PORT}`.yellow.bold);
        })

        process.on('unhandledRejection', (err, data) => {
            console.log(`Error: ${err.message}`);
            server.close(() => process.exit(1));
        })
    }


}
new Server();