const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');

router.post('/kakaologin', userController.kakaoLogin);

module.exports = { router };
