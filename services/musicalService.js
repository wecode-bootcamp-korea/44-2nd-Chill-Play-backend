const musicalDao = require('../models/musicalDao');
const { CustomError } = require('../utils/error');

const getAllMusicalList = async (sort, where) => {
  return await musicalDao.getAllMusicalList(sort, where);
};
const searchMusicalByName = async (keyword, limit, offset) => {
  return await musicalDao.searchMusicalByName(keyword, limit, offset);
};

const getMusicalDetail = async (musicalId) => {
  const checkMusicalId = await musicalDao.checkMusicalId(musicalId);

  if (!checkMusicalId) {
    throw new CustomError(404, 'MUSICAL_NOT_VALUE');
  }

  const getMusicalDetail = await musicalDao.getMusicalDetail(musicalId);
  const getGenderBookingRate = await musicalDao.getGenderBookingRate(musicalId);
  const getAgeBookingRate = await musicalDao.getAgeBookingRate(musicalId);

  const [genderBookingRate] = getGenderBookingRate.map((row) => Object.values(row));
  getMusicalDetail.genderBookingRate = genderBookingRate;

  const ageBookingRate = getAgeBookingRate.map((row) => row.ageRangeBookingRate);
  getMusicalDetail.ageBookingRate = ageBookingRate;

  return getMusicalDetail;
};

module.exports = { getMusicalDetail, getAllMusicalList, searchMusicalByName };
