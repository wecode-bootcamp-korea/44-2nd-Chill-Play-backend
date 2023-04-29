const express = require('express');
const router = express.Router();

const userRouter = require('./userRouter');
const musicalRouter = require('./musicalRouter');
const orderRouter = require('./orderRouter');
const reviewRouter = require('./reviewRouter');

router.use('/users', userRouter.router);
router.use('/musicals', musicalRouter.router);
router.use('/reviews', reviewRouter.router);
router.use('/orders', orderRouter.router);

module.exports = router;
