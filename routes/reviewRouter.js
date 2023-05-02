const express = require('express');
const reviewController = require('../controllers/reviewController');
const { imageUpload } = require('../middlewares/imgUpload');
const { checkLogInToken } = require('../middlewares/auth');
const router = express.Router();

router.get('/', reviewController.getMusicalDetail);
router.post('/new', imageUpload.single('image'), checkLogInToken, reviewController.createReview);
router.delete('/remove/:reviewId', checkLogInToken, reviewController.removeReview);
router.get('/checkorder/:musicalId', checkLogInToken, reviewController.isMusicalOrder);

module.exports = {
  router,
};
