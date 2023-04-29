const dataSource = require('../../models/appDataSource');

const createUsers = (userList) => {
  let data = [];

  for (const user of userList) {
    data.push([
      user.kakao_id,
      user.account_email,
      user.profile_image,
      user.profile_nickname,
      user.birthday,
      user.gender,
      user.age_range,
    ]);
  }

  return dataSource.query(
    `
    INSERT INTO users (
      kakao_id,
      account_email,
      profile_image,
      profile_nickname,
      gender,
      birthday,
      age_range
) VALUES ?
`,
    [data]
  );
};

module.exports = {
  createUsers,
};
