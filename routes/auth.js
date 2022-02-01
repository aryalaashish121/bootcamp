const express = require('express');
const { login, register, getMe } = require('../controllers/auth');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/me').get(auth, getMe);
module.exports = router;