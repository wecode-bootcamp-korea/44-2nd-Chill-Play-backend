const dataSource = require('../../models/appDataSource');

const createOrders = async (orderList) => {
  const data = orderList.map((order)=> [
    order.id,
    order.personnel,
    order.total_amount,
    order.user_id,
    order.musical_id,
    order.musical_schedule_id,
    order.order_status_id,
  ]) 
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

const createBookedSeats = async (bookedSeatList) => {
  const data = bookedSeatList.map((bookedSeat)=> [
    bookedSeat.id,
    bookedSeat.seat_row,
    bookedSeat.seat_column,
    bookedSeat.musical_id,
    bookedSeat.theater_id,
    bookedSeat.seat_class_id,
    bookedSeat.order_id,
  ])

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

module.exports = {
  createOrders,
  createBookedSeats,
};
