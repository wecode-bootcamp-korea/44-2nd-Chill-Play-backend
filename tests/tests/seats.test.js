const request = require('supertest');
const { truncateTables } = require('../test-client');
const { createApp } = require('../../app');
const appDataSource = require('../../models/appDataSource');
const musicalsFixture = require('../fixtures/musical-fixture');
const orderFixture = require('../fixtures/orders-fixture');
const userFixture = require('../fixtures/users-fixture')

describe('관 예매 페이지', () => {
  let app;

  const userSample1 = {
    id: 1,
    kakao_id: 1,
    account_email: 'testemail1@email.com',
    profile_image: 'imgurl',
    profile_nickname: 'nickname',
    brithday: '0428',
    gender: 'female',
    age_range: '10~19',
  };

  const theaterSample1 = {
    id: 1,
    name: '극장',
    totalSeats: 100,
    cityId: 1,
    thumbnailImageUrl: 'thumbnailImageUrl1',
  };

  const theaterSample2 = {
    id: 2,
    name: '극장2',
    totalSeats: 100,
    cityId: 1,
    thumbnailImageUrl: 'thumbnailImageUrl2',
  };

  const theaterSample3 = {
    id: 3,
    name: '극장3',
    totalSeats: 100,
    cityId: 2,
    thumbnailImageUrl: 'thumbnailImageUrl3',
  };

  const musicalsSample1 = {
    id: 1,
    descriptions: '설명',
    name: '뮤지컬이름',
    postImageUrl: 'postImageUrl',
    releasedDate: '2023-04-28',
    endDate: '2023-05-01',
    runningTime: 180,
    synopsis: '시놉시스',
    ageRatedId: 1,
    boardingStatusId: 1,
    theaterId: 1,
  };

  const musicalsSample2 = {
    id: 2,
    descriptions: '설명2',
    name: '뮤지컬이름2',
    postImageUrl: 'postImageUrl2',
    releasedDate: '2023-04-28',
    endDate: '2023-05-01',
    runningTime: 180,
    synopsis: '시놉시스2',
    ageRatedId: 1,
    boardingStatusId: 1,
    theaterId: 2,
  };

  const musicalsSample3 = {
    id: 3,
    descriptions: '설명3',
    name: '뮤지컬이름3',
    postImageUrl: 'postImageUrl3',
    releasedDate: '2023-04-29',
    endDate: '2023-05-02',
    runningTime: 180,
    synopsis: '시놉시스3',
    ageRatedId: 1,
    boardingStatusId: 1,
    theaterId: 3,
  };

  const musicalDateSample1 = {
    id: 1,
    date: '2023-04-28',
  };

  const musicalDateSample2 = {
    id: 2,
    date: '2023-04-29',
  };

  const musicalDateSample3 = {
    id: 3,
    date: '2023-05-01',
  };

  const musicalTimeSample = {
    id: 1,
    time: '23:30:00',
  };

  const musicalScheduleSample1 = {
    id: 1,
    musicalId: 1,
    theaterId: 1,
    musicalTimeId: 1,
    musicalDateId: 1,
  };

  const musicalScheduleSample2 = {
    id: 2,
    musicalId: 2,
    theaterId: 2,
    musicalTimeId: 1,
    musicalDateId: 2,
  };

  const musicalScheduleSample3 = {
    id: 3,
    musicalId: 3,
    theaterId: 3,
    musicalTimeId: 1,
    musicalDateId: 3,
  };

  const dailySalesCountSample1 = {
    id: 1,
    soldSeat: 10,
    musicalId: 1,
    musicalScheduleId: 1,
  };

  const dailySalesCountSample2 = {
    id: 2,
    soldSeat: 20,
    musicalId: 2,
    musicalScheduleId: 2,
  };

  const dailySalesCountSample3 = {
    id: 3,
    soldSeat: 3,
    musicalId: 3,
    musicalScheduleId: 3,
  };

  const orderSample1 = {
    id: 1,
    personnel: 3,
    total_amount: 40000,
    user_id: 1,
    musical_id: 3,
    musical_schedule_id: 3,
    order_status_id: 2,
  };

  const bookedSeatsSample1 = {
    id: 1,
    seat_row: 'A',
    seat_column: '1',
    musical_id: 3,
    theater_id: 3,
    seat_class_id: 1,
    order_id: 1,
  };

  const bookedSeatsSample2 = {
    id: 2,
    seat_row: 'A',
    seat_column: '2',
    musical_id: 3,
    theater_id: 3,
    seat_class_id: 1,
    order_id: 1,
  };

  const bookedSeatsSample3 = {
    id: 3,
    seat_row: 'A',
    seat_column: '3',
    musical_id: 3,
    theater_id: 3,
    seat_class_id: 1,
    order_id: 1,
  };

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await userFixture.createUsers([userSample1]);
    await musicalsFixture.createTheaters([theaterSample1, theaterSample2, theaterSample3]);
    await musicalsFixture.createMusicals([musicalsSample1, musicalsSample2, musicalsSample3]);
    await musicalsFixture.createMusicalDate([
      musicalDateSample1,
      musicalDateSample2,
      musicalDateSample3,
    ]);
    await musicalsFixture.createMusicalTime([musicalTimeSample]);
    await musicalsFixture.createMusicalSchedules([
      musicalScheduleSample1,
      musicalScheduleSample2,
      musicalScheduleSample3,
    ]);
    await musicalsFixture.createDailySalesCount([
      dailySalesCountSample1,
      dailySalesCountSample2,
      dailySalesCountSample3,
    ]);
    await orderFixture.createOrders([orderSample1]);
    await orderFixture.createBookedSeats([
      bookedSeatsSample1,
      bookedSeatsSample2,
      bookedSeatsSample3,
    ]);
    
  });

  afterAll(async () => {
    await truncateTables([
      'users',
      'theaters',
      'musicals',
      'musical_date',
      'musical_time',
      'musical_schedules',
      'daily_sales_count',
      'booked_seats',
      'orders'
    ]);
    await appDataSource.destroy();
  });

  test('SUCCESS: get all bookedSeats and price per seats', async () => {
    app = createApp();
    const res = await request(app).get('/seat/3');
    const body = [
      
        {
          bookedSeats: ['A1', 'A2', 'A3'],
          vipPrice: '180000.000',
          regPrice: '100000.000',
        },
      
    ];
    expect(res.body).toEqual(body);
  });
});
