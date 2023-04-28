const request = require('supertest');
const { createApp } = require('../../app');
const appDataSource = require('../../models/appDataSource');
const musicalsFixture = require('../fixtures/musicals-fixture');
const ordersFixture = require('../fixtures/orders-fixture');
const usersFixture = require('../fixtures/users-fixture');
const { truncateTables } = require('../test-client');

describe('뮤지컬 리스트 테스트', () => {
  let app;

  const userSample1 = {
    kakao_id: 1,
    account_email: 'testemail1@email.com',
    profile_image: 'imgurl',
    profile_nickname: 'nickname',
    brithday: '0428',
    gender: 'female',
    age_range: '10~19',
  };

  const userSample2 = {
    kakao_id: 2,
    account_email: 'testemail1@email.com',
    profile_image: 'imgurl',
    profile_nickname: 'nickname',
    brithday: '0429',
    gender: 'female',
    age_range: '10~19',
  };

  const musicalsSample1 = {
    id: 1,
    descriptions: '설명',
    name: '뮤지컬이름1',
    postImageUrl: 'postImageUrl',
    releasedDate: '2023-04-28',
    endDate: '2023-05-03',
    runningTime: 180,
    synopsis: '시놉시스',
    ageRatedId: 1,
    boardingStatusId: 1,
    theaterId: 1,
  };

  const musicalsSample2 = {
    id: 2,
    descriptions: '설명',
    name: '뮤지컬이름2',
    postImageUrl: 'postImageUrl',
    releasedDate: '2023-05-01',
    endDate: '2023-05-02',
    runningTime: 180,
    synopsis: '시놉시스',
    ageRatedId: 1,
    boardingStatusId: 1,
    theaterId: 1,
  };

  const musicalDetailImageSample1 = {
    id: 1,
    imageUrl: 'imageUrl',
    musicalId: 1,
  };

  const musicalDetailImageSample2 = {
    id: 2,
    imageUrl: 'imageUrl',
    musicalId: 2,
  };

  const actorSample1 = {
    id: 1,
    musicalId: 1,
    actors: '{"actor": ["배우1", "배우2", "배우3"]}',
  };

  const actorSample2 = {
    id: 2,
    musicalId: 2,
    actors: '{"actor": ["배우4", "배우5", "배우6"]}',
  };

  const theaterSample1 = {
    id: 1,
    name: '극장1',
    totalSeats: 100,
    cityId: 1,
    thumbnailImageUrl: 'thumbnailImageUrl',
  };

  const theaterSample2 = {
    id: 2,
    name: '극장2',
    totalSeats: 100,
    cityId: 2,
    thumbnailImageUrl: 'thumbnailImageUrl',
  };

  const musicalDateSample1 = {
    id: 1,
    date: '2023-04-28',
  };

  const musicalDateSample2 = {
    id: 2,
    date: '2023-05-01',
  };

  const musicalTimeSample1 = {
    id: 1,
    time: '19:00',
  };

  const musicalTimeSample2 = {
    id: 2,
    time: '20:00',
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

  const dailySalesCountSample1 = {
    id: 1,
    soldSeat: 1,
    musicalId: 1,
    musicalScheduleId: 1,
  };

  const dailySalesCountSample2 = {
    id: 2,
    soldSeat: 1,
    musicalId: 2,
    musicalScheduleId: 2,
  };

  const ordersSample1 = {
    id: 1,
    personnel: 1,
    total_amount: 100000,
    user_id: 1,
    musical_id: 1,
    musical_schedule_id: 1,
    order_status_id: 1,
  };

  const ordersSample2 = {
    id: 2,
    personnel: 1,
    total_amount: 100000,
    user_id: 2,
    musical_id: 2,
    musical_schedule_id: 2,
    order_status_id: 1,
  };

  const bookedSeatsSample1 = {
    id: 1,
    seat_row: 'a',
    seat_column: 1,
    musical_id: 1,
    theater_id: 1,
    seat_class_id: 1,
    order_id: 1,
  };

  const bookedSeatsSample2 = {
    id: 2,
    seat_row: 'a',
    seat_column: 1,
    musical_id: 2,
    theater_id: 2,
    seat_class_id: 1,
    order_id: 2,
  };

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();

    await usersFixture.createUsers([userSample1, userSample2]);
    await musicalsFixture.createTheaters([theaterSample1, theaterSample2]);
    await musicalsFixture.createMusicals([musicalsSample1, musicalsSample2]);
    await musicalsFixture.createMusicalActor([actorSample1, actorSample2]);
    await musicalsFixture.createMusicalDetailImage([
      musicalDetailImageSample1,
      musicalDetailImageSample2,
    ]);
    await musicalsFixture.createMusicalDate([musicalDateSample1, musicalDateSample2]);
    await musicalsFixture.createMusicalTime([musicalTimeSample1, musicalTimeSample2]);
    await musicalsFixture.createMusicalSchedules([musicalScheduleSample1, musicalScheduleSample2]);
    await musicalsFixture.createDailySalesCount([dailySalesCountSample1, dailySalesCountSample2]);
    await ordersFixture.createOrders([ordersSample1, ordersSample2]);
    await ordersFixture.createBookedSeats([bookedSeatsSample1, bookedSeatsSample2]);
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
    ]);
    await appDataSource.destroy();
  });

  test('🍾SUCCESS: List Filter by reservation', async () => {
    const res = await request(app).get('/musicals?sort=reservationRated-DESC');
    const body = {
      musicalId: 1,
      reservationRated: '50.0',
      musicalName: '뮤지컬이름1',
      postImageUrl: 'postImageUrl',
      releasedDate: '2023-04-28',
      endDate: '2023-05-03',
      ageRated: '1',
      actors: '{"actor": ["배우1", "배우2", "배우3"]}',
    };
    expect(res.body[0]).toEqual(body);
    expect(res.statusCode).toEqual(200);
  });

  test('🍾SUCCESS: List Filter by ageRated', async () => {
    const res = await request(app).get('/musicals?sort=ageRated-ASC');
    const body = {
      musicalId: 1,
      reservationRated: '50.0',
      musicalName: '뮤지컬이름1',
      postImageUrl: 'postImageUrl',
      releasedDate: '2023-04-28',
      endDate: '2023-05-03',
      ageRated: '1',
      actors: '{"actor": ["배우1", "배우2", "배우3"]}',
    };
    expect(res.body[0]).toEqual(body);
    expect(res.statusCode).toEqual(200);
  });

  test('🍾SUCCESS: List Filter by releasedDate', async () => {
    const res = await request(app).get('/musicals?sort=releasedDate-ASC');
    const body = {
      musicalId: 1,
      reservationRated: '50.0',
      musicalName: '뮤지컬이름1',
      postImageUrl: 'postImageUrl',
      releasedDate: '2023-04-28',
      endDate: '2023-05-03',
      ageRated: '1',
      actors: '{"actor": ["배우1", "배우2", "배우3"]}',
    };
    expect(res.body[0]).toEqual(body);
    expect(res.statusCode).toEqual(200);
  });

  test('🍾SUCCESS: List Filter by releasedDate', async () => {
    const res = await request(app).get('/musicals?sort=releasedDate-DESC');
    const body = {
      musicalId: 1,
      reservationRated: '50.0',
      musicalName: '뮤지컬이름1',
      postImageUrl: 'postImageUrl',
      releasedDate: '2023-04-28',
      endDate: '2023-05-03',
      ageRated: '1',
      actors: '{"actor": ["배우1", "배우2", "배우3"]}',
    };
    expect(res.body[1]).toEqual(body);
    expect(res.statusCode).toEqual(200);
  });

  test('🍾SUCCESS: List Filter by endDate', async () => {
    const res = await request(app).get('/musicals?sort=endDate-ASC');
    const body = {
      musicalId: 1,
      reservationRated: '50.0',
      musicalName: '뮤지컬이름1',
      postImageUrl: 'postImageUrl',
      releasedDate: '2023-04-28',
      endDate: '2023-05-03',
      ageRated: '1',
      actors: '{"actor": ["배우1", "배우2", "배우3"]}',
    };

    expect(res.body[1]).toEqual(body);
    expect(res.statusCode).toEqual(200);
  });

  test('🍾SUCCESS: List Filter by endDate', async () => {
    const res = await request(app).get('/musicals?sort=endDate-DESC');
    const body = {
      musicalId: 1,
      reservationRated: '50.0',
      musicalName: '뮤지컬이름1',
      postImageUrl: 'postImageUrl',
      releasedDate: '2023-04-28',
      endDate: '2023-05-03',
      ageRated: '1',
      actors: '{"actor": ["배우1", "배우2", "배우3"]}',
    };

    expect(res.body[0]).toEqual(body);
    expect(res.statusCode).toEqual(200);
  });

  test('🍾SUCCESS: List Filter by reservation&comingsoon', async () => {
    const res = await request(app).get('/musicals?sort=ageRated-ASC&where=comingsoon');
    const body = [
      {
        musicalId: 2,
        reservationRated: '50.0',
        musicalName: '뮤지컬이름2',
        postImageUrl: 'postImageUrl',
        releasedDate: '2023-05-01',
        endDate: '2023-05-02',
        ageRated: '1',
        actors: '{"actor": ["배우4", "배우5", "배우6"]}',
      },
    ];

    expect(res.body).toEqual(body);
    expect(res.statusCode).toEqual(200);
  });
});

