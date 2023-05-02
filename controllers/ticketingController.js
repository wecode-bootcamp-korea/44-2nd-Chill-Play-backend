const { catchAsync } = require('../utils/error');
const  ticketingService = require('../services/ticketingService');

const getTicketing = catchAsync(async (req, res) => {
  const {
    musical,
    theater,
    date
  } = req.query 

  const result = await ticketingService.getTicketing(
    musical,
    theater,
    date
);
  res.status(200).json(result);
});


module.exports = {
  getTicketing,
};
