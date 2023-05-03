const express = require('express');

const  seatController = require('../controllers/seatController');

const router = express.Router();

router.get('/:musicalScheduleId', seatController.getSeats);

module.exports = {
    router,
}
