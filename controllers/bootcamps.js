
//@desc get all the bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = (req, res, next) => {
    res.send("all bootcamps");
}


//@desc get single bootcamp
//@route GET /api/v1/bootcamp/:id
//@access public
exports.getBootcamp = (req, res, next) => {
    res.send("single bootcamp");
}


//@desc create new bootcamp
//@route POST /api/v1/bootcamp
//@access private
exports.createBootcamp = (req, res, next) => {
    res.send("create new bootcamp");
}

//@desc update bootcamp
//@route PUT /api/v1/bootcamp/:id
//@access private
exports.updateBootcamp = (req, res, next) => {
    res.send("update bootcamp");
}

//@desc delete bootcamp
//@route DELETE /api/v1/bootcamp/:id
//@access private
exports.deleteBootcamp = (req, res, next) => {
    res.send("delete bootcamp");
}