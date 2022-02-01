const express = require('express');
const advanceResult = require('../middleware/advanceResult');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('../controllers/user');

const router = express.Router({ mergeParams: true });

router.use(auth);
router.use(authorize('admin'));
router
    .route('/')
    .get(advanceResult(User), getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;