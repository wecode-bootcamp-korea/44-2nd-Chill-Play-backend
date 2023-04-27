const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const checkLogInToken = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    const secretKey = process.env.SECRET_KEY;

    if (!accessToken) {
      const error = new Error('NEED_ACCESS_TOKEN');
      error.statusCode = 401;

      return res.status(error.statusCode).json({ message: error.message });
    }

    const decoded = jwt.verify(accessToken, secretKey);

    const user = await userService.getUserById(decoded.id);

    if (!user) {
      const error = new Error('USER_DOES_NOT_EXIST');
      error.statusCode = 404;

      return res.status(error.statusCode).json({ message: error.message });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: 'INVALID_TOKEN',
    });
  }
};

module.exports = {
  checkLogInToken,
};
