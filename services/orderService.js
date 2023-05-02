const orderDao = require('../models/orderDao');
const { CustomError } = require('../utils/error');

const createOrder = async (totalAmount, userId, musicalId, seatArray, musicalScheduleId) => {
  return await orderDao.createOrder(totalAmount, userId, musicalId, seatArray, musicalScheduleId);
};

module.exports = {
  createOrder,
};
