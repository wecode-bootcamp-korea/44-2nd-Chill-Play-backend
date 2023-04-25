const appDataSource = require('./appDataSource');
const { CustomError } = require('../utils/error');

const musicalList = async (sort, where, limit, offset) => {
  try {
    const sortList = {
      releasedDateASC: 'musicals.released_date ASC',
      releasedDateDESC: 'musicals.released_date DESC',
      endDateASC: 'musicals.end_date ASC',
      endDateDESC: 'musicals.end_date DESC',
      ageRateASC: 'musicals.age_rated_id ASC',
      reservationRate: 'reservationRate DESC',
    };

    const whereList = {
      comingsoon: 'musicals.released_date > DATE_SUB(NOW(), INTERVAL 0 DAY)',
    };

    const sortCondition = sortList[sort] || 'musicals.released_date';
    const whereCondition = whereList[where] || 'musicals.released_date';

    return await appDataSource.query(
      `SELECT
      musicals.id as Id,
      ROUND(COALESCE(
        (SELECT SUM(sold_seat)
         FROM daily_sales_count
         JOIN musical_schedules ON musical_schedules.id = daily_sales_count.musical_schedule_id
         JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
         WHERE daily_sales_count.musical_id = musicals.id AND musical_date.date >= NOW()) /
         (SELECT SUM(sold_seat)
         FROM daily_sales_count
         JOIN musical_schedules ON musical_schedules.id = daily_sales_count.musical_schedule_id
         JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
         WHERE musical_date.date >= NOW()) * 100, 0),1) as reservationRate,
      musicals.name as name,
      musicals.post_image_url as postImageUrl,
      musicals.released_date as releasedDate,
      musicals.end_date as endDate,
      age_rated.rated as rated,
      musical_actors.actors as actors
      FROM musicals
      JOIN age_rated ON musicals.age_rated_id = age_rated.id
      JOIN musical_actors ON musical_actors.musical_id = musicals.id
      WHERE ${whereCondition} and musicals.end_date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
      ORDER BY ${sortCondition}
      LIMIT ? OFFSET ? 
      `,
      [limit, offset]
    );
  } catch {
    throw new CustomError(400, 'DATABASE_ERROR');
  }
};

module.exports = {
  musicalList,
};
