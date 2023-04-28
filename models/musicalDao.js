const appDataSource = require('./appDataSource');
const { CustomError } = require('../utils/error');
const ConditionMake = require('./conditionMake');

const getAllMusicalList = async (sort, where) => {
  try {
    let bc = sort.split('-');
    let result = bc[0] + ' ' + bc[1];
    let condition = new ConditionMake(null, null, null, result, 'order');
    let versity = condition.build();

    const whereList = {
      comingsoon: 'musicals.released_date > DATE_SUB(NOW(), INTERVAL 0 DAY)',
    };

    const whereCondition = whereList[where] || 'musicals.released_date';

    return await appDataSource.query(
      `SELECT
      musicals.id as musicalId,
      ROUND(COALESCE(
        (SELECT SUM(sold_seat)
         FROM daily_sales_count
         JOIN musical_schedules ON musical_schedules.id = daily_sales_count.musical_schedule_id
         JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
         WHERE daily_sales_count.musical_id = musicals.id AND musical_date.date >= DATE(NOW())) /
         (SELECT SUM(sold_seat)
         FROM daily_sales_count
         JOIN musical_schedules ON musical_schedules.id = daily_sales_count.musical_schedule_id
         JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
         WHERE musical_date.date >= DATE(NOW())) * 100, 0),1) as reservationRated,
      musicals.name as musicalName,
      musicals.post_image_url as postImageUrl,
      musicals.released_date as releasedDate,
      musicals.end_date as endDate,
      age_rated.rated as ageRated,
      musical_actors.actors as actors
      FROM musicals
      JOIN age_rated ON musicals.age_rated_id = age_rated.id
      JOIN musical_actors ON musical_actors.musical_id = musicals.id
      WHERE ${whereCondition} and musicals.end_date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
      ${versity}
      `
    );
  } catch {
    throw new CustomError(400, 'DATABASE_ERROR');
  }
};

const searchMusicalByName = async (keyword, limit, offset) => {
  try {
    const matchingMusicals = await appDataSource.query(
      `SELECT
        musicals.id,
        musicals.name,
        musicals.post_image_url,
        musicals.released_date,
        musicals.age_rated_id
       FROM musicals
       JOIN age_rated ON musicals.age_rated_id = age_rated.id
       WHERE musicals.name LIKE '%${keyword}%'
       LIMIT ? OFFSET ?
       `,
      [limit, offset]
    );
    if (!matchingMusicals.length) {
      console.log(err);
      throw new CustomError('404', 'NOT_FOUND');
    }
    return matchingMusicals;
  } catch (err) {
    console.log(err);
    throw new CustomError(400, 'dataSource_Error');
  }
};

const checkMusicalId = async (musicalId) => {
  try {
    const [result] = await appDataSource.query(
      `SELECT
          musicals.id
          FROM musicals
          WHERE musicals.id = ${musicalId}
          `
    );
    return result;
  } catch (err) {
    console.log(err);
    throw new CustomError(400, 'dataSource_Error');
  }
};

const getMusicalDetail = async (musicalId) => {
  try {
    const [getMusicalDetailById] = await appDataSource.query(
      `SELECT 
      musicals.id as musicalId,
      musicals.name as musicalName,
      musicals.descriptions,
      musicals.post_image_url as postImageUrl,
      musicals.released_date as releasedDate,
      musicals.end_date as endDate,
      musicals.running_time as runningTime,
      musicals.synopsis,
      musical_actors.actors  as musicalActors,
      age_rated.rated  as ageRated,
      boarding_status.status as boardingStatus,
      theaters.name  as theaterName,
      ROUND(COALESCE(
              (SELECT SUM(sold_seat)
               FROM daily_sales_count
               JOIN musical_schedules ON musical_schedules.id = daily_sales_count.musical_schedule_id
               JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
               WHERE daily_sales_count.musical_id = ? AND musical_date.date >= DATE(NOW())) /
               (SELECT SUM(sold_seat)
               FROM daily_sales_count
               JOIN musical_schedules ON musical_schedules.id = daily_sales_count.musical_schedule_id
               JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
               WHERE musical_date.date >= DATE(NOW())) * 100, 0),1) as reservationRate,
      images.musicalImages as musicalImages
      FROM musicals 
      JOIN age_rated  ON age_rated.id  = musicals.age_rated_id 
      JOIN boarding_status ON boarding_status.id = musicals.boarding_status_id
      JOIN theaters ON theaters.id  = musicals.theater_id 
      JOIN musical_actors  ON musical_actors.musical_id  = musicals.id
         JOIN (
            SELECT 
                 musical_detail_images.musical_id,
                JSON_ARRAYAGG(  musical_detail_images.image_url) as musicalImages
            FROM musical_detail_images
            GROUP BY musical_detail_images.musical_id
        ) as images ON images.musical_id  = musicals.id 
      WHERE musicals.id = ?`,
      [musicalId, musicalId]
    );
    return getMusicalDetailById;
  } catch (err) {
    throw new CustomError(400, 'dataSource_Error');
  }
};