describe('뮤지컬 디테일 페이지 테스트', () => {
  let app;

  const kakaoUser = {
    id: 1,
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
    releasedDate: '2023-04-28',
    endDate: '2023-05-01',
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
    date: '2023-04-28',
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
    order_status_id: 1,
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

  beforeAll(async () => {
    app = createApp();
    await dataSource.initialize();

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
    ]);
    await dataSource.destroy();
  });

  test('🚀 SUCCESS: musical detail page! ', async () => {
    const successRes = {
      musicalId: 1,
      musicalName: '뮤지컬이름',
      descriptions: '설명',
      postImageUrl: 'postImageUrl',
      releasedDate: '2023-04-28',
      endDate: '2023-05-01',
      runningTime: 180,
      synopsis: '시놉시스',
      musicalActors: { actor: ['배우1', '배우2', '배우3'] },
      ageRated: '1',
      boardingStatus: '상영 예정',
      theaterName: '극장',
      reservationRate: '100.0',
      musicalImages: ['imageUrl'],
      genderBookingRate: ['0.0', '0.0'],
      ageBookingRate: ['100.0', '0.0', '0.0', '0.0'],
    };
    const res = await request(app).get('/musicals/detail/1');
    await expect(res.body).toStrictEqual(successRes);
    console.log(res);
  });

  test('❌ FAILED:  musicalId is not value', async () => {
    const res = await request(app)
      .get('/musicals/detail/10')
      .expect(404)
      .expect({ message: 'MUSICAL_NOT_VALUE' });
  });
});

