const userService = require('../services/userService');
const { catchAsync, CustomError } = require('../utils/error');

const kakaoLogin = catchAsync(async (req, res) => {
  const { kakaoAccessToken } = req.body;

  if (!kakaoAccessToken) throw new CustomError(400, 'KEY_ERROR');

  const token = await userService.kakaoLogin(kakaoAccessToken);
  return res.status(200).json({ token: token });
});

module.exports = {
  kakaoLogin,
};
