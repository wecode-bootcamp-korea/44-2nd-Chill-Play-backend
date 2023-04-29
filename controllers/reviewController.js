const reviewService = require('../services/reviewService');
const { catchAsync, CustomError } = require('../utils/error');

const getMusicalDetail = catchAsync(async (req, res) => {
  const { musicalId, limit, offset } = req.query;

  const result = await reviewService.getReviewsAndAveragePoint(
    musicalId,
    parseInt(limit),
    parseInt(offset)
  );

  return res.status(200).json(result);
});

const createReview = catchAsync(async (req, res) => {
  const { content, score, musicalId } = req.body;

  if (!content || !score || !musicalId) throw new CustomError(400, 'KEY_ERROR');

  if (!req.file) throw new CustomError(400, 'INVALID_IMAGE_FORMAT');

  const { location: reviewImageUrl } = req.file;
  const userId = req.user.id;

  await reviewService.createReview(userId, content, score, musicalId, reviewImageUrl);

  return res.status(201).json({ message: 'SUCCESS REVIEW' });
});

const removeReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  await reviewService.removeReview(userId, reviewId);

  return res.status(200).json({ message: 'SUCCESS REMOVE REVIEW' });
  3;
});

const isMusicalOrder = catchAsync(async (req, res) => {
  const { musicalId } = req.params;
  const userId = req.user.id;

  await reviewService.isMusicalOrder(userId, musicalId);
  return res.status(200).json({ message: 'SUCCESS' });
});

module.exports = {
  getMusicalDetail,
  createReview,
  removeReview,
  isMusicalOrder,
};
