const  ticketingDao = require('../models/ticketingDao');

const getTicketing = async (musicalId, theaterId, date) => {
  return await ticketingDao.getMusicalList(musicalId, theaterId, date);
};

module.exports = {
  getTicketing,
};
