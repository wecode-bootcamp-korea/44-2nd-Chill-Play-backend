const seatDao = require('../models/seatDao');

const getSeats = async (musicalScheduleId) => {
  return await seatDao.getSeats(musicalScheduleId);
};

module.exports = {
  getSeats,
};
