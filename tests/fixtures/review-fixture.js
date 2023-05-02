const dataSource = require('../../models/appDataSource');

const createReview = (reviewList) => {
  const data = reviewList.map((review) => [
    review.id,
    review.content,
    review.score,
    review.user_id,
    review.musical_id,
  ]);

  return dataSource.query(
    `INSERT INTO reviews(
        id,
        content,
        score,
        user_id,
        musical_id
    )
     VALUES ?
`,
    [data]
  );
};

const createReviewImage = (reviewImageList) => {
  const data = reviewImageList.map((reviewImage) => [
    reviewImage.id,
    reviewImage.review_images_url,
    reviewImage.review_id,
  ]);

  return dataSource.query(
    `INSERT INTO review_images(
          id,
          review_images_url,
          review_id
      )
       VALUES ?
  `,
    [data]
  );
};

module.exports = {
  createReview,
  createReviewImage,
};
