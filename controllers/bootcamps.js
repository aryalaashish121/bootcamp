const Bootcamp = require('../models/Bootcamp');
//@desc get all the bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).send({
            success: true,
            total: bootcamps.length,
            data: bootcamps
        });
    } catch (error) {
        res.status(500).send({ error });
    }
}


//@desc get single bootcamp
//@route GET /api/v1/bootcamp/:id
//@access public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return res.status(404).send({ success: false });
        }
        res.status(200).send({ success: true, data: bootcamp });
    } catch (error) {
        res.status(400).send({ success: false, error });
    }

}


//@desc create new bootcamp
//@route POST /api/v1/bootcamp
//@access private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).send({
            success: true,
            data: bootcamp
        });
    } catch (error) {
        res.status(400).send({ success: false, error });
    }
}

//@desc update bootcamp
//@route PUT /api/v1/bootcamp/:id
//@access private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!bootcamp) {
            return res.status(400).send({ success: false });
        }
        res.status(200).send({ success: true, data: bootcamp });
    } catch (error) {
        res.status(400).send({ success: false, error });
    }
}

//@desc delete bootcamp
//@route DELETE /api/v1/bootcamp/:id
//@access private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if (!bootcamp) {
            return res.status(400).send({ success: false });
        }
        res.status(200).send({ success: true });
    } catch (error) {
        res.status(400).send({ success: false });
    }
}