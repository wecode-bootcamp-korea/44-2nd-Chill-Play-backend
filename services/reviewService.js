const reviewDao = require('../models/reviewDao');
const orderDao = require('../models/orderDao');
const { CustomError } = require('../utils/error');
const { timeForToday } = require('../utils/dateCalculation');
const { OrderStatusEnum } = require('../models/eum');

const getReviewsAndAveragePoint = async (musicalId, limit, offset) => {
  const [getReviewsByMusicalId, getAverageReviewScore] = await Promise.all([
    reviewDao.getReviewsByMusicalId(musicalId, limit, offset),
    reviewDao.getAverageReviewScore(musicalId),
  ]);

  const createTime = await getReviewsByMusicalId.map((item) => item.createTime);
  const timeAgo = await createTime.map((item) => timeForToday(item));

  const newGetReviewsByMusicalId = await getReviewsByMusicalId.map((item, index) => {
    return { ...item, timeAgo: timeAgo[index] };
  });

  return [{ averagePoint: getAverageReviewScore.averageScore, reviews: newGetReviewsByMusicalId }];
};

const createReview = async (userId, content, score, musicalId, reviewImageUrl) => {
  return await reviewDao.createReview(userId, content, score, musicalId, reviewImageUrl);
};

const removeReview = async (userId, reviewId) => {
  return await reviewDao.removeReview(userId, reviewId);
};

const isMusicalOrder = async (userId, musicalId) => {
  const orderStatusId = OrderStatusEnum.결제완료;

  const checkOrder = await orderDao.checkOrder(userId, musicalId, orderStatusId);

  if (!checkOrder) {
    throw new CustomError('403', 'FAIL');
  }

  return checkOrder;
};

module.exports = {
  getReviewsAndAveragePoint,
  createReview,
  removeReview,
  isMusicalOrder,
};
