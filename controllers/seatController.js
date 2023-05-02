const { catchAsync } = require('../utils/error');
const  seatService = require('../services/seatService');

const getSeats = catchAsync(async (req, res) => {
   const {musicalScheduleId} = req.params
  const result = await seatService.getSeats(
    musicalScheduleId
);
  res.status(200).json(result);
});


module.exports = {
  getSeats,
};
