const musicalDao = require('../models/musicalDao');

const musicalList = async (sort, where, limit, offset) => {
  return await musicalDao.musicalList(sort, where, limit, offset);
};

module.exports = {
  musicalList,
};
