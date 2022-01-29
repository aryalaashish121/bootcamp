const express = require('express');
require('dotenv').config({ path: './config/config.env' });
const app = express();
const morgan = require('morgan');
const bootcampRoute = require('./routes/bootcamp');
const PORT = process.env.PORT ?? 5000;
app.get('/', function (req, res) {
    res.send("hello");
})
class Server {
    constructor() {
        this.runServer();
        this.routes();
    }

    routes() {
        if (process.env.NODE_ENV == "development") {
            app.use(morgan('dev'));
        }
        app.use('/api/v1/bootcamps', bootcampRoute);
    }

    runServer() {
        app.listen(PORT, () => {
            console.log(`Application running on ${process.env.NODE_ENV} mode with port ${PORT}`);
        })
    }
}
new Server();