const getGenderBookingRate = async (musicalId) => {
  try {
    const getGenderBookingRate = await appDataSource.query(
      `SELECT 
      COALESCE( male_booking_rate,0)as maleBookingRate,
      COALESCE( 100 - male_booking_rate,0) AS femaleBookingRate
     FROM (
       SELECT 
         ROUND( 
           (SELECT 
           SUM(personnel)
           FROM orders
           JOIN users ON orders.user_id = users.id
           JOIN musicals ON musicals.id = orders.musical_id 
           JOIN musical_schedules ON musical_schedules.id = orders.musical_schedule_id
           JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
           WHERE musicals.id = ? AND musical_date.date >= DATE(NOW()) AND users.gender  = "male"
           GROUP BY users.gender) /
           (SELECT 
           SUM(personnel)
           FROM orders
           JOIN users ON orders.user_id = users.id
           JOIN musicals ON musicals.id = orders.musical_id 
           JOIN musical_schedules ON musical_schedules.id = orders.musical_schedule_id
           JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
           WHERE musicals.id = ? AND musical_date.date >= DATE(NOW())) * 100,1) AS male_booking_rate
     ) AS booking_rates`,
      [musicalId, musicalId]
    );
    return getGenderBookingRate;
  } catch (err) {
    throw new CustomError(400, 'dataSource_Error');
  }
};

const getAgeBookingRate = async (musicalId) => {
  try {
    const getAgeBookingRate = await appDataSource.query(
      `SELECT
      age_ranges.age_range as ageRange,
      ROUND(COALESCE((age_range_booking / total_booking) * 100, 0),1) AS ageRangeBookingRate
    FROM (
      SELECT '10~19' AS age_range
      UNION ALL
      SELECT '20~29' AS age_range
      UNION ALL
      SELECT '30~39' AS age_range
      UNION ALL
      SELECT '40~49' AS age_range
    ) AS age_ranges
    LEFT JOIN (
      SELECT
        users.age_range,
        SUM(personnel) AS age_range_booking
      FROM orders
      JOIN users ON orders.user_id = users.id
      JOIN musicals ON musicals.id = orders.musical_id
      JOIN musical_schedules ON musical_schedules.id = orders.musical_schedule_id
      JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
      WHERE musicals.id = ? AND musical_date.date >= DATE(NOW())
      GROUP BY users.age_range
    ) AS age_range_data ON age_ranges.age_range = age_range_data.age_range,
    (
      SELECT
        SUM(personnel) AS total_booking
      FROM orders
      JOIN users ON orders.user_id = users.id
      JOIN musicals ON musicals.id = orders.musical_id
      JOIN musical_schedules ON musical_schedules.id = orders.musical_schedule_id
      JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
      WHERE musicals.id = ? AND musical_date.date >= DATE(NOW())
    ) AS total_booking_data
    ORDER BY age_ranges.age_range ASC`,
      [musicalId, musicalId]
    );
    return getAgeBookingRate;
  } catch (err) {
    throw new CustomError(400, 'dataSource_Error');
  }
};

module.exports = {
  getAllMusicalList,
  searchMusicalByName,
  getMusicalDetail,
  checkMusicalId,
  getGenderBookingRate,
  getAgeBookingRate,
};
