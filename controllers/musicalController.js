const musicalService = require('../services/musicalService');
const { catchAsync } = require('../utils/error');

const getAllMusicalList = catchAsync(async (req, res) => {
  const { sort, where } = req.query;
  const musicalList = await musicalService.getAllMusicalList(sort, where);
  return res.status(200).json(musicalList);
});

module.exports = {
  getAllMusicalList,
};
