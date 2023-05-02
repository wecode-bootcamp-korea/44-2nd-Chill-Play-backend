const express = require('express');
const musicalController = require('../controllers/musicalController');

const router = express.Router();

router.get('', musicalController.getAllMusicalList);
router.get('/search', musicalController.searchMusicalByName);
router.get('/detail/:musicalId', musicalController.getMusicalDetail);

module.exports = {
  router,
};
