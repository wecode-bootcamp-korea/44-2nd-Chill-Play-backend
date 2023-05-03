const appDataSource = require('./appDataSource');
const { CustomError } = require('../utils/error');

const getOrderInfo = async (userId, limit) => {
  try {
    const result = await appDataSource.query(
      `  SELECT DISTINCT
      musicals.id as musicalId,
      personnel,
      order_number as orderNumber,
      total_amount as totalAmount,
      musicals.name as musicalName,
      order_status.status as orderStatus,
      musical_date.date as musicalDate,
      musical_time.time as startTime,
      (musical_time.time + INTERVAL musicals.running_time MINUTE) AS endTime,
      seatInfo.seatInfo as seatInfo,
      theaters.name as theatersName,
      age_rated.rated as ageLimit,
      orders.created_at as orderTime,
      musicals.post_image_url as postImage
    FROM orders
    JOIN musicals ON orders.musical_id = musicals.id
    JOIN order_status ON orders.order_status_id = order_status.id
    JOIN musical_schedules ON orders.musical_schedule_id = musical_schedules.id
    JOIN booked_seats ON orders.id = booked_seats.order_id
    JOIN theaters ON booked_seats.theater_id = theaters.id
    JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
    JOIN musical_time ON musical_time.id = musical_schedules.musical_time_id
    JOIN age_rated ON age_rated.id = musicals.age_rated_id
    	JOIN(
    		SELECT
    			booked_seats.order_id,
    			JSON_ARRAYAGG( CONCAT(seat_row,'',seat_column)) as seatInfo
    		FROM booked_seats
    		GROUP BY booked_seats.order_id
    	)as seatInfo ON seatInfo.order_id = orders.id
   WHERE orders.user_id = ?
   ORDER BY musical_date.date DESC
   limit ?
    `,
      [userId, limit]
    );

    return result;
  } catch (err) {
    console.log(err);
    throw new CustomError(400, 'appDataSource_error');
  }
};

module.exports = {
  getOrderInfo,
};
