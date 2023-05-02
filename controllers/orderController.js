const orderService = require('../services/orderService');
const { catchAsync, CustomError } = require('../utils/error');

const createOrder = catchAsync(async (req, res) => {
  const { totalAmount, musicalId, seatArray, musicalScheduleId } = req.body;

  if (!totalAmount || !musicalId || !seatArray) {
    throw new CustomError(400, 'KEY_ERROR');
  }

  await orderService.createOrder(totalAmount, req.user.id, musicalId, seatArray, musicalScheduleId);

  return res.status(201).json({ message: 'CREATE ORDER SUCESS' });
});

module.exports = {
  createOrder,
};
