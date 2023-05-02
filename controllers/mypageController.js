const mypageService = require('../services/mypageService');
const { catchAsync } = require('../utils/error');

const getOrderInfo = catchAsync(async (req, res) => {
  const { limit } = req.query;
  const userId = req.user.id;
  const profileImage = req.user.profileImage;

  const inquireOrderInfo = await mypageService.inquireOrderInfo(userId, profileImage, parseInt(limit));
  return res.status(200).json(inquireOrderInfo);
});

module.exports = {
  getOrderInfo,
};
