const express = require('express');
const router = express.Router();

const userRouter = require('./userRouter');
const musicalRouter = require('./musicalRouter');
const musicalRouter = require('./musicalRouter');

router.use('/users', userRouter.router);
router.use('/musicals', musicalRouter.router);

module.exports = router;
