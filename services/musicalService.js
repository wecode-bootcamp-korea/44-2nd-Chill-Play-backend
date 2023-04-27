const musicalDao = require('../models/musicalDao');

const getAllMusicalList = async (order, where) => {
  return await musicalDao.getAllMusicalList(order, where);
};

module.exports = {
  getAllMusicalList,
};
