const request = require('supertest');
const { createApp } = require('../../app');
const appDataSource = require('../../models/appDataSource');
const musicalsFixture = require('../fixtures/musicals-fixture');
const ordersFixture = require('../fixtures/orders-fixture');
const usersFixture = require('../fixtures/users-fixture');
const reviewFixture = require('../fixtures/review-fixture');
const { truncateTables } = require('../test-client');
const { imageUpload } = require('../../middlewares/imgUpload');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('리뷰테스트!', () => {
  let app;
  const kakaoUser = {
    kakao_id: 1,
    account_email: 'test@email.com',
    profile_image: 'URL',
    profile_nickname: '이름',
    birthday: '0923',
    gender: 'female',
    age_range: '10~19',
  };

  const musicalsSample = {
    id: 1,
    descriptions: '설명',
    name: '뮤지컬이름',
    postImageUrl: 'postImageUrl',
    releasedDate: '2024-04-28',
    endDate: '2024-05-01',
    runningTime: 180,
    synopsis: '시놉시스',
    ageRatedId: 1,
    boardingStatusId: 1,
    theaterId: 1,
  };

  const musicalDetailImageSample = {
    id: 1,
    imageUrl: 'imageUrl',
    musicalId: 1,
  };
  const actorSample = {
    id: 1,
    musicalId: 1,
    actors: '{"actor": ["배우1", "배우2", "배우3"]}',
  };

  const theaterSample = {
    id: 1,
    name: '극장',
    totalSeats: 100,
    cityId: 1,
    thumbnailImageUrl: 'thumbnailImageUrl',
  };

  const musicalDateSample = {
    id: 1,
    date: '2024-04-28',
  };

  const musicalTimeSample = {
    id: 1,
    time: '19:00',
  };

  const musicalScheduleSample = {
    id: 1,
    musicalId: 1,
    theaterId: 1,
    musicalTimeId: 1,
    musicalDateId: 1,
  };

  const dailySalesCountSample = {
    id: 1,
    soldSeat: 1,
    musicalId: 1,
    musicalScheduleId: 1,
  };

  const ordersSample = {
    id: 1,
    personnel: 1,
    total_amount: 100000,
    user_id: 1,
    musical_id: 1,
    musical_schedule_id: 1,
    order_status_id: 2,
  };

  const bookedSeatsSample = {
    id: 1,
    seat_row: 'a',
    seat_column: 1,
    musical_id: 1,
    theater_id: 1,
    seat_class_id: 1,
    order_id: 1,
  };

  const reviewSample = {
    id: 1,
    content: 'content',
    score: 3,
    user_id: 1,
    musical_id: 1,
  };

  const reviewImagesSample = {
    id: 1,
    review_images_url:
      'https://chill-play.s3.ap-northeast-2.amazonaws.com/reviewImage/1682863200591_4d3c750a-7a92-4a3b-8911-1ff8077c5c5a_hi.jpg',

    review_id: 1,
  };

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    jwt.verify.mockImplementation(() => ({ id: 1 }));

    await usersFixture.createUsers([kakaoUser]);
    await musicalsFixture.createTheaters([theaterSample]);
    await musicalsFixture.createMusicals([musicalsSample]);
    await musicalsFixture.createMusicalActor([actorSample]);
    await musicalsFixture.createMusicalDetailImage([musicalDetailImageSample]);
    await musicalsFixture.createMusicalDate([musicalDateSample]);
    await musicalsFixture.createMusicalTime([musicalTimeSample]);
    await musicalsFixture.createMusicalSchedules([musicalScheduleSample]);
    await musicalsFixture.createDailySalesCount([dailySalesCountSample]);
    await ordersFixture.createOrders([ordersSample]);
    await ordersFixture.createBookedSeats([bookedSeatsSample]);
    await reviewFixture.createReview([reviewSample]);
    await reviewFixture.createReviewImage([reviewImagesSample]);
  });

  afterAll(async () => {
    await truncateTables([
      'users',
      'theaters',
      'musicals',
      'musical_actors',
      'musical_detail_images',
      'musical_date',
      'musical_time',
      'musical_schedules',
      'daily_sales_count',
      'orders',
      'booked_seats',
      'reviews',
      'review_images',
    ]);
    await appDataSource.destroy();
  });
  test('🚀 SUCCESS: get reviews', async () => {
    const res = await request(app).get('/reviews/?musicalId=1&limit=4&offset=0');

    await expect(res.status).toEqual(200);
  });

  test('🚀 SUCCESS: create reviews', async () => {
    const res = await request(app)
      .post('/reviews/new')
      .set('authorization', `TOKEN`)
      .set('Content-Type', 'multipart/form-data')
      .attach('image', Buffer.from('testImage.jpg'), 'testImage.jpg')
      .field('content', '9999')
      .field('score', '1')
      .field('musicalId', '1');

    await expect(res.status).toEqual(201);
  });
  test('🚀 SUCCESS: remove reviews', async () => {
    const res = await request(app).delete('/reviews/remove/1').set('authorization', `TOKEN`);

    await expect(res.status).toEqual(200);
  });

  test('🚀 SUCCESS: checkOrder', async () => {
    const res = await request(app).get('/reviews/checkorder/1').set('authorization', `TOKEN`);

    await expect(res.status).toEqual(200);
  });

  test('❌ FAILED: create reviews picture error', async () => {
    const res = await request(app)
      .post('/reviews/new')
      .set('authorization', `TOKEN`)
      .field('content', '9999')
      .field('score', '1')
      .field('musicalId', '1')
      .expect(400)
      .expect({ message: 'INVALID_IMAGE_FORMAT' });
  });

  test('❌ FAILED: KEY ERROR', async () => {
    const res = await request(app)
      .post('/reviews/new')
      .set('authorization', `TOKEN`)
      .set('Content-Type', 'multipart/form-data')
      .attach('image', Buffer.from('testImage.jpg'), 'testImage.jpg')
      .field('contt', '9999')
      .field('score', '1')
      .field('musicalId', '1')
      .expect(400)
      .expect({ message: 'KEY_ERROR' });
  });
});
