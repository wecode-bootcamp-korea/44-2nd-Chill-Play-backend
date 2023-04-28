const request = require('supertest');

const { createApp } = require('../../app');
const { truncateTables } = require('../test-client');
const dataSource = require('../../models/appDataSource');
const musicalsFixture = require('../fixtures/musicals-fixture')

describe("뮤지컬 디테일 페이지 테스트", () => {
  let app;

  const kakaoUser = {
    kakao_id: 1,
    account_email: "test@email.com",
    profile_image: "URL",
    profile_nickname: "이름",
    birthday: "0923",
    gender: "female",
    age_range: "10~19",
  };

  const musicalsSample = {
    id: 1,
    descriptions: "설명",
    name: "뮤지컬이름",
    postImageUrl: "postImageUrl",
    releasedDate: "2023-04-28",
    endDate: "2023-05-01",
    runningTime: 180,
    synopsis: "시놉시스",
    ageRatedId: 1,
    boardingStatusId: 1,
    theaterId: 1,
  };

  const musicalDetailImageSample = {
    id: 1,
    imageUrl: "imageUrl",
    musicalId: 1,
  };
  const actorSample = {
    id: 1,
    musicalId: 1,
    actors: '{"actor": ["배우1", "배우2", "배우3"]}',
  };

  const theaterSample = {
    id: 1,
    name: "극장",
    totalSeats: 100,
    cityId: 1,
    thumbnailImageUrl: "thumbnailImageUrl",
  };

  const musicalDateSample = {
    id: 1,
    date: "2023-04-28",
  };

  const musicalTimeSample = {
    id: 1,
    time: "19:00",
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
    seat_row: "a",
    seat_column: 1,
    musical_id: 1,
    theater_id: 1,
    seat_class_id: 1,
    order_id: 1,
  };

  beforeAll(async () => {
    app = createApp();
    await dataSource.initialize();

    await musicalsFixture.createTheaters([theaterSample]);
    await musicalsFixture.createMusicals([musicalsSample]);
    await musicalsFixture.createMusicalActor([actorSample]);
    await musicalsFixture.createMusicalDetailImage([musicalDetailImageSample]);
    await musicalsFixture.createMusicalDate([musicalDateSample]);
    await musicalsFixture.createMusicalTime([musicalTimeSample]);
    await musicalsFixture.createMusicalSchedules([musicalScheduleSample]);
    await musicalsFixture.createDailySalesCount([dailySalesCountSample]);
  
  });

  afterAll(async () => {
    await truncateTables([
      "users",
      "theaters",
      "musicals",
      "musical_actors",
      "musical_detail_images",
      "musical_date",
      "musical_time",
      "musical_schedules",
      "daily_sales_count",
      "orders",
      "booked_seats",
    ]);
    await dataSource.destroy();
  }); 



  test("SUCCESS: search musical by musical full name/keyword effecting limit & offset", async () => {
     const response = await request(app).get('/musicals/search').query({keyword:'뮤',limit:'1',offset:'0'});
    
   expect(response.body).toEqual([
      {
          "id": 1,
          "name": "뮤지컬이름",
          "post_image_url": "postImageUrl",
          "released_date": "2023-04-28",
          "age_rated_id": 1
      }
   ]);

    expect(response.statusCode).toEqual(200);
  });



 test("FAILED: can't find musical by inputing musical name/keyword", async () => {
  const response = await request(app).get('/musical/search').query({keyword :'나이키',limit:'4',offset:'0'});

  expect(response.body).toEqual({message : `Can't find /musical/search?keyword=%EB%82%98%EC%9D%B4%ED%82%A4&limit=4&offset=0 on this server!`})
  expect(response.statusCode).toEqual(404);
 });

 test("FAILED: can't found musical by inputing musical name/keyword", async () => {
  const response = await request(app).get('/musical/search').query({keyword :'!@#!',limit:'4',offset:'0'});

  expect(response.body).toEqual({message : `Can't find /musical/search?keyword=%21%40%23%21&limit=4&offset=0 on this server!`})
  expect(response.statusCode).toEqual(404);
 });
 
})
