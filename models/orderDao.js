const appDataSource = require('./appDataSource');
const { OrderStatusEnum, SeatClass } = require('./enum');
const { CustomError } = require('../utils/error');

const createOrder = async (totalAmount, userId, musicalId, seatArray, musicalScheduleId) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  const personnel = seatArray.length;
  try {
    const [{ id: musicalDateId }] = await queryRunner.query(
      `SELECT musical_date.id
      FROM musical_date
      JOIN musical_schedules ON musical_date.id = musical_schedules.musical_date_id
      JOIN theaters ON musical_schedules.theater_id = theaters.id
      JOIN musicals ON musical_schedules.musical_id = musicals.id
      WHERE musicals.id = ? AND musical_schedules.id = ?
      `,
      [musicalId, musicalScheduleId]
    );

    await queryRunner.query(
      `INSERT INTO orders(
        personnel,
        total_amount,
        user_id,
        musical_id,
        musical_schedule_id,
        order_status_id
        )
        SELECT ?, ?, ?, musicals.id, musical_schedules.id, ${OrderStatusEnum.결제완료}
        FROM musicals
        JOIN musical_schedules ON musical_schedules.musical_id = musicals.id
        JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
        WHERE musicals.id = ? AND musical_date.id = ?
      `,
      [personnel, totalAmount, userId, musicalId, musicalDateId]
    );

    const [{ id: orderId }] = await queryRunner.query(
      `SELECT
      id
      FROM orders
      WHERE orders.user_id = ?
      ORDER BY orders.id DESC
      LIMIT 1
      `,
      [userId]
    );

    const [{ id: theaterId }] = await queryRunner.query(
      `SELECT
      theaters.id
      FROM theaters
      JOIN musicals ON musicals.theater_id = theaters.id
      WHERE musicals.id = ?
      `,
      [musicalId]
    );

    const array = seatArray.map((seatNumber) => {
      const [row, column] = seatNumber.split('');
      const seatClass = ['A', 'B', 'C'].includes(row) ? SeatClass.VIP : SeatClass.REGULAR;
      return [row, parseInt(column), musicalId, theaterId, seatClass, orderId];
    });

    await queryRunner.query(
      `INSERT INTO booked_seats(
        seat_row,
        seat_column,
        musical_id,
        theater_id,
        seat_class_id,
        order_id
      )
      VALUES ?
      `,
      [array]
    );

    await queryRunner.query(
      `UPDATE daily_sales_count
      SET daily_sales_count.sold_seat = daily_sales_count.sold_seat + ?
      WHERE daily_sales_count.musical_schedule_id = ?
      `,
      [personnel, musicalScheduleId]
    );
    await queryRunner.commitTransaction();
  } catch {
    await queryRunner.rollbackTransaction();
    throw new CustomError(400, 'DATABASE_ERROR');
  } finally {
    queryRunner.release();
  }
};

module.exports = {
  createOrder,
};
