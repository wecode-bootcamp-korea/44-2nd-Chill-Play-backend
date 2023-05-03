const appDataSource = require('./appDataSource');
const { CustomError } = require('../utils/error');
const ConditionMake = require('./conditionMake');
const CustomConditionMake = require('./customConditionMake');

const getMusicalList = async (musicalId, theaterId, date) => {
  musicalId = Number(musicalId);
  theaterId = Number(theaterId);
  try {
    const musicalLists = await appDataSource.query(
      `SELECT 
        m.id AS musicalId, 
        m.name AS musicalTitle,
        m.post_image_url AS musicalImage,
        m.released_date AS releasedDate,
        a.rated AS ageLimit,
        ROUND(COALESCE(
          (SELECT SUM(sold_seat)
          FROM daily_sales_count
          JOIN musical_schedules ON musical_schedules.id = daily_sales_count.musical_schedule_id
          JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
          WHERE daily_sales_count.musical_id = m.id AND musical_date.date >= DATE(NOW())) /
          (SELECT SUM(sold_seat)
          FROM daily_sales_count
          JOIN musical_schedules ON musical_schedules.id = daily_sales_count.musical_schedule_id
          JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
          WHERE musical_date.date >= DATE(NOW())) * 100, 0), 1) AS reservationRate
      FROM musicals AS m
      JOIN age_rated AS a ON a.id = m.age_rated_id
      ORDER by reservationRate DESC ;
        `
    );

    let theaterLists = [];
    if (musicalId) {
      let condition = new ConditionMake(musicalId, null, null, null, 'where');
      let versity = condition.build();
      theaterLists = await appDataSource.query(
        `SELECT
          t.id  AS theaterId,
          t.name AS theaterName,
          t.thumbnail_image_url AS theaterImage 
        FROM theaters AS t 
        JOIN musicals AS m ON m.theater_id = t.id 
        ${versity}
        `,
        [versity]
      );
    }

    let timeLists = [];
    if (musicalId && theaterId && date) {
      condition = new ConditionMake(musicalId, theaterId, `${date}`, null, 'where');
      versity = condition.build();
      const orderVersity = new CustomConditionMake(['md.date', 'mt.time']).buildOrderBy();

      const today = new Date();
      const targetDate = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      let con = '';

      if (targetDate === date) {
        con = ' AND mt.time >= CURTIME()';
      }

      timeLists = await appDataSource.query(
        `SELECT
          ms.id AS musicalScheduleId, 		
          t.total_seats AS totalSeat, 
          t.total_seats - COALESCE(
            (
              SELECT SUM(dsc.sold_seat) 
              FROM daily_sales_count AS dsc
              JOIN musical_schedules AS ms ON dsc.musical_schedule_id = ms.id
              WHERE ms.musical_id = m.id AND ms.musical_date_id = md.id AND ms.musical_time_id = mt.id
            ),
            0
          ) AS remainingSeats,
          mt.time AS startTime,
          (mt.time + INTERVAL m.running_time MINUTE) AS endTime,
          md.date,
          mt.time
        FROM musicals AS m
        JOIN age_rated AS a ON a.id = m.age_rated_id
        JOIN musical_schedules AS ms ON ms.musical_id = m.id
        JOIN musical_date AS md ON md.id = ms.musical_date_id 
        JOIN musical_time AS mt ON mt.id = ms.musical_time_id
        JOIN theaters AS t ON t.id = ms.theater_id
        ${versity} ${con}
        ${orderVersity}
        `,
        [versity, con, orderVersity]
      );
    }

    const results = [];
    if (musicalLists.length) {
      results.push(musicalLists);
    }
    if (theaterLists.length) {
      results.push(theaterLists);
    }
    if (timeLists.length) {
      results.push(timeLists);
    }

    return results;
  } catch (err) {
    throw new CustomError(400, 'appDataSource_error');
  }
};

module.exports = {
  getMusicalList,
};
