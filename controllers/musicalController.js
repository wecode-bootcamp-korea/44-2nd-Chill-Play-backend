const musicalService = require('../services/musicalService');
const { catchAsync } = require('../utils/error');

const musicalList = catchAsync(async (req, res) => {
  const { sort, where, limit = 8, offset = 0 } = req.query;
  const musicalList = await musicalService.musicalList(sort, where, parseInt(limit), parseInt(offset));
  return res.status(200).json(musicalList);
});

module.exports = {
  musicalList,
};
