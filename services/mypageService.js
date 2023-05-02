const mypageDao = require('../models/mypageDao');

const getOrderInfo = async (userId, profileImage, limit) => {
  const orderInfo = await mypageDao.inquireOrderInfo(userId, limit);

  return [{ profileImage: profileImage, orderInfo: orderInfo }];
};

module.exports = {
  getOrderInfo,
};
