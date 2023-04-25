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
         WHERE daily_sales_count.musical_id = musicals.id AND musical_date.date >= NOW()) /
         (SELECT SUM(sold_seat)
         FROM daily_sales_count
         JOIN musical_schedules ON musical_schedules.id = daily_sales_count.musical_schedule_id
         JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
         WHERE musical_date.date >= NOW()) * 100, 0),1) as reservationRated,
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
       `,[limit, offset]
    );
    if (!matchingMusicals.length) {
      throw new CustomError('404', 'NOT_FOUND');
    }
    return matchingMusicals;
  } catch (err) {
    throw new CustomError('404', 'NOT_FOUND');
  }
};

module.exports = {
  getAllMusicalList,
  searchMusicalByName,
}
