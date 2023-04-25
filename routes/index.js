const express = require('express');
<<<<<<< HEAD
const router = express.Router();

const userRouter = require('./userRouter');

router.use('/users', userRouter.router);
=======
const musicalRouter = require('./musicalRouter');

const router = express.Router();

router.use('/musicals', musicalRouter.router);
>>>>>>> ab085c4 ([ADD] 뮤지컬 필터 기능 추가)

module.exports = router;
