const express = require('express');
const orderController = require('../controllers/orderController');
const { checkLogInToken } = require('../middlewares/auth');

const router = express.Router();

router.post('', checkLogInToken, orderController.createOrder);

module.exports = {
  router,
};
