const appDataSource = require('./appDataSource');
const { seatStatusEnum, orderStatusEnum } = require('./enum');
const { CustomError } = require('../utils/error');
const createOrder = async (
  totalAmount,
  userId,
  musicalId,
  musicalDateId,
  seatArray,
  musicalScheduleId
) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  const personnel = seatArray.length;
  try {
    await queryRunner.query(
      `INSERT INTO orders(
        personnel,
        total_amount,
        user_id,
        musical_id,
        musical_schedule_id,
        order_status_id
        )
        SELECT ?, ?, ?, musicals.id, musical_schedules.id, ${orderStatusEnum.pending}
        FROM musicals
        JOIN musical_schedules ON musical_schedules.musical_id = musicals.id
        JOIN musical_date ON musical_date.id = musical_schedules.musical_date_id
        WHERE musicals.id = ? AND musical_date.id = ?
      `,
      [personnel, totalAmount, userId, musicalId, musicalDateId]
    );

    const gerOrderId = await queryRunner.query(
      `SELECT
      id
      FROM orders
      WHERE orders.user_id = ? AND orders.status_id = ${orderStatusEnum.pending}
      ORDER BY orders.id DESC
      LIMIT 1
      `,
      [userId]
    );
    const orderId = gerOrderId[0].id;
    const theater = await queryRunner.query(
      `SELECT
      theaters.id
      FROM theaters
      JOIN musicals ON musicals.theater_id = theaters.id
      WHERE musicals.id = ?
      `,
      [musicalId]
    );
    const theaterId = theater[0].id;

    const array = seatArray.map((ppp) => {
      const [row, column] = ppp.split('');
      const seatClass = ['A', 'B', 'C'].includes(row)
        ? orderStatusEnum.VIP
        : orderStatusEnum.REGULAR;
      return { row, column: parseInt(column), seatClass };
    });

    for (const item of array) {
      await queryRunner.query(
        `INSERT INTO booked_seats(
        seat_row,
        seat_column,
        musical_id, 
        theater_id,
        seat_class_id,
        order_id
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
        [item.row, item.column, musicalId, theaterId, item.seatClass, orderId]
      );
    }
    await queryRunner.query(
      `UPDATE daily_sales_count
      SET daily_sales_count.sold_seat = daily_sales_count.sold_seat + ?
      WHERE daily_sales_count.musical_schedule_id = ?
      `,
      [personnel, musicalScheduleId]
    );

    await queryRunner.query(
      `UPDATE
    SET order_status_id = ${orderStatusEnum.complete} 
     FROM orders
     WHERE id =?`,
      [orderId]
    );

    await queryRunner.commitTransaction();
  } catch {
    await queryRunner.rollbackTransaction();
    throw new CustomError(400, 'DATABASE_ERROR');
  } finally {
    queryRunner.release();
  }
};

const getRefundLists = async (userId) => {
  try {
    return await appDataSource.query(`
    SELECT 
    o.order_number AS orderNumber,
    mt.time AS musicalTime,
    md.date AS musicalDate,
    o.total_amount AS totalAmount,
    m.name AS musicalTitle,
    mt.time AS startTime,
    (mt.time + INTERVAL m.running_time MINUTE) AS endTime,
    GROUP_CONCAT(CONCAT(bs.seat_row, bs.seat_column) SEPARATOR ',') AS seats
  FROM
    orders AS o
    JOIN musical_schedules AS ms ON ms.id = o.musical_schedule_id
    JOIN musical_time AS mt ON mt.id = ms.musical_time_id
    JOIN musical_date AS md ON md.id = ms.musical_date_id
    JOIN booked_seats AS bs ON bs.order_id = o.id
    JOIN musicals AS m ON m.id = o.musical_id
  WHERE
    o.user_id = 3 AND o.order_status_id = ${orderStatusEnum.complete}
    AND (
      md.date > CURDATE()
      OR (md.date = CURDATE() AND mt.time >= TIME(DATE_ADD(NOW(), INTERVAL 20 MINUTE)))
    )
  GROUP BY
    o.id
  ORDER BY
    o.id DESC;
`);
  } catch (err) {
    throw new CustomError(400, 'DATABASE_ERROR');
  }
};

const executeRefundOrder = async (orderNumber) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    //orderNumber typeof: String, 환불 처리를 위해서 order_status 테이블에 3, refund도 필요함
    const orderInfo = await queryRunner.query(
      `SELECT
      o.*,
      mt.time AS musical_time,
      md.date AS musical_date
      FROM orders AS o
      JOIN musical_schedules AS ms ON ms.id = o.musical_schedule_id
      JOIN musical_time AS mt ON mt.id = ms.musical_time_id
      JOIN musical_date AS md ON md.id = ms.musical_date_id
      WHERE o.order_number = ?
      ORDER BY o.id DESC
      `,
      [orderNumber]
    );
    const personnel = orderInfo[0].personnel;
    const orderId = orderInfo[0].id;
    const scheduleId = orderInfo[0].musical_schedule_id;

    await queryRunner.query(
      `UPDATE daily_sales_count AS ds
       SET ds.sold_seat = ds.sold_seat - ?
       WHERE ds.musical_schedule_id = ?`,
      [personnel, scheduleId]
    );

    await queryRunner.query(
      `DELETE
       FROM booked_seats
       WHERE order_id =?`,
      [orderId]
    );

    await queryRunner.query(
      `UPDATE orders
       SET order_status_id =${orderStatusEnum.refund}
       WHERE order_id =?`,
      [orderId]
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
