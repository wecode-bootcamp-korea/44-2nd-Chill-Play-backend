const dataSource = require('../../models/appDataSource');

const createTheaters = async (theaterList) => {
  const data = theaterList.map((theater) => [
    theater.id,
    theater.name,
    theater.totalSeats,
    theater.cityId,
    theater.thumbnailImageUrl,
  ]);

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

const createMusicals = async (musicalList) => {
  const data = musicalList.map((musical) => [
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

const createMusicalActor = async (actorList) => {
  const data = actorList.map((actor) => [
    actor.id,
    actor.musicalId,
    JSON.stringify(JSON.parse(actor.actors)),
  ]);

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

const createMusicalDetailImage = async (imageList) => {
  const data = imageList.map((image) => [image.id, image.imageUrl, image.musicalId]);

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

const createMusicalDate = async (dateList) => {
  const data = dateList.map((date) => [date.id, date.date]);

  return dataSource.query(
    `INSERT INTO musical_date (
      id,
      date
    ) VALUES ?
    `,
    [data]
  );
};

const createMusicalTime = async (timeList) => {
  const data = timeList.map((time) => [time.id, time.time]);

  return dataSource.query(
    `INSERT INTO musical_time (
              id,
              time
            ) VALUES ?
          `,
    [data]
  );
};

const createMusicalSchedules = async (scheduleList) => {
  const data = scheduleList.map((schedule) => [
    schedule.id,
    schedule.musicalId,
    schedule.theaterId,
    schedule.musicalTimeId,
    schedule.musicalDateId,
  ]);

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

const createDailySalesCount = async (dailySalesCountList) => {
  const data = dailySalesCountList.map((dailySalesCount)=>[
    dailySalesCount.id,
    dailySalesCount.soldSeat,
    dailySalesCount.musicalId,
    dailySalesCount.musicalScheduleId,
  ])

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

