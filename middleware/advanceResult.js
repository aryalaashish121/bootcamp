const advanceResult = (model, populate) => async (req, res, next) => {
    let query;
    //take a copy of req.query to reqQuery
    let reqQuery = { ...req.query };

    //remove fields which exist
    let removeFields = ['select', 'sort', 'page', 'limit'];

    //remove removefields data which matches reqQuery from it 
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    //convert json to string to mainipulate it to convert lte=$lte
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //creating query
    query = model.find(JSON.parse(queryStr));

    //selectig fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    if (populate) {
        query = query.populate(populate);
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);
    //executing query
    const results = await query;

    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advanceResult = {
        success: true,
        totol: results.length,
        pagination,
        data: results
    };

    next();
}

module.exports = advanceResult;