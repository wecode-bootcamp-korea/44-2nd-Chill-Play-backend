const appDataSource = require('./appDataSource');
const { CustomError } = require('../utils/error');

const getUserByKakaoId = async (kakaoId) => {
  try {
    const [result] = await appDataSource.query(
      `SELECT 
      id,
      kakao_id as kakaoId,
      account_email as accountEmail,
      profile_image as profileImage,
      profile_nickname as profileNickname, 
      birthday,
      gender,
      age_range as ageRange
        FROM users WHERE kakao_id = ?`,
      [kakaoId]
    );

    return result;
  } catch (err) {
    throw new CustomError(400, 'dataSource_Error');
  }
};

const getUserById = async (userId) => {
  try {
    const [result] = await appDataSource.query(
      `SELECT 
        id,
        kakao_id as kakaoId,
        account_email as accountEmail,
        profile_image as profileImage,
        profile_nickname as profileNickname, 
        birthday,
        gender,
        age_range as ageRange
          FROM users WHERE id = ?`,
      [userId]
    );

    return result;
  } catch (err) {
    throw new CustomError(400, 'dataSource_Error');
  }
};

const createUser = async (kakaoId, email, profileImage, nickname, birthday, gender, ageRange) => {
  try {
    const result = await appDataSource.query(
      `INSERT INTO users(
        kakao_id,
        account_email,
        profile_image,
        profile_nickname, 
        birthday,
        gender,
        age_range
          ) VALUES (?,?,?,?,?,?,?)`,
      [kakaoId, email, profileImage, nickname, birthday, gender, ageRange]
    );
    return result;
  } catch (err) {
    throw new CustomError(400, 'dataSource_Error');
  }
};

module.exports = {
  getUserByKakaoId,
  getUserById,
  createUser,
};
