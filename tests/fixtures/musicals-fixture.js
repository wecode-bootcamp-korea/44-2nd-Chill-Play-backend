const dataSource = require("../../models/appDataSource");

const createTheaters = (theaterList) => {
  let data = [];

  for (const theater of theaterList) {
    data.push([theater.id, theater.name, theater.totalSeats, theater.cityId, theater.thumbnailImageUrl]);
  }

  return dataSource.query(
    `
    INSERT INTO theaters (                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
      id,
      name,
      total_seats,
      city_id,
      thumbnail_image_url
    ) VALUES ?
  `,
    [data]
  );
};

const createMusicals = (musicalList) => {
  let data = [];

  for (const musical of musicalList) {
    data.push([
      musical.id,
      musical.descriptions,
      musical.name,
      musical.postImageUrl,
      musical.releasedDate,
      musical.endDate,
      musical.runningTime,
      musical.synopsis,
      musical.ageRatedId,
      musical.boardingStatusId,
      musical.theaterId,
    ]);
  }

  return dataSource.query(
    `
      INSERT INTO musicals (
        id,
        descriptions,
        name,
        post_image_url,
        released_date,
        end_date,
        running_time,
        synopsis,
        age_rated_id,
        boarding_status_id,
        theater_id
      ) VALUES ?
    `,
    [data]
  );
};

const createMusicalActor = (actorList) => {
  let data = [];

  for (const actor of actorList) {
    const actors = JSON.parse(actor.actors);

    const actorsJsonString = JSON.stringify(actors);

    data.push([actor.id, actor.musicalId, actorsJsonString]);
  }

  return dataSource.query(
    `
        INSERT INTO musical_actors (
            id,
            musical_id,
            actors
        ) VALUES ?
      `,
    [data]
  );
};

const createMusicalDetailImage = (imageList) => {
  let data = [];

  for (const image of imageList) {
    data.push([image.id, image.imageUrl, image.musicalId]);
  }

  return dataSource.query(
    `
          INSERT INTO musical_detail_images (
            id,
            image_url,
            musical_id
          ) VALUES ?
        `,
    [data]
  );
};

const createMusicalDate = (dateList) => {
  let data = [];

  for (const date of dateList) {
    data.push([date.id, date.date]);
  }

  return dataSource.query(
    `INSERT INTO musical_date (
              id,
              date
            ) VALUES ?
          `,
    [data]
  );
};

const createMusicalTime = (timeList) => {
  let data = [];

  for (const time of timeList) {
    data.push([time.id, time.time]);
  }

  return dataSource.query(
    `INSERT INTO musical_time (
              id,
              time
            ) VALUES ?
          `,
    [data]
  );
};

const createMusicalSchedules = (scheduleList) => {
  let data = [];

  for (const schedule of scheduleList) {
    data.push([schedule.id, schedule.musicalId, schedule.theaterId, schedule.musicalTimeId, schedule.musicalDateId]);
  }

  return dataSource.query(
    `INSERT INTO musical_schedules (
        id,
        musical_id,
        theater_id,
        musical_time_id,
        musical_date_id
              ) VALUES ?
            `,
    [data]
  );
};

const createDailySalesCount = (dailySalesCountList) => {
  let data = [];

  for (const dailySalesCount of dailySalesCountList) {
    data.push([
      dailySalesCount.id,
      dailySalesCount.soldSeat,
      dailySalesCount.musicalId,
      dailySalesCount.musicalScheduleId,
    ]);
  }

  return dataSource.query(
    `INSERT INTO daily_sales_count (
        id,
        sold_seat,
        musical_id,
        musical_schedule_id
                ) VALUES ?
              `,
    [data]
  );
};
const theaterSample = {
  id: 1,
  name: "극장",
  cityId: 1,
  thumbnailImageUrl: "thumbnailImageUrl",
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

const actorList = {
  id: 1,
  musicalId: 1,
  actors: "배우1,배우2,배우3",
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
  soldSeat: 4,
  musicalId: 1,
  musicalScheduleId: 1,
};

module.exports = {
  createTheaters,
  createMusicals,
  createMusicalActor,
  createMusicalDetailImage,
  createMusicalDate,
  createMusicalTime,
  createMusicalSchedules,
  createDailySalesCount,
};