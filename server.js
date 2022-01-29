const express = require('express');
require('dotenv').config({ path: './config/config.env' });
const app = express();
const PORT = process.env.PORT ?? 5000;
app.get('/', function (req, res) {
    res.send("hello");
})

app.listen(PORT, () => {
    console.log(`Application running on ${process.env.NODE_ENV} mode with port ${PORT}`);
})