describe('검색기능 테스트', () => {
  let app;

  const theater = {
    id: 1,
    name: '세종문화회관',
    totalSeats: 100,
    cityId: 1,
    thumbnailImageUrl: 'sejong_thumbnailImage',
  };
  const musicals = {
    id: 1,
    descriptions: '뮤지컬 테스트 내용',
    name: '뮤지컬 테스트 이름',
    postImageUrl: 'testImage1',
    releasedDate: '2023-04-28',
    endDate: '2023-05-01',
    runningTime: 180,
    synopsis: '테스트-시놉시스: 짧은글',
    ageRatedId: 1,
    boardingStatusId: 1,
    theaterId: 1,
  };

  beforeAll(async () => {
    app = createApp();
    await dataSource.initialize();
    await musicalsFixture.createTheaters([theater]);
    await musicalsFixture.createMusicals([musicals]);
  });

  afterAll(async () => {
    await truncateTables(['theaters', 'musicals']);
    await dataSource.destroy();
  });

  test('SUCCESS: search musical by musical part name/keyword effecting limit & offset', async () => {
    const response = await request(app)
      .get('/musicals/search')
      .query({ keyword: '뮤', limit: '4', offset: '0' });
    expect(response.body).toEqual([
      {
        id: 1,
        name: '뮤지컬 테스트 이름',
        post_image_url: 'testImage1',
        released_date: '2023-04-28',
        age_rated_id: 1,
      },
    ]);
    expect(response.statusCode).toEqual(200);
  });

  test("FAILED: can't find musical by inputing musical name/keyword", async () => {
    const response = await request(app)
      .get('/musical/search')
      .query({ keyword: '나이키', limit: '4', offset: '0' });
    expect(response.body).toEqual({});
    expect(response.statusCode).toEqual(404);
  });

  test("FAILED: can't found musical by inputing musical name/keyword", async () => {
    const response = await request(app)
      .get('/musical/search')
      .query({ keyword: '!@#!', limit: '4', offset: '0' });
    expect(response.body).toEqual({});
    expect(response.statusCode).toEqual(404);
  });
});
