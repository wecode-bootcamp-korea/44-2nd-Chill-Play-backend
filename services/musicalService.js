const musicalDao = require('../models/musicalDao');

const getAllMusicalList = async (sort, where) => {
  return await musicalDao.getAllMusicalList(sort, where);
};

const searchMusicalByName = async (keyword) => {
  return await musicalDao.searchMusicalByName(keyword);
};

module.exports = {
  getAllMusicalList,
  searchMusicalByName,
}
