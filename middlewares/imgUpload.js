const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const uuid = require('uuid');

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const imageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `reviewImage/${Date.now()}_${uuid.v4()}_${file.originalname}`);
    },
  }),
});

module.exports = {
  imageUpload,
};
