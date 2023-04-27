const appDataSource = require('../models/appDataSource');

const getRating = async (musicalId) => {
  const today = new Date().toISOString().slice(0, 10);

  const musicalData = await appDataSource.query(
    `SELECT SUM(dsc.sold_seat) AS total_sold_seat
     FROM daily_sales_count dsc
     JOIN musical_schedules ms ON dsc.musical_schedule_id = ms.id
     JOIN musical_date md ON ms.musical_date_id = md.id
     WHERE md.date >= ? AND ms.musical_id = ?`,
    [today, musicalId]
  );
  console.log(musicalData)
  const soldSeatSum = musicalData[0].total_sold_seat || 0;

  const totalData = await appDataSource.query(
    `SELECT SUM(dsc.sold_seat) AS total_sold_seat
     FROM daily_sales_count dsc
     JOIN musical_schedules ms ON dsc.musical_schedule_id = ms.id
     JOIN musical_date md ON ms.musical_date_id = md.id
     WHERE md.date >= ?`,
    [today]
  );
  console.log(totalData)
  const totalSoldSeat = totalData[0].total_sold_seat || 0;  
   
  return [soldSeatSum, totalSoldSeat]  

};




module.exports = {
  getRating,
};
