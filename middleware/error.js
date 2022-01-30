const errorHandle = (err, req, res, next) => {
    console.log(err.stack.red);
    res.status(500).send({
        success: false,
        error: err.message
    });
}

module.exports = errorHandle;