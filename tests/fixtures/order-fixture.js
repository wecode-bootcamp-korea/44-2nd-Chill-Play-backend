const dataSource = require("../../models/appDataSource");

const createOrders = (orderList) => {
  let data = [];

  for (const order of orderList) {
    data.push([
      order.id,
      order.personnel,
      order.total_amount,
      order.user_id,
      order.musical_id,
      order.musical_schedule_id,
      order.order_status_id,
    ]);
  }

  return dataSource.query(
    `
    INSERT INTO orders (
        id,
        personnel,
        total_amount,
        user_id,
        musical_id,
        musical_schedule_id,
        order_status_id
    ) VALUES ?
  `,
    [data]
  );
};

const createBookedSeats = (bookedSeatList) => {
  let data = [];

  for (const bookedSeat of bookedSeatList) {
    data.push([
      bookedSeat.id,
      bookedSeat.seat_row,
      bookedSeat.seat_column,
      bookedSeat.musical_id,
      bookedSeat.theater_id,
      bookedSeat.seat_class_id,
      bookedSeat.order_id,
    ]);
  }

  return dataSource.query(
    `
      INSERT INTO booked_seats (
        id,
        seat_row,
        seat_column,
        musical_id,
        theater_id,
        seat_class_id,
        order_id
      ) VALUES ?
    `,
    [data]
  );
};

const ordersSample = {
  id: 1,
  personnel: 1,
  total_amount: 100000,
  user_id: 1,
  musical_id: 1,
  musical_schedule_id: 1,
  order_status_id: 1,
};

const bookedSeats = {
  id: 1,
  seat_row: "a",
  seat_column: 1,
  musical_id: 1,
  theater_id: 1,
  seat_class_id: 1,
  order_id: 1,
};

module.exports = {
  createOrders,
  createBookedSeats,
}; 