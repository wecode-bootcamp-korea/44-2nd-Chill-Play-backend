const musicalDao = require('../models/musicalDao');

const getAllMusicalList = async (sort, where) => {
  return await musicalDao.getAllMusicalList(sort, where);
};

module.exports = {
  getAllMusicalList,
};
