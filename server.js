const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const path = require('path');
const cors = require('cors');
//security
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const expressRateLimit = require('express-rate-limit');

const cookieParser = require('cookie-parser');
const uploadImage = require('express-fileupload');
const errorHandle = require('./middleware/error');
const connectDB = require('./config/database');
require('dotenv').config({ path: './config/config.env' });
const bootcampRoute = require('./routes/bootcamp');
const courseRoute = require('./routes/course');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const reviews = require('./routes/review');
const app = express();
const PORT = process.env.PORT ?? 3000;
//set static folder to public
app.use(express.static(path.join(__dirname, 'public')));
app.use(uploadImage());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
//set security headers
app.use(helmet());
app.use(xssClean());
app.use(hpp());

const limiter = expressRateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});

app.use(limiter);
//enable cors
app.use(cors());
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
        app.use('/api/v1/users', userRoute);
        app.use('/api/v1/reviews', reviews);

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