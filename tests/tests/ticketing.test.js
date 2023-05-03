const request = require('supertest');
const { truncateTables } = require('../test-client');
const { createApp } = require('../../app');
const appDataSource = require('../../models/appDataSource');
const musicalsFixture = require('../fixtures/musicals-fixture');

describe('티켓팅 페이지', () => {
  let app;

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
    soldSeat: 30,
    musicalId: 3,
    musicalScheduleId: 3,
  };

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();

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
  });

  afterAll(async () => {
    await truncateTables([
      'theaters',
      'musicals',
      'musical_date',
      'musical_time',
      'musical_schedules',
      'daily_sales_count',
      'booked_seats',
    ]);
    await appDataSource.destroy();
  });

  test('SUCCESS: get all muscialLists', async () => {
    const res = await request(app).get('/ticketing');
    const body = [
      [
        {
          ageLimit: '1',
          musicalId: 1,
          musicalImage: 'postImageUrl',
          musicalTitle: '뮤지컬이름',
          releasedDate: '2023-04-28',
          reservationRate: '0.0',
        },
        {
          ageLimit: '1',
          musicalId: 2,
          musicalImage: 'postImageUrl2',
          musicalTitle: '뮤지컬이름2',
          releasedDate: '2023-04-28',
          reservationRate: '0.0',
        },
        {
          ageLimit: '1',
          musicalId: 3,
          musicalImage: 'postImageUrl3',
          musicalTitle: '뮤지컬이름3',
          releasedDate: '2023-04-29',
          reservationRate: '0.0',
        },
      ],
    ];
    expect(res.body).toEqual(body);
  });

  test('SUCCESS: get musicalLists and theaterList', async () => {
    const res = await request(app).get('/ticketing?musical=3');
    const body = [
      [
        {
          ageLimit: '1',
          musicalId: 1,
          musicalImage: 'postImageUrl',
          musicalTitle: '뮤지컬이름',
          releasedDate: '2023-04-28',
          reservationRate: '0.0',
        },
        {
          ageLimit: '1',
          musicalId: 2,
          musicalImage: 'postImageUrl2',
          musicalTitle: '뮤지컬이름2',
          releasedDate: '2023-04-28',
          reservationRate: '0.0',
        },
        {
          ageLimit: '1',
          musicalId: 3,
          musicalImage: 'postImageUrl3',
          musicalTitle: '뮤지컬이름3',
          releasedDate: '2023-04-29',
          reservationRate: '0.0',
        },
      ],
      [{ theaterId: 3, theaterImage: 'thumbnailImageUrl3', theaterName: '극장3' }],
    ];
    expect(res.body).toEqual(body);
  });

  test('SUCCESS: get musicalLists and theaterLists and scheduleList', async () => {
    const res = await request(app).get('/ticketing?musical=3&theater=3&date=2023-05-01');
    const body = [
      [
        {
          ageLimit: '1',
          musicalId: 1,
          musicalImage: 'postImageUrl',
          musicalTitle: '뮤지컬이름',
          releasedDate: '2023-04-28',
          reservationRate: '0.0',
        },
        {
          ageLimit: '1',
          musicalId: 2,
          musicalImage: 'postImageUrl2',
          musicalTitle: '뮤지컬이름2',
          releasedDate: '2023-04-28',
          reservationRate: '0.0',
        },
        {
          ageLimit: '1',
          musicalId: 3,
          musicalImage: 'postImageUrl3',
          musicalTitle: '뮤지컬이름3',
          releasedDate: '2023-04-29',
          reservationRate: '0.0',
        },
      ],
      [
        {
          theaterId: 3,
          theaterName: '극장3',
          theaterImage: 'thumbnailImageUrl3',
        },
      ],
      [
        {
          musicalScheduleId: 3,
          totalSeat: 100,
          remainingSeats: '70',
          startTime: '23:30:00',
          endTime: '26:30:00',
          date: '2023-05-01',
          time: '23:30:00',
        },
      ],
    ];
    expect(res.body).toEqual(body);
  });
});
