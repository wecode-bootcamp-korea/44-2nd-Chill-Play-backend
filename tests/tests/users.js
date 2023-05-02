const request = require('supertest');

const axios = require('axios');
const { createApp } = require('../../app');
const dataSource = require('../../models/appDataSource');

jest.mock('axios');

describe('카카오 소셜 로그인 테스트', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS=0');
    await dataSource.query(`TRUNCATE users`);
    await dataSource.query(`ALTER TABLE users AUTO_INCREMENT = 1`);
    await dataSource.query('SET FOREIGN_KEY_CHECKS=1');

    await dataSource.destroy();
  });

  test('🚀 SUCCESS: create User', async () => {
    const response = {
      status: 200,
      data: {
        id: '123456',
        properties: {
          nickname: '테스트',
          profile_image: 'http://chill_play.com',
        },
        kakao_account: {
          email: 'test@test.com',
          birthday: '0923',
          gender: 'male',
          age_range: '10~19',
        },
      },
    };

    axios.get = jest.fn().mockReturnValue(response);

    const res = await request(app).post('/users/kakaologin').send({
      kakaoAccessToken: 'kakaoAccessToken',
    });

    await expect(res.statusCode).toEqual(200);
  });

  test('🚀 SUCCESS:  login with already existing user', async () => {
    const response = await request(app).post('/users/kakaologin').send({
      kakaoAccessToken: 'kakaoAccessToken',
    });

    await expect(response.statusCode).toEqual(200);
  });

  test('❌ FAILED: KEY ERROR', async () => {
    const response = await request(app)
      .post('/users/kakaologin')
      .send({
        kakaoToken: 'kakaoAccessToken',
      })
      .expect(400)
      .expect({ message: 'KEY_ERROR' });
  });

  test('❌ FAILED: KAKAO CONNECTION ERROR  ', async () => {
    await jest.restoreAllMocks();

    const response = await request(app)
      .post('/users/kakaologin')
      .send({
        kakaoAccessToken: ' ',
      })
      .expect(400)
      .expect({ message: 'KAKAO CONNECTION ERROR' });
  });
});
