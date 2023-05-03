const express = require('express');

const  ticketingController = require('../controllers/ticketingController');

const router = express.Router();

router.get('', ticketingController.getTicketing);

module.exports = {
    router,
}
