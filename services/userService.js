const axios = require('axios');
const userDao = require('../models/userDao');
const jwt = require('jsonwebtoken');
const { CustomError } = require('../utils/error');

const createAccessToken = (userId) => {
  const payLoad = { id: userId };
  const secretKey = process.env.SECRET_KEY;
  return jwt.sign(payLoad, secretKey);
};

const getUserById = async (userId) => {
  return await userDao.getUserById(userId);
};

const kakaoLogin = async (kakaoAccessToken) => {
  const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `bearer ${kakaoAccessToken}`,
    },
  });

  if (!response || response.status !== 200) {
    throw new CustomError(400, 'KAKAO CONNECTION ERROR');
  }

  const {
    id: kakaoId,
    properties: { nickname: nickname, profile_image: profileImage },
    kakao_account: { email, birthday, gender, age_range: ageRange },
  } = response.data;

  let user = await userDao.getUserByKakaoId(kakaoId);

  if (!user) {
    await userDao.createUser(kakaoId, email, profileImage, nickname, birthday, gender, ageRange);
    user = await userDao.getUserByKakaoId(kakaoId);
  }

  const token = createAccessToken(user.id);
  const userNickname = user.profileNickname;
  return [token, userNickname];
};

module.exports = {
  kakaoLogin,
  getUserById,
};
