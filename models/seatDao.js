const appDataSource = require('./appDataSource');
const { CustomError } = require('../utils/error');
const { SeatClass } = require('./enum');

const getSeats = async (musicalScheduleId) => {
  try {
    const seats = await appDataSource.query(
      `SELECT
           booked_seats.seat_row AS seatRow,
           booked_seats.seat_column AS seatColumn
         FROM
           orders
           INNER JOIN booked_seats ON orders.id = booked_seats.order_id
         WHERE
           orders.musical_schedule_id = ?
        `,
      [musicalScheduleId]
    );
    const totalSeat = Array.isArray(seats) ? seats : [seats];

    let soldSeats = [];

    if (totalSeat.length > 0) {
      soldSeats = totalSeat.map((seat) => seat.seatRow + seat.seatColumn);
    }

    const vip = SeatClass.VIP;
    let vipPrice = (
      await appDataSource.query(
        `SELECT
         price
         FROM seat_class
         WHERE id = ?`,
        [vip]
      )
    )[0].price;

    const regular = SeatClass.REGULAR;

    let regularPrice = (
      await appDataSource.query(
        `SELECT
         price
         FROM seat_class
         WHERE id = ?`,
        [regular]
      )
    )[0].price;

    vipPrice = parseFloat(vipPrice);
    regularPrice = parseFloat(regularPrice);

    return [{ bookedSeats: soldSeats, vipPrice: vipPrice, regPrice: regularPrice }];
  } catch (err) {
    console.log(err);
    throw new CustomError(500, 'FILTER_ERROR');
  }
};

module.exports = {
  getSeats,
};
