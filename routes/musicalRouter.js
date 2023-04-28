const express = require('express');
const musicalController = require('../controllers/musicalController');

const router = express.Router();

router.get('', musicalController.getAllMusicalList);
router.get('/search', musicalController.searchMusicalByName);

module.exports = {
  router,
};
