const musicalService = require('../services/musicalService');
const { catchAsync } = require('../utils/error');

const getAllMusicalList = catchAsync(async (req, res) => {
  const { sort, where } = req.query;
  const musicalList = await musicalService.getAllMusicalList(sort, where);
  return res.status(200).json(musicalList);
});

const searchMusicalByName = catchAsync(async (req, res) => {
  const { keyword, limit, offset } = req.query;

  const searchMusicalByName = await musicalService.searchMusicalByName(keyword, parseInt(limit),parseInt(offset));

  return res.status(200).json(searchMusicalByName);
});

module.exports = {
  getAllMusicalList,
  searchMusicalByName,
}


