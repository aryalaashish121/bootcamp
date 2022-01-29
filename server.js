const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/database');
require('dotenv').config({ path: './config/config.env' });
const app = express();
const PORT = process.env.PORT ?? 5000;
const bootcampRoute = require('./routes/bootcamp');

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