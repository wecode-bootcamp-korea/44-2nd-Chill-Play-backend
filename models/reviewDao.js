const appDataSource = require('./appDataSource');
const { CustomError } = require('../utils/error');

const getReviewsByMusicalId = async (musicalId, limit, offset) => {
  try {
    return await appDataSource.query(
      `SELECT 
  reviews.id reviewId,
  users.profile_nickname as profileNickname,
  reviews.content,
  reviews.score,
  images.reviewImages as reviewImages,
  reviews.created_at as createTime
  FROM reviews
  LEFT JOIN users ON reviews.user_id  = users.id 
  LEFT JOIN (
  SELECT 
  review_images.review_id,
  JSON_ARRAYAGG( review_images.review_images_url) as reviewImages
  FROM review_images 
  GROUP BY review_images.review_id 
  ) as images ON images.review_id = reviews.id 
  WHERE reviews.musical_id  = ?
  ORDER BY reviews.created_at  DESC
  LIMIT ? OFFSET ?`,
      [musicalId, limit, offset]
    );
  } catch (err) {
    throw new CustomError(400, 'dataSource_Error');
  }
};

const getAverageReviewScore = async (musicalId) => {
  try {
    const [result] = await appDataSource.query(
      `	SELECT
      reviews.musical_id as musicalId,
      ROUND(COALESCE(AVG(reviews.score),0),1)  as averageScore
      FROM reviews 
      WHERE reviews.musical_id = ?
      GROUP BY reviews.musical_id`,
      [musicalId]
    );
    return { averageScore: result ? result.averageScore : 0 };
  } catch (err) {
    throw new CustomError(400, 'dataSource_Error');
  }
};

const createReview = async (userId, content, score, musicalId, reviewImageUrl) => {
  const queryRunner = appDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const createReview = await queryRunner.query(
      `INSERT INTO reviews(
              content,
              score,
              user_id,
              musical_id
          )  VALUES (?,?,?,?)`,
      [content, score, userId, musicalId]
    );
    const reviewId = createReview.insertId;

    await queryRunner.query(
      `INSERT INTO review_images(
        review_images_url,
        review_id
            ) VALUES (?,?)`,
      [reviewImageUrl, reviewId]
    );

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new CustomError(400, 'dataSource_Error');
  } finally {
    await queryRunner.release();
  }
};

const removeReview = async (userId, reviewId) => {
  const queryRunner = appDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const removeReviewImages = await queryRunner.query(
      `DELETE FROM review_images 
        WHERE review_id = ?`,
      [reviewId]
    );

    if (removeReviewImages.affectedRows != 1) throw new CustomError(400, 'dataSource_Error');

    const removeReview = await queryRunner.query(
      `DELETE FROM reviews
        WHERE id = ? AND user_id = ?`,
      [reviewId, userId]
    );

    if (removeReview.affectedRows != 1) throw new CustomError(400, 'dataSource_Error');
   
    await queryRunner.commitTransaction();

  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw new CustomError(400, 'dataSource_Error');
  } finally {
    await queryRunner.release();
  }
};

module.exports = {
  getReviewsByMusicalId,
  getAverageReviewScore,
  createReview,
  removeReview,
};
