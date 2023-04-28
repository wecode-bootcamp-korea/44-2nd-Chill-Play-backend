const dataSource = require('../../models/appDataSource');

const createTheaters = (theaterList) => {
  let data = [];

  for (const theater of theaterList) {
    data.push([
      theater.id,
      theater.name,
      theater.totalSeats,
      theater.cityId,
      theater.thumbnailImageUrl,
    ]);
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
    data.push([
      schedule.id,
      schedule.musicalId,
      schedule.theaterId,
      schedule.musicalTimeId,
      schedule.musicalDateId,
    ]);
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
