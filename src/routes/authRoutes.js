const express = require('express');
const router = express.Router();

const { isAuth } = require('../middleware/authentication');
const { register, login, checkAuth } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/auth', isAuth, checkAuth);

module.exports = router;
