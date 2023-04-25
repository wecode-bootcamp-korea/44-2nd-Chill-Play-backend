const express = require('express');
const musicalController = require('../controllers/musicalController');

const router = express.Router();

router.get('', musicalController.musicalList);

module.exports = {
  router,
};
