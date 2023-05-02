const express = require('express');

const router = express.Router();
const mypageController = require('../controllers/mypageController');
const { checkLogInToken } = require('../middlewares/auth');

router.get('/info', checkLogInToken, mypageController.getOrderInfo);

module.exports = { router };
